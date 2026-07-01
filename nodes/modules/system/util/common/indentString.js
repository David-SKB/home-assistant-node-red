function indentString(str, spaces = 2) {
  const indent = ' '.repeat(spaces); // Default indentation of 2 spaces
  return str.split('\n').map(line => indent + line).join('\n');
}

module.exports = indentString;