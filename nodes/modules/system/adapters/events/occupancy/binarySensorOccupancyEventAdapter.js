const exists = require("../../../util/common/exists");
const Entities = require("../../../domain/models/Entities");
//const OccupancyService = require("../../../domain/services/OccupancyService");

function binarySensorOccupancyEventAdapter(event_data) {
    
    if (!exists(event_data)) throw new Error(`Missing binary sensor event data: [${event_data}]`);

    // Extract event data from new state if not already passed
    if (exists(event_data.new_state)) event_data = event_data.new_state;

    //if (!exists(OccupancyEvent)) throw new Error(`Missing OccupancyEvent object: [${OccupancyEvent}]`);

    const entity_id = event_data.entity_id;
    if (!exists(entity_id)) throw new Error(`Missing entity ID (event_data.entity_id): [${entity_id}]`);

     const state = event_data.state;
    // if (!exists(state)) throw new Error(`Missing state (event_data.state): [${state}]`);

    const area_id = Entities.getEntity(entity_id).area_id;
    if (!exists(area_id)) throw new Error(`Entity area not set (${entity_id}): [${area_id}]`);

    const timestamp = event_data.last_updated;
    if (!exists(timestamp)) throw new Error(`Missing timestamp (event_data.last_updated): [${timestamp}]`);

    const constructor = { entity_id, area_id, timestamp, state, event_data };
    return constructor;
    //return new OccupancyEvent(entity_id, area_id, timestamp, state, event_data);

}

module.exports = binarySensorOccupancyEventAdapter;