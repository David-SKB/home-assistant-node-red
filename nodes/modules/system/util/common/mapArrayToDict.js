function mapArrayToDict(array, key) {
    const array_dictionary = {};

    array.forEach(value => {
        if (value.hasOwnProperty(key)) {
            array_dictionary[value[key]] = value;
        }
    });

    return array_dictionary;
}

module.exports = mapArrayToDict;