const fs = require('fs');
const pathUtil = require('path');
const TemplateGenerator = require("../../../../../domain/models/template/TemplateGenerator");
const template = require("../../../../../domain/models/template");
const { mockAreas, mockEntities } = require('../../../../../util/test');
const convertClassNameToFileName = require('../../../../../util/test/convertClassNameToFileName');

// Mock the file system
jest.mock('fs');

describe('TemplateGenerator', () => {

  let templateGenerator;

  const areas = [
    { aliases: [], name: "Area 1", id: "area1", picture: null },
    { aliases: [], name: "Area 2", id: "area2", picture: null },
    { aliases: [], name: "Area 3", id: "area3", picture: null }
  ];

  const entities = [
    { entity_id: 'binary_sensor.area1_motion', area_id: 'area1' },
    { entity_id: 'binary_sensor.area2_motion', area_id: 'area2' },
    { entity_id: 'binary_sensor.area3_motion', area_id: 'area3' },
    { entity_id: 'binary_sensor.area4_motion', area_id: 'area4' },
    { entity_id: 'binary_sensor.area5_motion', area_id: 'area5' }
  ];

  const area_templates_directory = "/template/area/";
  const climate_area_templates_directory = `${area_templates_directory}climate/`;
  const lighting_area_templates_directory = `${area_templates_directory}lighting/`;
  const motion_lighting_area_templates_directory = `${lighting_area_templates_directory}motion/`;

  const available_templates = [

    // Climate
    `${climate_area_templates_directory}AverageHumidityAreaSensor.js`,
    `${climate_area_templates_directory}AverageLuxAreaSensor.js`, 
    `${climate_area_templates_directory}AverageTemperatureAreaSensor.js`, 

    // Motion Lighting
    `${motion_lighting_area_templates_directory}MotionLightingHybridTargetAreaInputText.js`,
    `${motion_lighting_area_templates_directory}MotionLightingHybridTargetAreaTemplateSelect.js`,
    `${motion_lighting_area_templates_directory}MotionLightingModeAreaInputSelect.js`,
    `${motion_lighting_area_templates_directory}MotionLightingTargetAreaInputText.js`,
    `${motion_lighting_area_templates_directory}MotionLightingTargetAreaTemplateSelect.js`,
    `${motion_lighting_area_templates_directory}MotionLightingTimeoutAreaInputDatetime.js`
  
  ];

  const climate_templates_count = available_templates.reduce((count, item) => {
    return item.includes(climate_area_templates_directory) ? count + 1 : count;
  }, 0);

  const generated_climate_templates_count = available_templates.reduce((count, item) => {
    return item.includes(climate_area_templates_directory) ? count + areas.length : count;
  }, 0);

  const lighting_templates_count = available_templates.reduce((count, item) => {
    return item.includes(lighting_area_templates_directory)? count + 1 : count;
  }, 0);

  const generated_lighting_templates_count = available_templates.reduce((count, item) => {
    return item.includes(lighting_area_templates_directory) ? count + areas.length : count;
  }, 0);

  const motion_lighting_templates_count = available_templates.reduce((count, item) => {
    return item.includes(motion_lighting_area_templates_directory)? count + 1 : count;
  }, 0);
  
  const generated_motion_lighting_templates_count = available_templates.reduce((count, item) => {
    return item.includes(motion_lighting_area_templates_directory) ? count + areas.length : count;
  }, 0);

  const area_templates_count = available_templates.reduce((count, item) => {
    return item.includes(area_templates_directory) ? count + 1 : count;
  }, 0);

  const templates_count = available_templates.length;

  const generated_area_templates_count = available_templates.reduce((count, item) => {
    return item.includes(area_templates_directory)? count + areas.length : count + 1;
  }, 0);

  const generated_templates_count = area_templates_count * areas.length;

  beforeEach(() => {
    mockAreas.setup(areas);
    mockEntities.setup(entities);
    templateGenerator = new TemplateGenerator();
  });

  afterEach(() => {
    mockAreas.resetMocks();
    mockEntities.resetMocks();
    jest.clearAllMocks();
  });

  describe('getTemplateClasses', () => {
    it('should return an array of template classes', () => {
      // Mock the file system to simulate template files
      fs.readdirSync.mockReturnValue(['Template1.js', 'Template2.js']);
      
      // Call the method and check the result
      const templateClasses = templateGenerator.getTemplateClasses(template);

      // Assert that the result is an array of template classes
      expect(templateClasses).toHaveLength(templates_count);
      expect(templateClasses.every(cls => typeof cls === 'function')).toBe(true);
    });
  });

  describe('generate', () => {
    it('should generate templates and return an array of correct length', () => {
      let generatedTemplates;

      // Call the generate function with a path
      generatedTemplates = templateGenerator.generate('./nodes/modules/system/domain/models/template/area/climate');

      // Verify that the result is an array of correct length
      expect(generatedTemplates).toHaveLength(generated_climate_templates_count);

      // Call the generate function with a path
      generatedTemplates = templateGenerator.generate('./nodes/modules/system/domain/models/template/area/lighting/motion');
      
      // Verify that the result is an array of correct length
      expect(generatedTemplates).toHaveLength(generated_motion_lighting_templates_count);

      // Call the generate function with a module object
      generatedTemplates = templateGenerator.generate(template);

      // Verify that all the expected templates have been generated
      expect(generatedTemplates).toHaveLength(generated_templates_count);
    });
  });

  describe('generate with write option', () => {
    it('should write templates to files', () => {
      // Mock the writeFileSync method to avoid actual file system operations
      fs.writeFileSync = jest.fn();

      // Call the generate function with a module object and write option
      templateGenerator.generate(template, { write: true });

      // Verify that writeFileSync has been called the correct number of times
      expect(fs.writeFileSync).toHaveBeenCalledTimes(generated_templates_count);

      // Verify that the file paths and content are correct
      const templateClasses = templateGenerator.getTemplateClasses(template);
      
      templateClasses.forEach((TemplateClass) => {
        const templateInstance = new TemplateClass({});
        const templates = templateInstance.generateAll();
        
        templates.forEach((generatedTemplate) => {
          expect(fs.writeFileSync).toHaveBeenCalledWith(generatedTemplate.path, generatedTemplate.payload, "utf8");
        });
      });
    });
  });

  describe('verify file paths', () => {
    it('should generate correct file paths for templates', () => {
      const expectedPaths = areas.flatMap(area => 
        available_templates.map(templatePath => convertClassNameToFileName(templatePath, { area_id: area.id }))
      );

      const generatedTemplates = templateGenerator.generate(template);
      const generatedPaths = generatedTemplates.map(t => pathUtil.normalize(t.path));

      // Verify that generated paths match the expected paths
      expectedPaths.forEach(expectedPath => {
        expect(generatedPaths).toContain(expectedPath);
      });
    });
  });
});