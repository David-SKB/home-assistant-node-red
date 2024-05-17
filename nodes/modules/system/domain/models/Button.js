const Command = require("./Command");

class Button {
    constructor(buttonId, commands = {}) {
        this.buttonId = buttonId;
        this.commands = {};

        // Check if commands is an instance of Button, if not, convert each entry to a Command instance
        if (!(commands instanceof Button)) {
            for (const commandId in commands) {
                if (commands.hasOwnProperty(commandId)) {
                    this.addCommand(commandId, commands[commandId]);
                }
            }
        }
    }

    addCommand(commandId, sourceCommand = null) {
        const command = sourceCommand instanceof Command ? sourceCommand : new Command(commandId, sourceCommand);
        this.commands[commandId] = command;
        return command;
    }

    getId() {
        return this.buttonId;
    }

    getObject() {
        const buttonObject = {};
        Object.keys(this.commands).forEach(commandId => {
            buttonObject[commandId] = this.commands[commandId].getObject();
        });
        return buttonObject;
    }
}

// Export an instance of the Areas class
//module.exports = Button;
