const SelectModes = {
  INCLUSION: {
    primary: 'inclusion',
    secondary: 'exclusion',
  },
  EXCLUSION: {
    primary: 'exclusion',
    secondary: 'inclusion',
  },
  // Additional modes can be added here as needed.
};

/**
 * Validates and returns the mapped select_mode ID if valid.
 * @param {string} select_mode - The select_mode to validate.
 * @throws {Error} If the select_mode is invalid.
 * @returns {string} The mapped select_mode
 */
function validateSelectMode(select_mode) {
  select_mode = select_mode.toUpperCase();
  if (!Object.keys(SelectModes).includes(select_mode)) {
    throw new Error(`Invalid select_mode: ${select_mode}. Must be one of ${Object.keys(SelectModes).join(', ')}.`);
  }
  return select_mode;
}

module.exports = {
  SelectModes,
  validateSelectMode
};
