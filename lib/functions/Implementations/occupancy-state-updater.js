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
// msg.payload              : OccupancyService occupancy object
// ******************************************************************

/*** START ***/
const repository = context.global[env.get("MODULE_ID")];
const utils = repository.util.common;
const { getState, exists } = repository.util.common;
const { Entities, TimeoutConverter } = repository.domain.models;
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
    const entity_registry_array = Entities.entity_registry.data.entities;

    if (area_id) {
        // Check for area occupancy timeout helper
        const area_occupancy_timeout_entity = entity_registry_array.filter(entity => {
            return (
                entity.entity_id.includes(Entities.stripDomain(OCCUPANCY_TIMEOUT_ENTITY_ID)) &&
                entity.entity_id.includes(Entities.getDomain(OCCUPANCY_TIMEOUT_ENTITY_ID)) &&
                entity.area_id == area_id
            );
        })[0];

        if (area_occupancy_timeout_entity) {
            //node.warn(`[area_occupancy_timeout_entity]: ${area_occupancy_timeout_entity.entity_id}`);
            const timeout = getState(area_occupancy_timeout_entity.entity_id, states).state;
            if (timeout) OccupancyService.setTimeout(TimeoutConverter.convertToMilliseconds(timeout, area_occupancy_timeout_entity.unit_of_measurement), area_id);
        } else {
            node.warn(`[WARN]: ${OCCUPANCY_TIMEOUT_ENTITY_ID} not found for ${area_id}, skipping.`);
        }
    }
    // Check for (global) occupancy timeout helper
    const occupancy_timeout_entity = entity_registry_array.filter(entity => {
        return (
            entity.entity_id.includes(Entities.stripDomain(OCCUPANCY_TIMEOUT_ENTITY_ID)) &&
            entity.entity_id.includes(Entities.getDomain(OCCUPANCY_TIMEOUT_ENTITY_ID)) &&
            entity.area_id == null
        );
    })[0];

    if (occupancy_timeout_entity) {
        //node.warn(`[occupancy_timeout_entity]: ${occupancy_timeout_entity.entity_id}`);
        const timeout = getState(occupancy_timeout_entity.entity_id, states).state;
        if (timeout) OccupancyService.setTimeout(TimeoutConverter.convertToMilliseconds(timeout, occupancy_timeout_entity.unit_of_measurement));
    } else {
        node.warn(`[WARN]: ${OCCUPANCY_TIMEOUT_ENTITY_ID} not found, skipping.`);
    }

    // Allow for override with msg.delay
    if (exists(msg.delay)) OccupancyService.setTimeout(msg.delay);

} catch (error) {
    status = `[ERROR]: ${error}`;
    node.warn(status);
    return [null, utils.status(status, "red")];
}

try {
    node.send([null, utils.status(`Updating Occupancy for [${area_id}]...`, "yellow")]);
    msg.payload = binarySensorOccupancyAdapter(event_data);
} catch (error) {
    status = `[ERROR] (binarySensorOccupancyAdapter): ${error}`;
    return [null, utils.status(status, "red")];
}

return ([msg, utils.status(`Occupancy updated for [${area_id}]`)]);