function validateButton(buttonConfig) {
    if (buttonConfig instanceof Button) {
        // If buttonConfig is an instance of Button class, we'll validate its commands
        for (const commandId in buttonConfig.commands) {
            if (!buttonConfig.commands.hasOwnProperty(commandId)) {
                continue;
            }
            const command = buttonConfig.commands[commandId];
            if (!(command instanceof Command)) {
                return false; // Invalid command within the button
            }
            // Optionally, add specific validation logic for command configuration here
        }
        return true; // All checks passed
    } else if (typeof buttonConfig === 'object' && buttonConfig !== null && buttonConfig.hasOwnProperty('commands')) {
        // If buttonConfig is an object representation, we'll recursively call validateCommand for each command
        for (const commandId in buttonConfig.commands) {
            if (!buttonConfig.commands.hasOwnProperty(commandId)) {
                continue;
            }
            if (!validateCommand(buttonConfig.commands[commandId])) {
                return false; // Invalid command configuration
            }
        }
        return true; // All checks passed
    } else {
        return false; // Invalid button configuration
    }
}