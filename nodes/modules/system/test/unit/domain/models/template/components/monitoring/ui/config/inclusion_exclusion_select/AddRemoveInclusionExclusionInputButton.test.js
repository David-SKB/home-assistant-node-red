const path = require('path');
const { SelectModes, validateSelectMode } = require('../../../../../../../../../../domain/models/template/components/ui/config/inclusion_exclusion_select/config');
const AddRemoveInclusionExclusionInputButton = require('../../../../../../../../../../domain/models/template/components/ui/config/inclusion_exclusion_select/AddRemoveInclusionExclusionInputButton');

describe('AddRemoveInclusionExclusionInputButton', () => {

  const base_path = () => `/config/.storage/templates/components/ui/config/inclusion_exclusion_select/`;
  const file_name = () => `add_remove_test_group_inclusion_input_button.yaml`;

  describe('constructor', () => {

    it('should set default values correctly', () => {
      const template = new AddRemoveInclusionExclusionInputButton({
        name: 'Test Group',
        unique_id: 'test_group'
      });

      expect(template.name).toBe('Test Group');
      expect(template.unique_id).toBe('test_group');
      expect(template.select_mode).toBe('INCLUSION');
      expect(template.add_icon).toBe('mdi:plus');
      expect(template.remove_icon).toBe('mdi:minus');
      expect(template.base_path).toBe(base_path());
      expect(template.file_name).toBe(file_name());
      expect(template.path).toBe(path.join(base_path(),file_name()));
    });

    it('should override default values correctly', () => {
      const custom_path = '/custom/path/';
      const template = new AddRemoveInclusionExclusionInputButton({
        name: 'Custom Group',
        unique_id: 'custom_group',
        select_mode: 'EXCLUSION',
        add_icon: 'mdi:custom-plus',
        remove_icon: 'mdi:custom-minus',
        path: custom_path
      });

      const primaryMode = SelectModes[validateSelectMode('EXCLUSION')].primary;

      expect(template.name).toBe('Custom Group');
      expect(template.unique_id).toBe('custom_group');
      expect(template.select_mode).toBe('EXCLUSION');
      expect(template.add_icon).toBe('mdi:custom-plus');
      expect(template.remove_icon).toBe('mdi:custom-minus');
      expect(template.path).toBe(custom_path);
      expect(template.file_name).toBe(`add_remove_custom_group_${primaryMode}_input_button.yaml`);
    });
  });

  describe('build', () => {

    it('should generate correct YAML template with default values', () => {
      const template = new AddRemoveInclusionExclusionInputButton({
        name: 'Test Group',
        unique_id: 'test_group'
      });

      const expected_emplate = `
input_button:
  add_test_group_inclusion:
    name: "Add Test Group Inclusion"
    icon: mdi:plus

  remove_test_group_inclusion:
    name: "Remove Test Group Inclusion"
    icon: mdi:minus
    `;

      expect(template.build().trim()).toBe(expected_emplate.trim());
    });

    it('should generate correct YAML template with custom values', () => {
      const template = new AddRemoveInclusionExclusionInputButton({
        name: 'Custom Group',
        unique_id: 'custom_group',
        select_mode: 'EXCLUSION',
        add_icon: 'mdi:custom-plus',
        remove_icon: 'mdi:custom-minus'
      });

      const expected_emplate = `
input_button:
  add_custom_group_exclusion:
    name: "Add Custom Group Exclusion"
    icon: mdi:custom-plus

  remove_custom_group_exclusion:
    name: "Remove Custom Group Exclusion"
    icon: mdi:custom-minus
    `;

      expect(template.build().trim()).toBe(expected_emplate.trim());
    });

  });

});
