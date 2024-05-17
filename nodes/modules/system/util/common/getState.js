function getState(entity_id, states) {
    if (!states) {
        throw new Error("States object not provided");
    }
    if (!states.hasOwnProperty(entity_id)) {
        throw new Error(`Invalid entity ID: ${entity_id}`);
    }
    return states[entity_id];
}

module.exports = getState;