// name: User Presence Updater
// outputs: 2
// initialize: // Code added here will be run once\n// whenever the node is started.\nnode.status({ fill: "yellow", shape: "dot", text: "Starting..." });
// finalize: // Code added here will be run when the\n// node is being stopped or re-deployed.\n
// info: 
// User Presence Updater
// ******************************************************************
// -*- INPUTS -*-
// msg.payload              : Person event data
//
// -*- OUTPUTS -*-
// msg.payload              : PresenceService object
// ******************************************************************

/*** START ***/
const repository = context.global[env.get("MODULE_ID")];
const utils = repository.util.common;
const PresenceEvent = repository.domain.models.PresenceEvent;
const PresenceService = repository.domain.services.PresenceService;

let status;

try {

    status = "Updating presence...";
    node.status({ fill: "yellow", text: status });

    // Extract the presence event data
    const presenceEvent = new PresenceEvent(msg.payload);

    // Update the presence status
    msg.payload = PresenceService.setPresence(presenceEvent);

    status = `Presence updated (${presenceEvent.getUser()})`;
    node.status(utils.status(status).payload);

    // Return the updated PresenceService object
    return [msg, utils.status(status)];

} catch (error) {
    // Log the error
    node.warn(`[ERROR (PresenceService)]: ${error}`);

    // Set node status to indicate an error occurred
    status = `Error updating presence object: ${error}`;

    node.status({ fill: "red", text: status });
    return [null, utils.status(status, { fill: "red" })];
}


/*** END ***/