const path = require('path');
const { SelectModes, validateSelectMode } = require('../../../../../../../../../../domain/models/template/components/ui/config/inclusion_exclusion_select/config');
const InclusionsExclusionsStateInputText = require('../../../../../../../../../../domain/models/template/components/ui/config/inclusion_exclusion_select/InclusionsExclusionsStateInputText');

describe('InclusionsExclusionsStateInputText', () => {

  const base_path = () => `/config/.storage/templates/components/ui/config/inclusion_exclusion_select/`;
  const file_name = (unique_id, primaryMode, secondaryMode) =>
    `${unique_id}_${primaryMode}s_${secondaryMode}s_state_input_text.yaml`;

  describe('constructor', () => {

    it('should set default values correctly', () => {
      const template = new InclusionsExclusionsStateInputText({
        name: 'Test Group',
        unique_id: 'test_group',
        select_mode: 'INCLUSION'
      });

      const primaryMode = SelectModes[validateSelectMode('INCLUSION')].primary;
      const secondaryMode = SelectModes[validateSelectMode('INCLUSION')].secondary;

      expect(template.name).toBe('Test Group');
      expect(template.unique_id).toBe('test_group');
      expect(template.base_path).toBe(base_path());
      expect(template.file_name).toBe(file_name('test_group', primaryMode, secondaryMode));
      expect(template.path).toBe(path.join(base_path(), file_name('test_group', primaryMode, secondaryMode)));
    });

    it('should override default values correctly', () => {
      const custom_path = '/custom/path/';
      const template = new InclusionsExclusionsStateInputText({
        name: 'Custom Group',
        unique_id: 'custom_group',
        select_mode: 'EXCLUSION',
        path: custom_path
      });

      const primaryMode = SelectModes[validateSelectMode('EXCLUSION')].primary;
      const secondaryMode = SelectModes[validateSelectMode('EXCLUSION')].secondary;

      expect(template.name).toBe('Custom Group');
      expect(template.unique_id).toBe('custom_group');
      expect(template.path).toBe(custom_path);
      expect(template.file_name).toBe(file_name('custom_group', primaryMode, secondaryMode));
    });
  });

  describe('build', () => {

    it('should generate correct YAML template with default values', () => {
      const template = new InclusionsExclusionsStateInputText({
        name: 'Test Group',
        unique_id: 'test_group',
        select_mode: 'INCLUSION'
      });

      const expectedTemplate = `
input_text:
  test_group_inclusions_state:
    name: Test Group Inclusions State

  test_group_exclusions_state:
    name: Test Group Exclusions State
    `;

      expect(template.build().trim()).toBe(expectedTemplate.trim());
    });

    it('should generate correct YAML template with custom values', () => {
      const template = new InclusionsExclusionsStateInputText({
        name: 'Custom Group',
        unique_id: 'custom_group',
        select_mode: 'EXCLUSION'
      });

      const expectedTemplate = `
input_text:
  custom_group_exclusions_state:
    name: Custom Group Exclusions State

  custom_group_inclusions_state:
    name: Custom Group Inclusions State
    `;

      expect(template.build().trim()).toBe(expectedTemplate.trim());
    });

  });

});
