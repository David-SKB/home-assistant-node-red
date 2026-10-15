const fs = require('fs');
const path = require('path');
const { mockDomains, normalizeMultilineString } = require('../../../../../../../util/test');

const SceneManagerScript = require('../../../../../../../domain/models/template/dynamic/domain/monitoring/SceneManagerScript');

describe('SceneManagerScript', () => {

  const domains = [
    'light',
    'switch',
    'button'
  ];

  const base_path = `/config/.storage/templates/domain/monitoring/`;
  const file_name = `scene_manager_script.yaml`;

  beforeEach(() => {
    mockDomains.setup(domains);
  });

  afterEach(() => {
    mockDomains.resetMocks();
  });

  it('should set default values correctly', () => {
    const template = new SceneManagerScript();

    expect(template.base_path).toBe(base_path);
    expect(template.file_name).toBe(file_name);
    expect(template.path).toBe(path.join(base_path, file_name));
  });

  it('should override default values correctly', () => {
    const custom_base_path = '/custom/path/';
    const custom_file_name = 'custom.yaml';
    const custom_path = '/custom/full/path/custom.yaml';

    const template = new SceneManagerScript({
      base_path: custom_base_path,
      file_name: custom_file_name,
      path: custom_path
    });

    expect(template.base_path).toBe(custom_base_path);
    expect(template.file_name).toBe(custom_file_name);
    expect(template.path).toBe(custom_path);
  });

  it('should generate the expected scene template', () => {
    const expected = fs.readFileSync(path.join(__dirname, 
      `../../../../templates/mocks/${file_name}`), 
      'utf8'
    );

    const generated_template = new SceneManagerScript().template;

    expect(normalizeMultilineString(generated_template)).toBe(normalizeMultilineString(expected));
  });

});
