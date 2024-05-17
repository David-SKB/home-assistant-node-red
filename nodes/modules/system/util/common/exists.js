// Check if a value exists
function exists(value) {

    var valueType = typeof value;

    // Check for empty string
    if (valueType === "string") {
        if (value == "" || (value.length == 0)) return false;
    }

    // null check
    if (value === null) return false;

    // undefined check
    if (valueType === "undefined") return false;

    // Empty object check
    if (valueType == "object") {
        if (Object.keys(value).length === 0) return false;
    }

    //return value != ("" || undefined || null || (value.length == 0));
    return true;

}

module.exports = exists;