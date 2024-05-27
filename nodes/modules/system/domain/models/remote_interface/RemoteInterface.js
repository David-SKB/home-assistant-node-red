const Remote = require("../Button");
const Button = require("../Button");
const Command = require("./Command");

class RemoteInterface {
    constructor(remoteConfig = {}) {
        this.remotes = {};
        if (remoteConfig instanceof Remote) {
            this.setRemote(remoteConfig.getId(), remoteConfig);
        } else {
            const remotes = remoteConfig.remotes || {};
            Object.keys(remotes).forEach(remoteId => {
                this.setRemote(remoteId, remotes[remoteId]);
            });
        }
    }

    setRemote(remoteId, sourceRemote = null) {
        if (sourceRemote instanceof Remote) {
            this.remotes[remoteId] = sourceRemote;
        } else if (sourceRemote) {

            if (!validateRemote(sourceRemote)) {
                throw new Error('Invalid remote configuration');
            }
            this.remotes[remoteId] = new Remote(remoteId, sourceRemote);
        } else {
            this.remotes[remoteId] = new Remote(remoteId);
        }
        return this.remotes[remoteId];
    }

    setButton(remoteId, buttonId, sourceButton = null) {
        if (!this.remotes[remoteId]) {
            this.setRemote(remoteId); // Ensure remote exists before setting button
        }
        const button = this.remotes[remoteId].addButton(buttonId, sourceButton);
        return button;
    }

    setCommand(remoteId, buttonId, commandId, sourceCommand = null) {
        if (!this.remotes[remoteId]) {
            this.setRemote(remoteId);
        }
        if (!this.remotes[remoteId].buttons[buttonId]) {
            this.setButton(remoteId, buttonId);
        }
        const button = this.remotes[remoteId].buttons[buttonId];
        const command = button.addCommand(commandId, sourceCommand);
        return command;
    }

    getCommand(remoteId, buttonId, commandId) {
        const remote = this.remotes[remoteId];

        if (!remote) {
            throw new Error(`Remote not found for ID ${remoteId}`);
        }

        const button = remote.buttons[buttonId];
        if (!button) {
            throw new Error(`Button not found for ID ${buttonId}`);
        }

        const command = button.commands[commandId];
        if (!command) {
            throw new Error(`Command not found for ID ${commandId}`);
        }

        return command;
    }

    getRemoteIds() {
        return Object.keys(this.remotes);
    }

    // Ignore this, it's for debugging
    getButtonIds2(remoteId) {
        if (this.remotes[remoteId]) {
            return Object.keys(this.remotes[remoteId].buttons);
        }
        return [];
    }

    getButtonIds(remoteId) {
        if (this.remotes[remoteId]) {
            if (this.remotes[remoteId] instanceof Button) {
                // If the value is an instance of Button, return its ID
                return [this.remotes[remoteId].getId()];
            } else {
                // Otherwise, assume it's an object with button IDs as keys
                return Object.keys(this.remotes[remoteId]);
            }
        }
        return [];
    }

    getCommandIds(remoteId, buttonId) {
        if (this.remotes[remoteId] && this.remotes[remoteId].buttons[buttonId]) {
            return Object.keys(this.remotes[remoteId].buttons[buttonId].commands);
        }
        return [];
    }

    getObject() {
        return {
            remotes: this.remotes
        };
    }
}

// Validation functions
function validateRemote(remoteConfig) {
    if (remoteConfig instanceof Remote) {
        // If remoteConfig is already an instance of Remote, it's valid
        return true;
    } else if (typeof remoteConfig === 'object' && remoteConfig !== null) {
        const remoteInstance = new Remote('remoteId');

        // Iterate over each button in the remote
        Object.keys(remoteConfig).forEach(buttonId => {
            const commandConfigs = remoteConfig[buttonId];
            const buttonInstance = new Button(buttonId);

            // Iterate over each command in the button
            Object.keys(commandConfigs).forEach(commandId => {
                const commandInstance = new Command(commandId, commandConfigs[commandId]);

                // Add the command to the button
                buttonInstance.addCommand(commandId, commandInstance);
            });

            // Add the button to the remote
            remoteInstance.addButton(buttonId, buttonInstance);
        });

        // Validate the remote instance
        const isValid = validateRemote(remoteInstance);
        return isValid;
    } else {
        return false; // Invalid remote configuration
    }
}

//module.exports = RemoteInterface;