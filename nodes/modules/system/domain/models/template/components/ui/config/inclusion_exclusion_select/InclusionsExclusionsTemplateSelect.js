const { indentString } = require('../../../../../../../util/common');
const titleCase = require('../../../../../../../util/common/titleCase');
const Template = require('../../../../Template');
const { SelectModes, validateSelectMode } = require('./config');

/**
 * @description
 * Generates a YAML template for inclusion/exclusion template selects.
 * 
 * @param {Object} [options] - Configuration options.
 * @param {string} [options.name] - The display name of the template selects.
 * @param {string} [options.unique_id] - Unique identifier for the template.
 * @param {string} [options.select_mode] - Mode for the template selects. See [SelectModes](./config.js) for valid modes.
 * @param {string} [options.options_template] - Options for the template selects.
 * @param {string} [options.path] - (Optional) Custom file path for the template.
 */
class InclusionsExclusionsTemplateSelect extends Template {
  constructor({

    name,
    unique_id,
    select_mode = 'INCLUSION',
    options_template = '[]',
    
    path,
    ...options

  } = {}) {

    const validated_mode = SelectModes[validateSelectMode(select_mode)];

    super({ 

      // Required
      name,
      unique_id,
      select_mode,
      options_template,
      
      // Defaults
      base_path: "/config/.storage/templates/components/ui/config/inclusion_exclusion_select/",
      file_name: `${unique_id}_${validated_mode.primary}s_${validated_mode.secondary}s_template_select.yaml`,

      // Optional Overrides
      path,
      ...options

    });

    this.template = this.build();

  }

  /**
   * @description
   * Builds the YAML template for the inclusion/exclusion template selects.
   * 
   * @param {string} [name] - The display name of the template selects.
   * @param {string} [unique_id] - Unique identifier for the template.
   * @param {string} [select_mode] - Mode for the template selects. See [SelectModes](./config.js) for valid modes.
   * @returns {string} - YAML template string.
   */
  build = ({
    
      name = this.name,
      unique_id = this.unique_id, 
      select_mode = this.select_mode,
      options_template = this.options_template

    } = {}) => {

      select_mode = SelectModes[validateSelectMode(select_mode)];

    return `
template:
  - select:
      - unique_id: "${unique_id}_${select_mode.primary}s"
        name: "${name} ${titleCase(select_mode.primary)}s"
        state: >
          {{ (states('input_text.${unique_id}_${select_mode.primary}s_state') | default('')) }}
        options: >
          {{ (states('input_text.${unique_id}_${select_mode.primary}s') | default('')).split(',') }}
        select_option:
          - service: input_text.set_value
            target:
              entity_id: input_text.${unique_id}_${select_mode.primary}s_state
            data:
              value: "{{ option }}"

  - select:
      - unique_id: "${unique_id}_${select_mode.secondary}s"
        name: "${name} ${titleCase(select_mode.secondary)}s"
        state: >
          {{ (states('input_text.${unique_id}_${select_mode.secondary}s_state') | default('')) }}
        options: >
          {% set ${select_mode.primary}s = (states('input_text.${unique_id}_${select_mode.primary}s') | default('')).split(',') %}
${indentString(options_template, 10)}
        select_option:
          - service: input_text.set_value
            target:
              entity_id: input_text.${unique_id}_${select_mode.secondary}s_state
            data:
              value: "{{ option }}"
    `;

  }

}

module.exports = InclusionsExclusionsTemplateSelect;