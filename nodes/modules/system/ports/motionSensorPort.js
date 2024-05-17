const OccupancyService = require('../domain/services/OccupancyService');

function motionSensorPort(motion_event) {
    try {
        // Update occupancy status based on motion detection
        OccupancyService.updateOccupancyStatus(motion_event.location, motion_event.state === "on");

        const status = `Motion detected [${motion_event.state}] at [${motion_event.location}: ${motion_event.sensor_id}] on [${new Date(motion_event.timestamp)}]`;

        return { motion_event, status };
    } catch (error) {
        // If an error occurs during processing, return the error message
        return { motion_event, status: `Error processing motion event: ${error.message}` };
    }
}

//module.exports = motionSensorPort;
