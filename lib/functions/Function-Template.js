// name: Function Template
// outputs: 1
// initialize: // Code added here will be run once\n// whenever the node is started.
// finalize: // Code added here will be run when the\n// node is being stopped or re-deployed.\n
// info: 
// Function Template (v2)
// Just a function template..
// ******************************************************************
// -*- INPUTS -*-
// msg.payload              : current entity state value
// msg.global_id            : Global Context identifier
//
// -*- OUTPUTS -*-
// msg.payload              : Value
// msg.global_id            : Global Context identifier
// ******************************************************************

/*** START ***/
const system = context.global[env.get("MODULE_ID")];
const utils = system.util.common;

return msg;
/*** END ***/

/*** HELPERS ***/
