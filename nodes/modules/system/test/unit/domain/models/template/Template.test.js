const pathUtil = require('path');
const createFileSync = require('../../../../../util/file/createFileSync');
const Template = require('../../../../../domain/models/template/Template');
jest.mock('../../../../../util/file/createFileSync');

describe('Template', () => {

  beforeEach(() => {
    // Reset the mock implementation of createFileSync before each test
    createFileSync.mockReset();
  });

  // Tests for constructor, generate, writeToFileSync, etc. unchanged

  describe('generateAll', () => {

    it('should throw an error if iterable is empty', () => {
      const template = new Template({});

      expect(() => template.generateAll()).toThrow('Missing iterable');
    });

    it('should return generated templates for each item in iterable', () => {
      const iterable = [
        ['area1', { area_name: 'Area 1' }],
        ['area2', { area_name: 'Area 2' }]
      ];

      const MockTemplateClass = class extends Template {
        build(area_id, { area_name }) {
          return `input_text:\n  motion_lighting_target_${area_id}:\n    name: Motion Lighting Target ${area_name}`;
        }
      };

      const template = new Template({ iterable, TemplateClass: MockTemplateClass });

      const results = template.generateAll();

      results.forEach((result, index) => {
        expect(result).toEqual({
          path: pathUtil.join(template.base_path, template.file_name),
          payload: `input_text:\n  motion_lighting_target_${iterable[index][0]}:\n    name: Motion Lighting Target ${iterable[index][1].area_name}`
        });
      });
    });

  });

  describe('writeAllToFileSync', () => {

    it('should throw an error if iterable is empty', () => {
      const template = new Template({});

      expect(() => template.writeAllToFileSync()).toThrow('Missing iterable');
    });

    it('should call createFileSync for each item in iterable', () => {
      const iterable = [
        ['area1', { area_name: 'Area 1' }],
        ['area2', { area_name: 'Area 2' }]
      ];

      const MockTemplateClass = class extends Template {
        build(area_id, { area_name }) {
          return `input_text:\n  motion_lighting_target_${area_id}:\n    name: Motion Lighting Target ${area_name}`;
        }
      };

      const template = new Template({ iterable, TemplateClass: MockTemplateClass });

      template.writeAllToFileSync();

      iterable.forEach((item) => {

        const [area_id, options] = item;
        const expectedPath = pathUtil.join(template.base_path, template.file_name);
        
        expect(createFileSync).toHaveBeenCalledWith(expectedPath, 
          `input_text:\n  motion_lighting_target_${area_id}:\n    name: Motion Lighting Target ${options.area_name}`
        );

      });
    });

  });

});