function normalizeMultilineString(str) {
  return  str.replace(/\s+/g, ' ').trim();
}

module.exports = normalizeMultilineString;