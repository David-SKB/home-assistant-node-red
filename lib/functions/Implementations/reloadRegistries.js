// name: Reload Areas and Entities
// outputs: 1
// timeout: 
// initialize: // Code added here will be run once\n// whenever the node is started.\n
// finalize: // Code added here will be run when the\n// node is being stopped or re-deployed.\n
// info: 
// Reload Areas and Entities
// Reload registry files for module objects
// ******************************************************************
// -*- INPUTS -*-
// msg                          : existing msg object
//
// -*- OUTPUTS -*-
// msg                          : existing msg object
// ******************************************************************

/*** START ***/
const system = context.global[env.get("MODULE_ID")];
const utils = system.util.common;
const { Areas, Entities } = system.domain.models;

let status = utils.status("Registries reloaded successfully");

try {
    Areas.loadAreaRegistry();
    Entities.loadEntityRegistry();
} catch (error) {
    status = utils.status(`[ERROR]: ${error}`, { fill: "red" });
}

node.status(status.payload);
return [msg, status];

/*** END ***/

/*** HELPERS ***/