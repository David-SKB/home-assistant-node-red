const pathUtil = require('path');
const { mockDomains } = require('../../../../../../util/test');
const createFileSync = require('../../../../../../util/file/createFileSync');
jest.mock('../../../../../../util/file/createFileSync');

const DomainTemplate = require('../../../../../../domain/models/template/dynamic/domain/DomainTemplate');

describe('DomainTemplate', () => {

  const domains = [
    'light',
    'switch',
    'button'
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockDomains.setup(domains);
  });

  afterEach(() => {
    mockDomains.resetMocks();
  });

  describe('constructor', () => {

    it('should set default values correctly', () => {
      const domain = domains[0];
      const template = new DomainTemplate({domain});

      expect(template.base_path).toBe(`/config/.storage/templates/domain/${domain}`);
      expect(template.file_name).toBe(`${domain}_template.yaml`);
      expect(template.path).toBe(pathUtil.join(`/config/.storage/templates/domain/${domain}`, `${domain}_template.yaml`));
      expect(template.iterable).toEqual(domains);
    });

    it('should override default values correctly', () => {
      const domain = domains[0];
      const custom_base_path = '/custom/path/';
      const custom_file_name = 'custom.yaml';
      const custom_path = '/custom/full/path/custom.yaml';
      
      const template = new DomainTemplate({
        domain,
        base_path: custom_base_path,
        file_name: custom_file_name,
        path: custom_path
      });

      expect(template.base_path).toBe(custom_base_path);
      expect(template.file_name).toBe(custom_file_name);
      expect(template.path).toBe(custom_path);
    });

    it('should set path using base_path and file_name when path is not provided', () => {
      const domain = domains[0];
      const custom_base_path = '/custom/path/';
      const custom_file_name = 'custom.yaml';

      const template = new DomainTemplate({
        domain,
        base_path: custom_base_path,
        file_name: custom_file_name
      });

      expect(template.path).toBe(pathUtil.join(custom_base_path, custom_file_name));
    });

  });

  describe('generate', () => {

    it('should return path and payload', () => {
      const domain = domains[0];
      const template = new DomainTemplate({domain});
      template.template = { key: 'value' };

      const result = template.generate();

      expect(result).toEqual({
        path: template.path,
        payload: template.template
      });

    });

  });

  describe('writeToFileSync', () => {

    it('should call createFileSync with correct parameters', () => {
      const domain = domains[0];
      const template = new DomainTemplate({domain});
      template.template = 'mock template';

      template.writeToFileSync();

      expect(createFileSync).toHaveBeenCalledWith(template.path, template.template);
    });

    it('should handle errors gracefully', () => {
      createFileSync.mockImplementation(() => {
        throw new Error('Error writing file');
      });

      const domain = domains[0].id;
      const template = new DomainTemplate({domain});
      template.template = { key: 'value' };

      expect(() => template.writeToFileSync()).toThrow('Error writing file');
    });

  });

});