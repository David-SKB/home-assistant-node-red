function stripCharacter(str, char = '"') {
  const escapedChar = char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special characters for regex
  const regex = new RegExp(`^${escapedChar}+|${escapedChar}+$`, 'g');
  return str.replace(regex, '');
}

module.exports = stripCharacter;