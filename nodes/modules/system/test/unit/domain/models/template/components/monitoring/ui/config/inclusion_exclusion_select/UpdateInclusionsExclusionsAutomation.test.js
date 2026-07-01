const path = require('path');
const { SelectModes, validateSelectMode } = require('../../../../../../../../../../domain/models/template/components/ui/config/inclusion_exclusion_select/config');
const UpdateInclusionsExclusionsAutomation = require('../../../../../../../../../../domain/models/template/components/ui/config/inclusion_exclusion_select/UpdateInclusionsExclusionsAutomation');

describe('UpdateInclusionsExclusionsAutomation', () => {

  const base_path = () => `/config/.storage/templates/components/ui/config/inclusion_exclusion_select/`;
  const file_name = (unique_id, primaryMode, secondaryMode) =>
    `update_${unique_id}_${primaryMode}s_${secondaryMode}s_automation.yaml`;

  describe('constructor', () => {

    it('should set default values correctly', () => {
      const template = new UpdateInclusionsExclusionsAutomation({
        name: 'Test Automation',
        unique_id: 'test_automation',
        select_mode: 'INCLUSION'
      });

      const primaryMode = SelectModes[validateSelectMode('INCLUSION')].primary;
      const secondaryMode = SelectModes[validateSelectMode('INCLUSION')].secondary;

      expect(template.name).toBe('Test Automation');
      expect(template.unique_id).toBe('test_automation');
      expect(template.select_mode).toBe('INCLUSION');
      expect(template.base_path).toBe(base_path());
      expect(template.file_name).toBe(file_name('test_automation', primaryMode, secondaryMode));
      expect(template.path).toBe(path.join(base_path(), file_name('test_automation', primaryMode, secondaryMode)));
    });

    it('should override default values correctly', () => {
      const custom_path = '/custom/path/';
      const template = new UpdateInclusionsExclusionsAutomation({
        name: 'Custom Automation',
        unique_id: 'custom_automation',
        select_mode: 'EXCLUSION',
        path: custom_path
      });

      const primaryMode = SelectModes[validateSelectMode('EXCLUSION')].primary;
      const secondaryMode = SelectModes[validateSelectMode('EXCLUSION')].secondary;

      expect(template.name).toBe('Custom Automation');
      expect(template.unique_id).toBe('custom_automation');
      expect(template.select_mode).toBe('EXCLUSION');
      expect(template.path).toBe(custom_path);
      expect(template.file_name).toBe(file_name('custom_automation', primaryMode, secondaryMode));
    });

  });

  describe('build', () => {

    it('should generate correct YAML template with default values', () => {
      const template = new UpdateInclusionsExclusionsAutomation({
        name: 'Test Automation',
        unique_id: 'test_automation',
        select_mode: 'INCLUSION'
      });

      const expectedTemplate = `
automation:
  - id: update_test_automation_inclusions
    alias: "Update Test Automation Inclusions"
    trigger:
      - platform: state
        entity_id: input_button.add_test_automation_inclusion
        id: "ADD"
      - platform: state
        entity_id: input_button.remove_test_automation_inclusion
        id: "REMOVE"
    action:
      - choose:
          - conditions:
              - condition: trigger
                id: "ADD"
            sequence:
              - service: script.add_inclusion_exclusion_entity
                data:
                  entity_inclusion_exclusion_state: input_text.test_automation_exclusions_state
                  entity_inclusions_exclusions: input_text.test_automation_inclusions
          - conditions:
              - condition: trigger
                id: "REMOVE"
            sequence:
              - service: script.remove_inclusion_exclusion_entity
                data:
                  entity_inclusion_exclusion_state: input_text.test_automation_inclusions_state
                  entity_inclusions_exclusions: input_text.test_automation_inclusions
    mode: single
    `;

      expect(template.build().trim()).toBe(expectedTemplate.trim());
    });

    it('should generate correct YAML template with custom values', () => {
      const template = new UpdateInclusionsExclusionsAutomation({
        name: 'Custom Automation',
        unique_id: 'custom_automation',
        select_mode: 'EXCLUSION'
      });

      const expectedTemplate = `
automation:
  - id: update_custom_automation_exclusions
    alias: "Update Custom Automation Exclusions"
    trigger:
      - platform: state
        entity_id: input_button.add_custom_automation_exclusion
        id: "ADD"
      - platform: state
        entity_id: input_button.remove_custom_automation_exclusion
        id: "REMOVE"
    action:
      - choose:
          - conditions:
              - condition: trigger
                id: "ADD"
            sequence:
              - service: script.add_inclusion_exclusion_entity
                data:
                  entity_inclusion_exclusion_state: input_text.custom_automation_inclusions_state
                  entity_inclusions_exclusions: input_text.custom_automation_exclusions
          - conditions:
              - condition: trigger
                id: "REMOVE"
            sequence:
              - service: script.remove_inclusion_exclusion_entity
                data:
                  entity_inclusion_exclusion_state: input_text.custom_automation_exclusions_state
                  entity_inclusions_exclusions: input_text.custom_automation_exclusions
    mode: single
    `;

      expect(template.build().trim()).toBe(expectedTemplate.trim());
    });

  });

});