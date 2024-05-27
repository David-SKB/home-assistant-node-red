const pathUtil = require('path');
const { mockAreas } = require('../../../../../../util/test');
const createFileSync = require('../../../../../../util/file/createFileSync');
jest.mock('../../../../../../util/file/createFileSync');

const AreaTemplate = require('../../../../../../domain/models/template/area/AreaTemplate');

describe('AreaTemplate', () => {

  const areas = [
    { aliases: [], name: "Area 1", id: "area1", picture: null },
    { aliases: [], name: "Area 2", id: "area2", picture: null },
    { aliases: [], name: "Area 3", id: "area3", picture: null }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockAreas.setup(areas);
  });

  afterEach(() => {
    mockAreas.resetMocks();
  });

  describe('constructor', () => {

    it('should set default values correctly', () => {
      const area_id = areas[0].id;
      const template = new AreaTemplate(area_id, {});

      expect(template.base_path).toBe(`/config/.storage/templates/area/${area_id}`);
      expect(template.file_name).toBe(`${area_id}_template.yaml`);
      expect(template.path).toBe(pathUtil.join(`/config/.storage/templates/area/${area_id}`, `${area_id}_template.yaml`));
      expect(template.iterable).toEqual(areas.map(area => ([ area.id, { area_name: area.name } ])));
    });

    it('should override default values correctly', () => {
      const area_id = areas[0].id;
      const custom_base_path = '/custom/path/';
      const custom_file_name = 'custom.yaml';
      const custom_path = '/custom/full/path/custom.yaml';
      
      const template = new AreaTemplate(area_id, {
        base_path: custom_base_path,
        file_name: custom_file_name,
        path: custom_path,
        area_name: 'Custom Area'
      });

      expect(template.base_path).toBe(custom_base_path);
      expect(template.file_name).toBe(custom_file_name);
      expect(template.path).toBe(custom_path);
      expect(template.area_name).toBe('Custom Area');
    });

    it('should set path using base_path and file_name when path is not provided', () => {
      const area_id = areas[0].id;
      const custom_base_path = '/custom/path/';
      const custom_file_name = 'custom.yaml';

      const template = new AreaTemplate(area_id, {
        base_path: custom_base_path,
        file_name: custom_file_name
      });

      expect(template.path).toBe(pathUtil.join(custom_base_path, custom_file_name));
    });

  });

  describe('generate', () => {

    it('should return path and payload', () => {
      const area_id = areas[0].id;
      const template = new AreaTemplate(area_id, {});
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
      const area_id = areas[0].id;
      const template = new AreaTemplate(area_id, {});
      template.template = 'mock template';

      template.writeToFileSync();

      expect(createFileSync).toHaveBeenCalledWith(template.path, template.template);
    });

    it('should handle errors gracefully', () => {
      createFileSync.mockImplementation(() => {
        throw new Error('Error writing file');
      });

      const area_id = areas[0].id;
      const template = new AreaTemplate(area_id, {});
      template.template = { key: 'value' };

      expect(() => template.writeToFileSync()).toThrow('Error writing file');
    });

  });

});