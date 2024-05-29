// Append character to end of string if not present
function append(value, character) {

  // Check if end of string matches character
  if (value.charAt(value.length - character.length) !== character) {

      // Append character if not found
      value = value + character;
  }

  return value;

}

module.exports = append;