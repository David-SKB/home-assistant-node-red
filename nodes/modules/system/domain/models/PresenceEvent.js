const Entities = require('./Entities');
const exists = require('../../util/common/exists');
const personPresenceEventAdapter = require('../../adapters/events/presence/personPresenceEventAdapter');
// Map of state translations
const STATES = {
    'home': true,
    'not_home': false
};

const STATE = (state) => {
    if (typeof state === "boolean") return state;
    if (!exists(state) || typeof state !== "string") return true;
    return STATES[state.toLowerCase()] !== undefined ? STATES[state.toLowerCase()] : true;
};

class PresenceEvent {
    constructor(user_id, state, timestamp) {

        // If already an instance of PresenceEvent, return the instance
        if (user_id instanceof PresenceEvent) return user_id;

        // If event data object is passed, process it
        if (typeof user_id === "object" && state === undefined && timestamp === undefined) {
            const event_data = user_id;
            return this.processEvent(event_data);
        }

        // Otherwise, initialise new instance
        this.user_id = user_id;
        this.state = STATE(state);
        this.timestamp = timestamp || Date.now();
    }

    processEvent(event_data) {
        // Default processing function
        const constructor = this._processEvent(event_data);
        return new PresenceEvent(constructor.user, constructor.state, constructor.timestamp);
    }

    _processEvent(event_data) {
        // Default processing function
        return personPresenceEventAdapter(event_data);
    }

    personPresenceAdapter(event_data) {

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

    getState() {
        return this.state;
    }

    getUser() {
        return this.user_id;
    }

    getTimestamp() {
        return this.timestamp;
    }

    // Setter method for custom event processing function
    setEventProcessingFunction(processEventFunction) {
        if (typeof processEventFunction === 'function') {
            this._processEvent = processEventFunction;
        } else {
            throw new Error('Invalid event processing function provided.');
        }
    }

}

module.exports = PresenceEvent;