// name: Generate Templates
// outputs: 1
// timeout: 0
// initialize: // Code added here will be run once\n// whenever the node is started.\n
// finalize: // Code added here will be run when the\n// node is being stopped or re-deployed.\n
// info: 
// Generate Templates
// Generate Dynamic Templates for writing to file
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

let status = utils.status('Templates generated successfully');

// Generate Templates
try {
    context.global[env.get("MODULE_ID")].domain.templates.generators.generateDynamicTemplates();

} catch (error) {
    status = utils.status(`[ERROR]: ${error}`, { fill: "red" });
}

// Set node / subflow status
node.status(status.payload);
return [msg, status];

/*** END ***/

/*** HELPERS ***/