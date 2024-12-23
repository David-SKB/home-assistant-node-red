const path = require('path');
const { SelectModes, validateSelectMode } = require('../../../../../../../../../../domain/models/template/components/ui/config/inclusion_exclusion_select/config');
const InclusionsExclusionsTemplateSelect = require('../../../../../../../../../../domain/models/template/components/ui/config/inclusion_exclusion_select/InclusionsExclusionsTemplateSelect');

describe('InclusionsExclusionsTemplateSelect', () => {

  const base_path = () => `/config/.storage/templates/components/ui/config/inclusion_exclusion_select/`;
  const file_name = (unique_id, primaryMode, secondaryMode) =>
    `${unique_id}_${primaryMode}s_${secondaryMode}s_template_select.yaml`;

  describe('constructor', () => {

    it('should set default values correctly', () => {
      const template = new InclusionsExclusionsTemplateSelect({
        name: 'Test Group',
        unique_id: 'test_group',
        select_mode: 'INCLUSION'
      });

      const primaryMode = SelectModes[validateSelectMode('INCLUSION')].primary;
      const secondaryMode = SelectModes[validateSelectMode('INCLUSION')].secondary;

      expect(template.name).toBe('Test Group');
      expect(template.unique_id).toBe('test_group');
      expect(template.select_mode).toBe('INCLUSION');
      expect(template.options_template).toBe('[]');
      expect(template.base_path).toBe(base_path());
      expect(template.file_name).toBe(file_name('test_group', primaryMode, secondaryMode));
      expect(template.path).toBe(path.join(base_path(), file_name('test_group', primaryMode, secondaryMode)));
    });

    it('should override default values correctly', () => {
      const custom_path = '/custom/path/';
      const template = new InclusionsExclusionsTemplateSelect({
        name: 'Custom Group',
        unique_id: 'custom_group',
        select_mode: 'EXCLUSION',
        options_template: "[Option 1, Option 2, Option 3]",
        path: custom_path
      });

      const primaryMode = SelectModes[validateSelectMode('EXCLUSION')].primary;
      const secondaryMode = SelectModes[validateSelectMode('EXCLUSION')].secondary;

      expect(template.name).toBe('Custom Group');
      expect(template.unique_id).toBe('custom_group');
      expect(template.select_mode).toBe('EXCLUSION');
      expect(template.options_template).toBe("[Option 1, Option 2, Option 3]");
      expect(template.path).toBe(custom_path);
      expect(template.file_name).toBe(file_name('custom_group', primaryMode, secondaryMode));
    });

  });

  describe('build', () => {

    it('should generate correct YAML template with default values', () => {
      const template = new InclusionsExclusionsTemplateSelect({
        name: 'Test Group',
        unique_id: 'test_group',
        select_mode: 'INCLUSION'
      });

      const expectedTemplate = `
template:
  - select:
      - unique_id: "test_group_inclusions"
        name: "Test Group Inclusions"
        state: >
          {{ (states('input_text.test_group_inclusions_state') | default('')) }}
        options: >
          {{ (states('input_text.test_group_inclusions') | default('')).split(',') }}
        select_option:
          - service: input_text.set_value
            target:
              entity_id: input_text.test_group_inclusions_state
            data:
              value: "{{ option }}"

  - select:
      - unique_id: "test_group_exclusions"
        name: "Test Group Exclusions"
        state: >
          {{ (states('input_text.test_group_exclusions_state') | default('')) }}
        options: >
          {% set inclusions = (states('input_text.test_group_inclusions') | default('')).split(',') %}
          []
        select_option:
          - service: input_text.set_value
            target:
              entity_id: input_text.test_group_exclusions_state
            data:
              value: "{{ option }}"
    `;

      expect(template.build().trim()).toBe(expectedTemplate.trim());
    });

    it('should generate correct YAML template with custom values', () => {
      const template = new InclusionsExclusionsTemplateSelect({
        name: 'Custom Group',
        unique_id: 'custom_group',
        select_mode: 'EXCLUSION',
        options_template: "[Option A, Option B]"
      });

      const expectedTemplate = `
template:
  - select:
      - unique_id: "custom_group_exclusions"
        name: "Custom Group Exclusions"
        state: >
          {{ (states('input_text.custom_group_exclusions_state') | default('')) }}
        options: >
          {{ (states('input_text.custom_group_exclusions') | default('')).split(',') }}
        select_option:
          - service: input_text.set_value
            target:
              entity_id: input_text.custom_group_exclusions_state
            data:
              value: "{{ option }}"

  - select:
      - unique_id: "custom_group_inclusions"
        name: "Custom Group Inclusions"
        state: >
          {{ (states('input_text.custom_group_inclusions_state') | default('')) }}
        options: >
          {% set exclusions = (states('input_text.custom_group_exclusions') | default('')).split(',') %}
          [Option A, Option B]
        select_option:
          - service: input_text.set_value
            target:
              entity_id: input_text.custom_group_inclusions_state
            data:
              value: "{{ option }}"
    `;

      expect(template.build().trim()).toBe(expectedTemplate.trim());
    });

  });

});
