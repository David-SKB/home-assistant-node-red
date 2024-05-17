// Create a new object and assign message to payload
function status(text, properties = {}) {
    
    const { fill, shape, ...rest } = properties;
    
    return {
        "payload": {
            fill: fill || 'green',
            shape: shape ||'dot',
            text,
            ...rest
        }
    };
}

module.exports = status;