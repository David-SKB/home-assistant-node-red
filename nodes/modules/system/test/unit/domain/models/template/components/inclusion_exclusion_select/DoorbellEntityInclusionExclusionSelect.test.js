const fs = require('fs');
const path = require('path');
const DoorbellEntityInclusionExclusionSelect = require('../../../../../../../domain/models/template/dynamic/components/inclusion_exclusion_select/DoorbellEntityInclusionExclusionSelect');
const { normalizeMultilineString } = require('../../../../../../../util/test');
const { SelectModes, validateSelectMode } = require('../../../../../../../domain/models/template/components/ui/config/inclusion_exclusion_select/config');


describe('DoorbellEntityInclusionExclusionSelect', () => {

  const base_path = (unique_id = 'doorbell_entity') => 
    `/config/.storage/templates/dynamic/components/inclusion_exclusion_select/${unique_id}/`;

  const file_name = (unique_id = 'doorbell_entity', select_mode = 'EXCLUSION') => {
    const mode = SelectModes[validateSelectMode(select_mode)];

    return [
      `add_remove_${unique_id}_${mode.primary}_input_button.yaml`,
      `${unique_id}_${mode.primary}s_input_text.yaml`,
      `${unique_id}_${mode.primary}s_${mode.secondary}s_state_input_text.yaml`,
      `${unique_id}_${mode.primary}s_${mode.secondary}s_template_select.yaml`,
      `update_${unique_id}_${mode.primary}s_${mode.secondary}s_automation.yaml`
    ]

  };

  const unique_id = 'doorbell_entity';
  const name = 'Doorbell Entity';
  const select_mode = 'INCLUSION';

  beforeEach(() => {

  });

  afterEach(() => {

  });

  it('should set default values correctly', () => {
    const template = new DoorbellEntityInclusionExclusionSelect();

    expect(template.name).toBe(name);
    expect(template.unique_id).toBe(unique_id);
    expect(template.base_path).toBe(base_path());
    expect(template.file_name).toBe('template.yaml');
    expect(template.path).toBe(path.join(base_path(), 'template.yaml'));
  });

  it('should override default values correctly', () => {
    const custom_base_path = '/custom/path/';
    const custom_file_name = 'custom.yaml';
    const custom_path = '/custom/full/path/custom.yaml';

    const template = new DoorbellEntityInclusionExclusionSelect({
      base_path: custom_base_path,
      file_name: custom_file_name,
      path: custom_path,
      name: 'Custom Name',
    });

    expect(template.base_path).toBe(custom_base_path);
    expect(template.file_name).toBe(custom_file_name);
    expect(template.path).toBe(custom_path);
    expect(template.name).toBe('Custom Name');
  });

  it('should generate the expected inclusion/exclusion select templates', () => {
    const templateInstance = new DoorbellEntityInclusionExclusionSelect({
      name,
      unique_id,
      select_mode,
    });
    
    const generated_templates = templateInstance.generateAll();
    console.log('GENERATED_TEMPLATES_DEBUG');
    console.log(generated_templates);
  
    // Expected file names
    const expected_file_names = file_name(unique_id, select_mode);
  
    // Check each generated template
    generated_templates.forEach((template, index) => {
      const expected_path = path.join(base_path(unique_id), expected_file_names[index]);
  
      // Verify file path matches expected
      expect(template.path).toBe(expected_path);
  
      // Verify payload matches mock file content
      const expected_payload = fs.readFileSync(
        path.join(
          __dirname,
          `../../../../templates/mocks/${expected_file_names[index]}`
        ),
        'utf8'
      );
  
      expect(normalizeMultilineString(template.payload)).toBe(normalizeMultilineString(expected_payload));
    });
  });
  
});