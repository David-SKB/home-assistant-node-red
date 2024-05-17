const fs = require('fs');
const mapArrayToDict = require("../../util/common/mapArrayToDict");

class Devices {
    constructor() {
        // Load the device registry upon instantiation
        this.devices = undefined;
        this.device_registry = undefined;
        //this.loadDeviceRegistry();
    }

    loadDeviceRegistry() {
        try {

            // Read the device registry file
            const device_registry_raw = fs.readFileSync('/config/.storage/core.device_registry', 'utf8');

            // Parse the JSON data
            this.device_registry = JSON.parse(device_registry_raw);
            this.devices = mapArrayToDict(this.device_registry.data.devices, "id");
            console.log("Device registry loaded successfully.");
        
        } catch (error) {
            console.log(`[ERROR] Failed to read the device registry: ${error}`);
        }
    }

    getDevice(id) {
        // Look up the device in the loaded device registry
        return this.devices[id];
    }

    getDevices() {
        // Get the loaded device registry
        return this.devices;
    }
}

// Export an instance of the Devices class
module.exports = new Devices();
