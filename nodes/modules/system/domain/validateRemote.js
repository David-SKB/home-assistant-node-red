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