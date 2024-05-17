const exists = require("../../../util/common/exists");
//const PresenceEvent = require('../../../domain/models/PresenceEvent');

function personPresenceEventAdapter(event_data) {

    if (!exists(event_data)) throw new Error(`Missing Person Event Data: [${event_data}]`);

    // Extract event data from new state if not already passed
    if (exists(event_data.new_state)) event_data = event_data.new_state;

    const state = event_data.state;

    if (!exists(state)) throw new Error(`Missing state (event_data.new_state.state): [${state}]`);

    const user = event_data.entity_id;

    if (!exists(user)) throw new Error(`Missing user (event_data.entity_id): [${user}]`);

    const constructor = { user, state };
    return constructor;
    //return new PresenceEvent(user, state);
}

module.exports = personPresenceEventAdapter;