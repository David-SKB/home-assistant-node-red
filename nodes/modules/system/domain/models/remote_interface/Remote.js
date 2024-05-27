//const Remote = require("../../domain/models/Remote");
//const Button = require("../../domain/models/Button");
const Button = require("./Button");
const validateButton = require("../../validateButton");

class Remote {
    constructor(remote_id, buttons = {}) {
        this.remote_id = remote_id;
        this.buttons = {};

        // Check if buttons is an instance of Button, if not, convert each entry to a Button instance
        if (!(typeof buttons === 'object')) {
            for (const button in buttons) {
                // TODO: Throw error if button not valid
                this.addButton(button_id, buttons[button_id]);
            }
        }
    }

    addButton(button_id, sourceButton = null) {
        const button = sourceButton instanceof Button ? sourceButton : new Button(button_id, sourceButton);
        this.buttons[button_id] = button;
        return button;
    }

    getId() {
        return this.remote_id;
    }

    getObject() {
        const remoteObject = {};
        Object.keys(this.buttons).forEach(button_id => {
            remoteObject[button_id] = this.buttons[button_id].getObject();
        });
        return remoteObject;
    }
}

//module.exports = Remote;