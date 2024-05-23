const { Areas, WaitTimerManager, TimeoutConverter, OccupancyEvent} = require('../models');
const { exists } = require('../../util/common');

const DEFAULT_OCCUPANCY_OBJECT = {
    timeout: undefined,
    state: false,
    last_occupied: undefined,
    last_updated: undefined,
}

class OccupancyService {
    constructor() {
        // Initialize service upon instantiation
        this.areas;
        Object.assign(this, DEFAULT_OCCUPANCY_OBJECT);
        this.area_id;
        this.mode;
        this.initialize();
    }

    initialize() {
        try {

            // Load areas from ./storage/core.area_registry
            const areas = {};

            Object.values(Areas.getAreas()).forEach(area => {
                areas[area.id] = {id: area.id, ...DEFAULT_OCCUPANCY_OBJECT};
            });
        
            // Initialize global occupancy status
            this.areas = areas;
            Object.assign(this, DEFAULT_OCCUPANCY_OBJECT);
            this.area_id = null;
            this.mode = null;
            this.clearTimers();
        } catch (error) {
            // Log the error
            console.log(`OccupancyService Initialization Error: ${error}`);
        }
    }

    getOccupancy(area_id = null) {
        return area_id ? this.areas[this.validateArea(area_id)] : {
            state: this.state,
            last_occupied: this.last_occupied,
            last_updated: this.last_updated,
            timeout: this.timeout,
            area_id: this.area_id,
            mode: this.mode
        };
    }

    setOccupancy(area_id, state = true, timestamp = Date.now(), timeout = null) {

        if (area_id instanceof OccupancyEvent) {
            const occupancyEvent = new OccupancyEvent(area_id);
            area_id = occupancyEvent.getAreaID();
            state = occupancyEvent.getState();
            timestamp = occupancyEvent.getTimestamp();
        }

        // Set timeout if provided
        timeout = timeout || this.getTimeout(area_id);

        // Set occupancy status if true, otherwise wait for timeout before setting occupancy to false
        return (state) ? this._setOccupancy(area_id, true, timestamp) : this.waitForTimeout(area_id, timeout);
    }

    // Private method to update occupancy status
    _setOccupancy(area_id, state = true, timestamp = new Date()) {
        //console.log(`Setting occupancy for area ${area_id} to ${state} at ${timestamp}`);
        
        // Cast timestamp to Date object
        if (!(timestamp instanceof Date)) timestamp = new Date(timestamp);
        
        this.validateArea(area_id);

        // Set last updated
        this.last_updated = timestamp;
        this.areas[area_id].last_updated = timestamp;

        // If area state has changed, update state and last occupied
        if (this.isOccupied(area_id)!== state) {
            this.areas[area_id].state = (state);
            this.areas[area_id].last_occupied = timestamp;
            this.area_id = area_id;
        }

        // If area just became unoccupied and no other areas are occupied, 
        // set (global) occupancy to false, otherwise true
        const current_global_occupancy_state = this.state;
        this.state = (!state && !this.isOccupied()) ? false : true;

        // If Global occupancy state has changed, update last_occupied
        if (current_global_occupancy_state!== this.state) this.last_occupied = timestamp;

    }

    isOccupied(area_id = null) {
        // Return occupancy state for area if specified
        if (area_id) return this.getOccupancy(area_id).state;

        // Check if any areas are occupied
        return Object.values(this.areas).some(area => area.state);
    }

    getMode() {
        return this.mode;
    }

    setMode(mode) {
        this.mode = mode;
    }

    getAreas() {
        return this.areas;
    }

    validateArea(area_id){
        if (!exists(area_id)) throw new Error(`Missing area_id: [${area_id}]`);
        if (!exists(this.areas[area_id])) throw new Error(`Area ${area_id} does not exist`);
        return area_id;
    }

    waitForTimeout(area_id, timeout = null) {   
        timeout = timeout || this.getTimeout(area_id);
    
        // Create a wait timer if a timeout has been set
        if (timeout && area_id) {

            const timer_id = `OccupancyService_${area_id}`;

            // Clear any existing timer for the area
            this.clearTimers(timer_id);
    
            // Set up a new timer
            WaitTimerManager.createWaitTimer(timer_id, () => {
                // Timeout reached
                console.log("setOccupancy function");
                console.log(this._setOccupancy);
                this._setOccupancy(area_id, false);
            }, TimeoutConverter.convertTimeoutString(timeout));
        } else {
            console.log(`[WARN] No timeout set for area (${area_id}): ${timeout}`);
        }
    }

    clearTimers(id = null) {
        if (id) {
            const timer_id = exists(this.areas[id]) ? `OccupancyService_${id}` : id;
            const timer = WaitTimerManager.timers[timer_id];
            if (timer) {
                WaitTimerManager.clearWaitTimer(timer._idleTimeoutId);
            }
        } else {
            Object.values(WaitTimerManager.timers).forEach(timer => {
                WaitTimerManager.clearWaitTimer(timer._idleTimeoutId);
                delete WaitTimerManager.timers[timer.id];
            });
        }
    }

    getTimeout(area_id = null) {

        if (area_id) {

            const area_timeout = this.areas[this.validateArea(area_id)].timeout;

            // Check if timeout is set for the area, otherwise return the global timeout
            return area_timeout ? area_timeout : this.timeout;

        }

        return this.timeout;

    }

    // Set timeout for an area or for the system
    setTimeout(timeout, area_id = null) {

        // Parse timeout string to milliseconds
        timeout = TimeoutConverter.convertTimeoutString(timeout);

        if (area_id) {

            // Set the timeout for the area
            this.areas[this.validateArea(area_id)].timeout = timeout;

            // If no system timeout is set, also set the timeout for the system
            if (!exists(this.timeout)) this.timeout = timeout;

        }
        else {
            // Set the timeout for the system
            this.timeout = timeout;
        }
    }

}

// Singleton instance of the occupancy service
module.exports = new OccupancyService();