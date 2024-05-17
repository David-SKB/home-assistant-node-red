// name: Occupancy Mode Updater
// outputs: 2
// initialize: // Code added here will be run once\n// whenever the node is started.\nnode.status({ fill: "yellow", shape: "dot", text: "Starting" });
// finalize: // Code added here will be run when the\n// node is being stopped or re-deployed.\n
// info: 
// Occupancy Mode Updater
// Determine Occupancy Mode
// ******************************************************************
// -*- INPUTS -*-
// env.ENTITY_ID            : Occupancy Mode Entity ID
//
// -*- OUTPUTS -*-
// msg.payload              : Current occupancy mode
// msg.entity_id            : Occupancy Mode Entity ID
// ******************************************************************

/*** START ***/
const repository = context.global[env.get("MODULE_ID")];
const utils = repository.util.common;
const OccupancyService = repository.domain.services.OccupancyService;
const PresenceService = repository.domain.services.PresenceService;
const OCCUPCANY_MODE_ENTITY_ID = msg.entity_id = env.get("ENTITY_ID") || "input_select.occupancy_mode";

// Define occupancy modes
const OCCUPANCY_MODES = {
    HOME: 'HOME',
    AWAY: 'AWAY',
    SLEEP: 'SLEEP',
    GUEST: 'GUEST',
    UNKNOWN: 'UNKNOWN',
    ROGUE:'PROTOCOL_1'
};

const MATCH = {
    ENTRY_EXIT_AREA: 'kitchen',     // String (Area ID)
    SLEEP_AREA: 'bedroom'           // String (Area ID)
};

// Define rules for each occupancy mode
const occupancyRules = {
    [OCCUPANCY_MODES.HOME]: () => {
        // Return if guest mode enabled
        if (guestModeConditionsMet()) return false;

        // Base logic to determine if the home is occupied based on occupancy and presence
        return homeModeConditionsMet();
    },
    [OCCUPANCY_MODES.AWAY]: () => {
        
        // Return if guest mode enabled
        if (guestModeConditionsMet()) return false;

        // Base logic to determine if the home is empty based on occupancy and presence
        // todo - and last occupied area is entry_exit area? To detect guests/intruders
        return awayModeConditionsMet();
    },
    [OCCUPANCY_MODES.SLEEP]: () => {

        // Return if guest mode enabled
        if (guestModeConditionsMet()) return false;
        
        // Base logic to determine if the home is in sleep mode based on occupancy and presence
        return sleepModeConditionsMet();
            },
    [OCCUPANCY_MODES.GUEST]: () => {

        // Base logic to determine if there are guests based on occupancy information
        return guestModeConditionsMet();
    }
};

// Determine Occupancy Mode
let status;

// Error if missing service data
if (!OccupancyService) { 
    status = `Missing OccupancyService object: ${OccupancyService}`;
    node.status(utils.status(status, { fill: "red" }).payload);
    return [null, utils.status(status, { fill: "red" })];
}
if (!PresenceService) {
    status = `Missing PresenceService object: ${PresenceService}`;
    node.status(utils.status(status, { fill: "red" }).payload);
    return [null, utils.status(status, { fill: "red" })];
}

const occupancy_mode_entity = global.get("homeassistant.homeAssistant.states")[OCCUPCANY_MODE_ENTITY_ID];
let current_occupancy_mode = occupancy_mode_entity ? occupancy_mode_entity.state : null;

OccupancyService.setOccupancyMode(current_occupancy_mode || OccupancyService.getOccupancyMode() || OCCUPANCY_MODES.UNKNOWN);
const occupancy_mode = determineOccupancyMode();
node.status(utils.status(occupancy_mode).payload);

msg.payload = occupancy_mode;
return [msg, utils.status(occupancy_mode)];

/*** END ***/

/*** HELPERS ***/

// Function to determine the current occupancy mode
function determineOccupancyMode() {
    for (const mode in occupancyRules) {
        if (occupancyRules[mode]) return mode;
    }
    // Default to UNKNOWN mode if no other mode matches
    return OCCUPANCY_MODES.UNKNOWN;
}

function homeModeConditionsMet() {
    return (
        OccupancyService.isOccupied() === true ||                           // Occupied
        PresenceService.isPresent() === true                                // User(s) present                       
    );
}

function awayModeConditionsMet() {
    return (
        // Unoccupied and no User(s) present
        !OccupancyService.isOccupied() && !PresenceService.isPresent()
    );
}

function guestModeConditionsMet() {
    // Guest mode manually enabled
    return OccupancyService.getOccupancyMode() === OCCUPANCY_MODES.GUEST;
}

function sleepModeConditionsMet() {
    return (
        OccupancyService.getLastOccupiedArea() == MATCH.SLEEP_AREA &&  // Last occupied area = sleep area
        OccupancyService.isOccupied() == false &&                           // Unoccupied (inactivity) 
        PresenceService.isPresent() == true                                 // User(s) present                            
    );
}