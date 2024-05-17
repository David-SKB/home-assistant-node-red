// name: Occupancy State Updater
// outputs: 2
// initialize: // Code added here will be run once\n// whenever the node is started.\n
// finalize: // Code added here will be run when the\n// node is being stopped or re-deployed.\n
// info: 
// Occupancy State Updater
// ******************************************************************
// -*- INPUTS -*-
// msg.payload              : binary_sensor event data
//
// -*- OUTPUTS -*-
// msg.payload              : OccupancyService object
// ******************************************************************

/*** START ***/
const repository = context.global[env.get("MODULE_ID")];
const utils = repository.util.common;
const { getState, exists } = repository.util.common;
const { Entities, TimeoutConverter, OccupancyEvent } = repository.domain.models;
const OccupancyService = repository.domain.services.OccupancyService;
const binarySensorOccupancyAdapter = repository.adapters.binarySensorOccupancyAdapter;

const OCCUPANCY_TIMEOUT_ENTITY_ID = env.get("OCCUPANCY_TIMEOUT_ENTITY_ID") || "input_number.occupancy_timeout";

const event_data = msg.payload;
let status, area_id, states;

if (!exists(event_data)) {
    status = `Missing event data (msg.payload): [${msg.payload}]`;
    return [null, utils.status(status, "red")];
}

try {
    area_id = Entities.getEntity(event_data.entity_id).area_id;
    states = global.get("homeassistant.homeAssistant.states");

    if (area_id) {
        // Check for area occupancy timeout helper
        const area_occupancy_timeout_entity = Entities.getEntityByAttributes(OCCUPANCY_TIMEOUT_ENTITY_ID, [{key:"area_id", value:area_id}]);

        if (area_occupancy_timeout_entity) {
            const timeout = getState(area_occupancy_timeout_entity.entity_id, states).state;
            if (timeout) OccupancyService.setTimeout(TimeoutConverter.convertToMilliseconds(timeout, area_occupancy_timeout_entity.unit_of_measurement), area_id);
            //node.warn(`[WARN]: ${OCCUPANCY_TIMEOUT_ENTITY_ID} found for ${area_id}:  ${area_occupancy_timeout_entity.entity_id}`);
        } else {
            node.warn(`[WARN]: ${OCCUPANCY_TIMEOUT_ENTITY_ID} not found for ${area_id}, skipping.`);
        }
    }
    // Check for (global) occupancy timeout helper
    const occupancy_timeout_entity = Entities.getEntityByAttributes(OCCUPANCY_TIMEOUT_ENTITY_ID);

    if (occupancy_timeout_entity) {
        const timeout = getState(occupancy_timeout_entity.entity_id, states).state;
        if (timeout) OccupancyService.setTimeout(TimeoutConverter.convertToMilliseconds(timeout, occupancy_timeout_entity.unit_of_measurement));
        //node.warn(`[WARN]: ${OCCUPANCY_TIMEOUT_ENTITY_ID} found.`);
    } else {
        node.warn(`[WARN]: ${OCCUPANCY_TIMEOUT_ENTITY_ID} not found, skipping.`);
    }

} catch (error) {
    status = `[ERROR]: ${error}`;
    node.warn(status);
    return [null, utils.status(status, "red")];
}

try {
    node.send([null, utils.status(`Updating Occupancy for [${area_id}]...`, "yellow")]);
    msg.payload = OccupancyService.setOccupancy(new OccupancyEvent(event_data));
} catch (error) {
    status = `[ERROR] (binarySensorOccupancyAdapter): ${error}`;
    node.warn(status);
    return [null, utils.status(status, "red")];
}

return ([msg, utils.status(`Occupancy updated for [${area_id}]`)]);