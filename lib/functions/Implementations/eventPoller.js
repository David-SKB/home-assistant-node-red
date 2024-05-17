// name: Event Poller 1.5
// outputs: 2
// initialize: // Code added here will be run once\n// whenever the node is started.\n
// finalize: // Code added here will be run when the\n// node is being stopped or re-deployed.\n
// info: 
// Event Poller (v1.4)
// Event Poller
// ******************************************************************
// -*- INPUTS -*-
// msg.reset                : flag to stop polling
// msg.delay                : Global Context identifier
// msg.timeout [OPTIONAL]   : Poller timeout value in ms
//
// -*- OUTPUTS -*-
// msg.payload              : existing message payload
// ******************************************************************

/*** START ***/
const repository = context.global[env.get("MODULE_ID")];
const utils = repository.util.common;


const WaitTimerManager = repository.domain.models.WaitTimerManager;

if (msg.reset) {
    return [msg, utils.status("RESET")];
}

const poll_rate = env.get("POLL_RATE");

if (poll_rate && !isNaN(poll_rate)) {
    msg.delay = poll_rate;
    if (typeof poll_rate  === "number") return [msg, utils.status(`${msg.delay} milliseconds`)];
    
}

if (msg.timeout === 0) {
    msg.timeout = null;
}

// Return if no delay provided
if (!msg.delay) {
    return [null, utils.status(`Missing msg.delay: ${msg.delay}`, { fill: "red" })];
}

// Create wait timer for delay value
WaitTimerManager.createWaitTimer(msg.delay, (error) => {
    if (error) {
        node.send([null, utils.status(`Error retrieving delay context: ${error.message}`, { fill: "red" })]);
    } else {
        const delay = global.get(msg.delay);
        if (delay) {
            msg.delay = delay;
            node.send([msg, utils.status(`${delay} milliseconds`)]);
        } else {
            node.send([null, utils.status(`Missing msg.delay: ${msg.delay}`, { fill: "orange" })]);
        }
    }
}, msg.timeout);

node.send([null, utils.status(`Waiting for ${msg.delay}...`, { fill: "yellow" })]);

/*** END ***/
