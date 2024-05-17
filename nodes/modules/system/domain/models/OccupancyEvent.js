const Entities = require('./Entities');
const exists = require('../../util/common/exists');
const binarySensorOccupancyEventAdapter = require('../../adapters/events/occupancy/binarySensorOccupancyEventAdapter');

// Map of state translations
const STATES = {
    'on': true,
    'off': false
};

const STATE = (state) => {
    if (!exists(state)) return true;
    if (typeof state === "boolean") return state;
    return STATES[state.toLowerCase()] !== undefined ? STATES[state.toLowerCase()] : true;
};


class OccupancyEvent {
    constructor(entity_id, area_id = null, timestamp = null, state, attr = {}) {

        // If already an instance of OccupancyEvent, return the instance
        if (entity_id instanceof OccupancyEvent) return entity_id;

        // If only event data object is passed, process it
        if (typeof entity_id === 'object' && area_id === null && timestamp === null && state === undefined && Object.keys(attr).length === 0) {
            const event_data = entity_id;
            return this.processEvent(event_data);
        }

        // If nothing passed, return the instance
        if (typeof entity_id === 'undefined' && area_id === null && timestamp === null && state === undefined && Object.keys(attr).length === 0) {
            return this;
        }

        // Set required attributes
        this.entity_id = entity_id;
        this.area_id = area_id || Entities.getEntity(entity_id).area_id;
        this.timestamp = timestamp || Date.now();
        // Cast to date if not already a date object
        if (!(this.timestamp instanceof Date)) this.timestamp = new Date(this.timestamp);
        this.event_processing_functions = {};
        
        // if state contains attributes, extract them
        if (typeof state === "object") {
            attr = state;
            state = attr.state;
        }
        // Spread additional attributes
        if (attr) Object.assign(this, attr);

        // Set state to boolean equivalent
        this.state = STATE(state);

    }

    processEvent(event_data) {
        const constructor = this._processEvent(event_data);
        // Default processing function
        return new OccupancyEvent(constructor.entity_id, constructor.area_id, constructor.timestamp, constructor.state, constructor.event_data);
    }

    _processEvent(event_data) {
        // Default processing function
        return binarySensorOccupancyEventAdapter(event_data);
    }

    processBinarySensorEvent(event_data) {
        if (!event_data) {
            throw new Error(`[ERROR]: Missing Binary Sensor event data: ${event_data}`);
        }
        const entity = Entities.getEntity(event_data.entity_id);
        if (!entity) {
            throw new Error(`[ERROR]: Entity not found [${event_data.entity_id}]`);
        }
        const area_id = entity.area_id;
        if (!area_id) {
            throw new Error(`No area set for [${event_data.entity_id}]`);
        }
        // Set state to boolean equivalent
        event_data.state = event_data.state ? true : false;

        return new OccupancyEvent(event_data.entity_id, area_id, event_data.last_changed, event_data);
    }

    getEntityID() {
        return this.entity_id;
    }

    getAreaID() {
        return this.area_id;
    }

    getTimestamp() {
        return this.timestamp;
    }

    getState() {
        return this.state;
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

module.exports = OccupancyEvent;