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

  // Area
  const area_templates_directory = "/template/area/";

  // Climate
  const area_climate_templates_directory = `${area_templates_directory}climate/`;

  // Motion
  const area_motion_templates_directory = `${area_templates_directory}motion/`;
  const area_motion_detection_templates_directory = `${area_motion_templates_directory}detection/`;
  const area_motion_lighting_templates_directory = `${area_motion_templates_directory}lighting/`;

  // To be (re)moved
  // const lighting_area_templates_directory = `${area_templates_directory}lighting/`;
  // const area_motion_lighting_templates_directory = `${lighting_area_templates_directory}motion/`;

  const available_templates = [

    // Area - Climate
    `${area_climate_templates_directory}AverageHumidityAreaSensor.js`,
    `${area_climate_templates_directory}AverageLuxAreaSensor.js`, 
    `${area_climate_templates_directory}AverageTemperatureAreaSensor.js`, 
    // Area - Motion - Detection
    `${area_motion_detection_templates_directory}MotionDetectionToggleAreaSwitch.js`,
    `${area_motion_detection_templates_directory}MotionDetectorsAreaBinarySensor.js`,
    // Area - Motion - Lighting
    `${area_motion_lighting_templates_directory}MotionLightingHybridTargetAreaInputText.js`,
    `${area_motion_lighting_templates_directory}MotionLightingHybridTargetAreaTemplateSelect.js`,
    `${area_motion_lighting_templates_directory}MotionLightingHybridTargetStateAreaInputText`,
    `${area_motion_lighting_templates_directory}MotionLightingModeAreaInputSelect.js`,
    `${area_motion_lighting_templates_directory}MotionLightingTargetAreaInputText.js`,
    `${area_motion_lighting_templates_directory}MotionLightingTargetAreaTemplateSelect.js`,
    `${area_motion_lighting_templates_directory}MotionLightingTargetStateAreaInputText.js`,
    `${area_motion_lighting_templates_directory}MotionLightingTimeoutAreaInputNumber.js`
  
  ];

  const generatedTemplatesCount = (base_path = "/") => {

    return available_templates.reduce((count, item) => {
      return item.includes(base_path) ? count + areas.length : count;
    }, 0);

  }

  const templatesCount = (base_path = "/") => {

    return available_templates.reduce((count, item) => {
      return item.includes(base_path) ? count + 1 : count;
    }, 0);

  }

  const templates_count = templatesCount();
  const generated_templates_count = generatedTemplatesCount();

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
      generatedTemplates = templateGenerator.generate('./nodes/modules/system/domain/models/template/area/');

      const generated_area_templates_count = generatedTemplatesCount(area_templates_directory)

      // Verify that the result is an array of correct length
      expect(generatedTemplates).toHaveLength(generated_area_templates_count);

      // Call the generate function with a sub path
      generatedTemplates = templateGenerator.generate('./nodes/modules/system/domain/models/template/area/climate/');
      
      const generated_area_climate_templates_count = generatedTemplatesCount(area_climate_templates_directory);

      // Verify that the result is an array of correct length
      expect(generatedTemplates).toHaveLength(generated_area_climate_templates_count);



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
      templateGenerator.generate(template, { write: true, visible: true });

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