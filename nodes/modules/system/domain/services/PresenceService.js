const { Entities, PresenceEvent} = require('../models');
const { exists } = require('../../util/common');

class PresenceService {

    constructor() {
        this.users
        this.state, 
        this.last_updated, 
        this.last_present, 
        this.user_id;

        // Initialize service upon instantiation
        this.initialize();
    }

    initialize() {

        const entities = Entities.getEntities();
        const users = {};

        // Filter entities for persons
        for (const entity_id in entities) {

            if (entity_id.startsWith("person.")) {

                // Extract user name without the "person." prefix
                const id = entity_id.split(".")[1];
                
                //  Initialize presence user object
                users[id] = {id, state: null, last_updated: null, last_present: null};
            }

        };

        this.users = users;
        this.state = null, 
        this.last_updated = null, 
        this.last_present = null, 
        this.user_id = null
        
    }

    getPresence(user_id = null) {
        return user_id ? this.users[this.validateUser(user_id)] : { 
            state: this.state, 
            last_updated: this.last_updated, 
            last_present: this.last_present, 
            user_id: this.user_id
        };
    }

    // Method to update Presence status
    setPresence(user_id, state = true, timestamp = Date.now()) {

        // If user_id is an instance of PresenceEvent, extract user_id, state, and timestamp
        if ( typeof user_id === 'object') {
            const presenceEvent = new PresenceEvent(user_id);
            user_id = presenceEvent.getUser();
            state = presenceEvent.getState();
            timestamp = presenceEvent.getTimestamp();
        } 

        // Validate user_id
        user_id = this.validateUser(user_id)

        // Set last updated
        this.last_updated = timestamp;
        this.users[user_id].last_updated = timestamp;

        // Set last updated user id
        this.user_id = user_id;

        // If user state has changed, update state and last present
        if (this.isPresent(user_id) !== state) {
            this.users[user_id].state = (state);
            this.users[user_id].last_present = timestamp;
        }

        const current_global_presence_state = this.state;
        
        // If user just left and no other users are present, set (global) presence to false, otherwise true
        this.state = (!state && !this.isPresent()) ? false : true;

        // If global presence state has changed, update last_present
        if (current_global_presence_state != this.state) {
            this.last_present = timestamp;
        }

    }

    isPresent(user_id = null) {
        // Return present state for user if specified
        if (user_id) return this.getPresence(user_id).state;

        // Check if any user is present
        return Object.values(this.users).some(user => user.state);
    }

    getUsers() {
        return this.users;
    }

    validateUser(user_id){
        if (!exists(user_id)) throw new Error(`Missing user_id: [${user_id}]`);
        const user = Entities.stripDomain(user_id);
        if (!exists(this.users[user])) throw new Error(`User [${user}] does not exist`);
        return user;
    }

}

// Export singleton instance of the presence service
module.exports = new PresenceService();