function getRandomIndex(array) {
    if (!Array.isArray(array) || array.length === 0) {
        throw new Error('Input must be a non-empty array');
    }
    
    return array[Math.floor(Math.random() * array.length)];
}

module.exports = getRandomIndex;