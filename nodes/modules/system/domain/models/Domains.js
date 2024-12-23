const fs = require('fs');
const mapArrayToDict = require("../../util/common/mapArrayToDict");

class Domains {
    constructor() {
        // Load the Domain registry upon instantiation
        this.domains = undefined;
        this.loadDomainRegistry();
    }

    loadDomainRegistry() {
        try {

            // Read the domain registry file
            const domain_registry_raw = fs.readFileSync('/config/.storage/core.domain_registry', 'utf8');

            // Parse the JSON data
            this.domains = JSON.parse(domain_registry_raw);
            console.log("Domain registry loaded successfully.");

        } catch (error) {
            console.log(`[ERROR] Failed to read the domain registry: ${error}`);
        }
    }

    isDomain(id) {
        // Check if the id exists in the domain list
        return this.domains.includes(id);
    }
    

    getDomains() {
        // Get the loaded domain registry
        return this.domains;
    }
}

// Export an instance of the Domains class
module.exports = new Domains();
