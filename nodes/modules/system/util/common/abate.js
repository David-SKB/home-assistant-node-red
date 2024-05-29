// Remove character from end of string
function abate(value, character) {

  // Check if end of string matches character(s) 
  if (value.charAt(value.length - character.length) === character) {

      // Abate character if found
      value = value.substring(0, value.length - character.length);
  }

  return value;

}

module.exports = abate;