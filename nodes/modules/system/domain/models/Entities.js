const fs = require('fs');
const mapArrayToDict = require('../../util/common/mapArrayToDict');

class Entities {
    constructor() {
        // Load the entity registry upon instantiation
        this.entities = undefined;
        this.entity_registry = undefined;
        this.loadEntityRegistry();
    }

    loadEntityRegistry() {
        try {
            // Read the entity registry file
            const entity_registry_raw = fs.readFileSync('/config/.storage/core.entity_registry', 'utf8');
            
            // Parse the JSON data
            this.entity_registry = JSON.parse(entity_registry_raw);
            this.entities = mapArrayToDict(this.entity_registry, "entity_id");
            console.log("Entity registry loaded successfully.");

        } catch (error) {
            console.log(`[ERROR] Failed to read the entity registry: ${error}`);
        }
    }

    getEntity(entity_id) {
        // Look up the entity in the loaded entity registry
        return this.entities[entity_id];
    }

    getEntities() {
        // Get the loaded entity registry
        return this.entities;
    }

    getEntitiesByAttributes(entity_id, attributes = []) {

        const entity_registry_data = this.entity_registry;

        const matches = entity_registry_data.filter(entity => {

            const domain = this.getDomain(entity_id);
            const stripped_entity_id = this.stripDomain(entity_id);

            if (domain === stripped_entity_id) {
                // If the domain matches the stripped entity ID, only one comparison needed
                return (
                    entity.entity_id.includes(entity_id) &&
                    attributes.every(attr => entity[attr.key] === attr.value)
                );
            } else {
                return (
                    // If domain and stripped entity ID are different, compare against both
                    this.stripDomain(entity.entity_id).includes(stripped_entity_id) &&
                    this.getDomain(entity.entity_id) === domain &&
                    attributes.every(attr => entity[attr.key] === attr.value)
                );
            }

        });
        return matches;
    }
    
    getEntityByAttributes(entity_id, attributes) {
        const matches = this.getEntitiesByAttributes(entity_id, attributes);
        if (matches.length === 0) {
            return null;
        } else if (matches.length === 1) {
            return matches[0];
        } else {
            // Sort matches based on the length of the entity_id
            matches.sort((a, b) => a.entity_id.length - b.entity_id.length);
            return matches[0];
        }
    }
    

    stripDomain(entity_id) {

        if (typeof entity_id !=='string') throw new Error(`Invalid entity_id: [${entity_id}]`);
       
        // Extract parts from entity ID
        const parts = entity_id.split('.');
        
        // Return as is if not an entity ID
        if (parts.length !== 2) return entity_id;
        
        // Return entity name
        return  parts[1];
        
    }

    getDomain(entity_id) {
    
        // Extract parts from entity ID
        const parts = entity_id.split('.');

        // Return as is if not an entity ID
        if (parts.length !== 2) return entity_id;
        
        // Return domain
        return parts[0];

    } 
    
}

// Export an instance of the Entities class
module.exports = new Entities();