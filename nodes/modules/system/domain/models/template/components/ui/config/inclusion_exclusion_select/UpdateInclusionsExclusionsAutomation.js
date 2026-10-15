const titleCase = require('../../../../../../../util/common/titleCase');
const Template = require('../../../../Template');
const { SelectModes, validateSelectMode } = require('./config');

/**
 * @description
 * Generates a YAML template for automations that update inclusion/exclusion lists.
 *
 * @param {Object} [options] - Configuration options.
 * @param {string} [options.name] - The display name of the automation.
 * @param {string} [options.unique_id] - Unique identifier for the automation.
 * @param {string} [options.select_mode] - Mode for the template selects. See [SelectModes](./config.js) for valid modes.
 * @param {string} [options.path] - (Optional) Custom file path for the template.
 */
class UpdateInclusionsExclusionsAutomation extends Template {
  constructor({

    name,
    unique_id,
    select_mode = 'INCLUSION',

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
      file_name: `update_${unique_id}_${validated_mode.primary}s_${validated_mode.secondary}s_automation.yaml`,

      // Optional Overrides
      path,
      ...options

    });

    this.template = this.build();
  }

  /**
   * @description
   * Builds the YAML template for the automation.
   *
   * @param {string} [name] - The display name of the automation.
   * @param {string} [unique_id] - Unique identifier for the automation.
   * @param {string} [select_mode] - Mode for the template selects. See [SelectModes](./config.js) for valid modes.
   * @returns {string} - YAML template string.
   */
  build = ({
    name = this.name,
    unique_id = this.unique_id,
    select_mode = this.select_mode
  } = {}) => {

    select_mode = SelectModes[validateSelectMode(select_mode)];

    return `
automation:
  - id: update_${unique_id}_${select_mode.primary}s
    alias: "Update ${name} ${titleCase(select_mode.primary)}s"
    trigger:
      - platform: state
        entity_id: input_button.add_${unique_id}_${select_mode.primary}
        id: "ADD"
      - platform: state
        entity_id: input_button.remove_${unique_id}_${select_mode.primary}
        id: "REMOVE"
    action:
      - choose:
          - conditions:
              - condition: trigger
                id: "ADD"
            sequence:
              - service: script.add_inclusion_exclusion_entity
                data:
                  entity_inclusion_exclusion_state: input_text.${unique_id}_${select_mode.secondary}s_state
                  entity_inclusions_exclusions: input_text.${unique_id}_${select_mode.primary}s
          - conditions:
              - condition: trigger
                id: "REMOVE"
            sequence:
              - service: script.remove_inclusion_exclusion_entity
                data:
                  entity_inclusion_exclusion_state: input_text.${unique_id}_${select_mode.primary}s_state
                  entity_inclusions_exclusions: input_text.${unique_id}_${select_mode.primary}s
    mode: single
    `;
  }
}

module.exports = UpdateInclusionsExclusionsAutomation;
