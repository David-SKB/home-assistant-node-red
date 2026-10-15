const titleCase = require('../../../../../../../util/common/titleCase');
const Template = require('../../../../Template');
const { validateSelectMode, SelectModes } = require('./config');

/**
 * @description
 * Generates a YAML template for inclusion/exclusion input buttons.
 * 
 * @param {Object} [options] - Configuration options.
 * @param {string} [options.name] - The display name of the button group.
 * @param {string} [options.unique_id] - Unique identifier for the template.
 * @param {string} [options.select_mode] - Mode for the buttons. See [SelectModes](./config.js) for valid modes.
 * @param {string} [options.add_icon] - Material Design icon for add button.
 * @param {string} [options.remove_icon] - Material Design icon for remove button.
 * @param {string} [options.path] - (Optional) Custom file path for the template.
 */
class AddRemoveInclusionExclusionInputButton extends Template {
  constructor({

    name,
    unique_id,
    select_mode = 'INCLUSION',
    add_icon = 'mdi:plus',
    remove_icon = 'mdi:minus',
    
    path,
    ...options

  } = {}) {

    const primary_mode = SelectModes[validateSelectMode(select_mode)].primary;

    super({ 

      // Required
      name,
      unique_id,
      select_mode,
      add_icon,
      remove_icon,
      
      // Defaults
      base_path: "/config/.storage/templates/components/ui/config/inclusion_exclusion_select/",
      file_name: `add_remove_${unique_id}_${primary_mode}_input_button.yaml`,

      // Optional Overrides
      path,
      ...options

    });

    this.template = this.build();

  }

  /**
   * @description
   * Builds the YAML template for the inclusion/exclusion input buttons.
   *
   * @param {string} [name] - The display name of the button group.
   * @param {string} [unique_id] - Unique identifier for the template.
   * @param {string} [select_mode] - Mode for the buttons. See [SelectModes](./config.js) for valid modes.
   * @param {string} [add_icon] - Material Design icon for add button.
   * @param {string} [remove_icon] - Material Design icon for remove button.
   * @returns {string} - YAML template string.
   */
  build = ({
    
    name = this.name,
    unique_id = this.unique_id, 
    select_mode = this.select_mode,
    add_icon = this.add_icon,
    remove_icon = this.remove_icon,

  } = {}) => {

    select_mode = SelectModes[validateSelectMode(select_mode)];

    return `
input_button:
  add_${unique_id}_${select_mode.primary}:
    name: "Add ${name} ${titleCase(select_mode.primary)}"
    icon: ${add_icon}

  remove_${unique_id}_${select_mode.primary}:
    name: "Remove ${name} ${titleCase(select_mode.primary)}"
    icon: ${remove_icon}
    `;

  }

}

module.exports = AddRemoveInclusionExclusionInputButton;