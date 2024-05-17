const exists = require('../../util/common/exists');

class WaitTimerManager {
    constructor() {
        this.timers = {};
    }

    createWaitTimer(id, callback, timeout) {
        if (!exists(id)) {
            throw new Error(`Invalid ID: ${id}`);
        };
    
        if (!exists(callback)) {
            throw new Error('Callback is not provided');
        };
    
        // If a timer with the same ID exists, clear it first
        if (this.timers[id]) {
            clearTimeout(this.timers[id]);
        };
    
        if (!exists(timeout) || timeout <= 0) {
            throw new Error(`Invalid timeout: ${timeout}`);
        };

        // Create a new timer with the provided timeout and callback
        this.timers[id] = setTimeout(() => {
            callback();
            delete this.timers[id]; // Clear the timer after callback execution
        }, timeout);
    }

    clearWaitTimer(id) {
        if (this.timers[id]) {
            clearTimeout(this.timers[id]);
            delete this.timers[id];
        }
    }
}

// Singleton instance of CustomWaitTimerManager
module.exports = new WaitTimerManager();
