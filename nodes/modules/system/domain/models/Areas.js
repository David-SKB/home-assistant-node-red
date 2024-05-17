const fs = require('fs');
const mapArrayToDict = require("../../util/common/mapArrayToDict");

class Areas {
    constructor() {
        // Load the area registry upon instantiation
        this.areas = undefined;
        this.area_registry = undefined;
        this.loadAreaRegistry();
    }

    loadAreaRegistry() {
        try {

            // Read the area registry file
            const area_registry_raw = fs.readFileSync('/config/.storage/core.area_registry', 'utf8');

            // Parse the JSON data
            this.area_registry = JSON.parse(area_registry_raw);
            this.areas = mapArrayToDict(this.area_registry, "id");
            console.log("Area registry loaded successfully.");

        } catch (error) {
            console.log(`[ERROR] Failed to read the area registry: ${error}`);
        }
    }

    getArea(id) {
        // Look up the area in the loaded area registry
        return this.areas[id];
    }

    getAreas() {
        // Get the loaded area registry
        return this.areas;
    }
}

// Export an instance of the Areas class
module.exports = new Areas();
