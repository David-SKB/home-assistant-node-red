const titleCase = require('../../../../../../../util/common/titleCase');
const Template = require('../../../../Template');
const { validateSelectMode, SelectModes } = require('./config');

/**
 * @description
 * Generates a YAML template for inclusion/exclusion input text.
 * Stores the list of items to include/exclude.
 * 
 * @param {Object} [options] - Configuration options.
 * @param {string} [options.name] - The display name of the button group.
 * @param {string} [options.unique_id] - Unique identifier for the template.
 * @param {string} [options.select_mode] - Mode for the buttons. See [SelectModes](./config.js) for valid modes.
 * @param {string} [options.path] - (Optional) Custom file path for the template.
 */
class InclusionsExclusionsInputText extends Template {
  constructor({

    name,
    unique_id,
    select_mode = 'INCLUSION',
    
    path,
    ...options

  } = {}) {

    const primary_mode = SelectModes[validateSelectMode(select_mode)].primary;

    super({ 

      // Required
      name,
      unique_id,
      select_mode,
      
      // Defaults
      base_path: "/config/.storage/templates/components/ui/config/inclusion_exclusion_select/",
      file_name: `${unique_id}_${primary_mode}s_input_text.yaml`,

      // Optional Overrides
      path,
      ...options

    });

    this.template = this.build();

  }

  /**
   * @description
   * Builds the YAML template for the inclusions/exclusions input text.
   * This template defines an `input_text` entity to store the list of included or excluded items.
   * 
   * @param {string} [name] - The display name of the button group.
   * @param {string} [unique_id] - Unique identifier for the template.
   * @param {string} [select_mode] - Mode for the buttons. See [SelectModes](./config.js) for valid modes.
   * @returns {string} - YAML template string.
   */
  build = ({
    
    name = this.name,
    unique_id = this.unique_id, 
    select_mode = this.select_mode,

  } = {}) => {

    select_mode = SelectModes[validateSelectMode(select_mode)];

    return `
input_text:
  ${unique_id}_${select_mode.primary}s:
    name: ${name} ${titleCase(select_mode.primary)}s
    `;

  }

}

module.exports = InclusionsExclusionsInputText;