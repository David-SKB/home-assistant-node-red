const pathUtil = require('path');
const createFileSync = require('../../../../../util/file/createFileSync');
const Template = require('../../../../../domain/models/template/Template');
jest.mock('../../../../../util/file/createFileSync');

describe('Template', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {

    it('should set default values correctly', () => {
      const template = new Template({});

      expect(template.base_path).toBe('/config/.storage/templates/');
      expect(template.file_name).toBe('template.yaml');
      expect(template.path).toBe(pathUtil.join('/config/.storage/templates/', 'template.yaml'));
    });

    it('should override default values correctly', () => {
      const custom_base_path = '/custom/path/';
      const custom_file_name = 'custom.yaml';
      const custom_path = '/custom/full/path/custom.yaml';
      
      const template = new Template({
        base_path: custom_base_path,
        file_name: custom_file_name,
        path: custom_path
      });

      expect(template.base_path).toBe(custom_base_path);
      expect(template.file_name).toBe(custom_file_name);
      expect(template.path).toBe(custom_path);
    });

    it('should set path using base_path and file_name when path is not provided', () => {
      const custom_base_path = '/custom/path/';
      const custom_file_name = 'custom.yaml';

      const template = new Template({
        base_path: custom_base_path,
        file_name: custom_file_name
      });

      expect(template.path).toBe(pathUtil.join(custom_base_path, custom_file_name));
    });

  });

  describe('generate', () => {

    it('should return path and payload', () => {
      const template = new Template({});
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
      const template = new Template({});
      template.template = 'mock template';

      template.writeToFileSync();

      expect(createFileSync).toHaveBeenCalledWith(template.path, template.template);
    });

    it('should handle errors gracefully', () => {
      createFileSync.mockImplementation(() => {
        throw new Error('Error writing file');
      });

      const template = new Template({});
      template.template = { key: 'value' };

      expect(() => template.writeToFileSync()).toThrow('Error writing file');
    });

  });

});