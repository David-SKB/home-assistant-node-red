class Command {
    constructor(commandId, action = {}) {
        this.commandId = commandId;
        this.action = action;
    }

    getId() {
        return this.commandId;
    }

    getObject() {
        return this.action;
    }
}

// Export an instance of the Areas class
//module.exports = Command;
