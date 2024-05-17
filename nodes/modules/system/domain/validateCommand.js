function validateCommand(commandConfig) {
    if (commandConfig instanceof Command) {
        // If commandConfig is an instance of Command class, it's valid
        return true;
    } else if (typeof commandConfig === 'object' && commandConfig !== null) {
        // If commandConfig is an object representation, we'll check its properties
        if (commandConfig.hasOwnProperty('commandId') && commandConfig.hasOwnProperty('action')) {
            // Optionally, add specific validation logic for command configuration here
            return true; // All checks passed
        }
    }
    return false; // Invalid command configuration
}