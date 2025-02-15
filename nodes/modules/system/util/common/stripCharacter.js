function stripCharacter(str, char = '"') {

  if (str === undefined) {
    throw new TypeError("Error in stripCharacter: Cannot read properties of undefined (reading \'replace\')");
  }

  const escapedChar = char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special characters for regex
  const regex = new RegExp(`^${escapedChar}+|${escapedChar}+$`, 'g');

  return str.replace(regex, '');
  
}

module.exports = stripCharacter;