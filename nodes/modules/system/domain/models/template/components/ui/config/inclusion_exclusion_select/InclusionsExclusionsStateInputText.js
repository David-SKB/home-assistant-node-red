const { titleCase } = require('../../../../../../../util/common');
const Template = require('../../../../Template');
const { SelectModes, validateSelectMode } = require('./config');

/**
 * @description
 * Generates a YAML template for inclusion/exclusion state input text.
 * Stores the state of the inclusions/exclusions template selects.
 * 
 * @param {Object} [options] - Configuration options.
 * @param {string} [options.name] - The display name of the button group.
 * @param {string} [options.unique_id] - Unique identifier for the template.
 * @param {string} [options.path] - (Optional) Custom file path for the template.
 */
class InclusionsExclusionsStateInputText extends Template {
  constructor({

    name,
    unique_id,
    select_mode,

    path,
    ...options

  } = {}) {

    const validated_mode = SelectModes[validateSelectMode(select_mode)];

    super({ 

      // Required
      name,
      unique_id,
      select_mode,
      
      // Defaults
      base_path: "/config/.storage/templates/components/ui/config/inclusion_exclusion_select/",
      file_name: `${unique_id}_${validated_mode.primary}s_${validated_mode.secondary}s_state_input_text.yaml`,

      // Optional Overrides
      path,
      ...options

    });

    this.template = this.build();

  }

  /**
   * @description
   * Builds the YAML template for the inclusion/exclusion state input text.
   * Stores the state of the inclusions/exclusions template selects.
   * 
   * @param {string} [name] - The display name of the button group.
   * @param {string} [unique_id] - Unique identifier for the template.
   * @returns {string} - YAML template string.
   */
  build = ({
    
    name = this.name,
    unique_id = this.unique_id,
    select_mode =this.select_mode,

  } = {}) => {

    select_mode = SelectModes[validateSelectMode(select_mode)];

  return `
input_text:
  ${unique_id}_${select_mode.primary}s_state:
    name: ${name} ${titleCase(select_mode.primary)}s State

  ${unique_id}_${select_mode.secondary}s_state:
    name: ${name} ${titleCase(select_mode.secondary)}s State
    `;

  }

}

module.exports = InclusionsExclusionsStateInputText;