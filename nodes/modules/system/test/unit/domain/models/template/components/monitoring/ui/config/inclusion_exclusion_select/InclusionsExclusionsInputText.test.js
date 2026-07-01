const path = require('path');
const { SelectModes, validateSelectMode } = require('../../../../../../../../../../domain/models/template/components/ui/config/inclusion_exclusion_select/config');
const InclusionsExclusionsInputText = require('../../../../../../../../../../domain/models/template/components/ui/config/inclusion_exclusion_select/InclusionsExclusionsInputText');

describe('InclusionsExclusionsInputText', () => {

  const base_path = () => `/config/.storage/templates/components/ui/config/inclusion_exclusion_select/`;
  const file_name = (unique_id, primaryMode) => `${unique_id}_${primaryMode}s_input_text.yaml`;

  describe('constructor', () => {

    it('should set default values correctly', () => {
      const template = new InclusionsExclusionsInputText({
        name: 'Test Group',
        unique_id: 'test_group'
      });

      const primaryMode = SelectModes[validateSelectMode('INCLUSION')].primary;

      expect(template.name).toBe('Test Group');
      expect(template.unique_id).toBe('test_group');
      expect(template.select_mode).toBe('INCLUSION');
      expect(template.base_path).toBe(base_path());
      expect(template.file_name).toBe(file_name('test_group', primaryMode));
      expect(template.path).toBe(path.join(base_path(), file_name('test_group', primaryMode)));
    });

    it('should override default values correctly', () => {
      const custom_path = '/custom/path/';
      const template = new InclusionsExclusionsInputText({
        name: 'Custom Group',
        unique_id: 'custom_group',
        select_mode: 'EXCLUSION',
        path: custom_path
      });

      const primaryMode = SelectModes[validateSelectMode('EXCLUSION')].primary;

      expect(template.name).toBe('Custom Group');
      expect(template.unique_id).toBe('custom_group');
      expect(template.select_mode).toBe('EXCLUSION');
      expect(template.path).toBe(custom_path);
      expect(template.file_name).toBe(file_name('custom_group', primaryMode));
    });
  });

  describe('build', () => {

    it('should generate correct YAML template with default values', () => {
      const template = new InclusionsExclusionsInputText({
        name: 'Test Group',
        unique_id: 'test_group'
      });

      const expectedTemplate = `
input_text:
  test_group_inclusions:
    name: Test Group Inclusions
    `;

      expect(template.build().trim()).toBe(expectedTemplate.trim());
    });

    it('should generate correct YAML template with custom values', () => {
      const template = new InclusionsExclusionsInputText({
        name: 'Custom Group',
        unique_id: 'custom_group',
        select_mode: 'EXCLUSION'
      });

      const expectedTemplate = `
input_text:
  custom_group_exclusions:
    name: Custom Group Exclusions
    `;

      expect(template.build().trim()).toBe(expectedTemplate.trim());
    });

  });

});
