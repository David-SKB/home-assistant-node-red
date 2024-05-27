const fs = require('fs');
const TemplateGenerator = require("../../../../../domain/models/template/TemplateGenerator");
const template = require("../../../../../domain/models/template");
const { mockAreas, mockEntities } = require('../../../../../util/test');

// Mock the file system
jest.mock('fs');

describe('TemplateGenerator', () => {
  let templateGenerator;

  const areas = [
    { aliases: [], name: "Area 1", id: "area1", picture: null },
    { aliases: [], name: "Area 2", id: "area2", picture: null },
    { aliases: [], name: "Area 3", id: "area3", picture: null }
  ]

  const entities = [
    { entity_id: 'binary_sensor.area1_motion', area_id: 'area1' },
    { entity_id: 'binary_sensor.area2_motion', area_id: 'area2' },
    { entity_id: 'binary_sensor.area3_motion', area_id: 'area3' },
    { entity_id: 'binary_sensor.area4_motion', area_id: 'area4' },
    { entity_id: 'binary_sensor.area5_motion', area_id: 'area5' }
  ]
  
  const available_templates = [

    // Climate
    'template/area/climate/AverageHumidityAreaSensor.js',
    'template/area/climate/AverageLuxAreaSensor.js', 
    'template/area/climate/AverageTemperatureAreaSensor.js', 

    // Motion Lighting
    'template/area/lighting/motion/MotionLightingHybridTargetAreaInputText.js',
    'template/area/lighting/motion/MotionlightingHybridTargetAreaTemplateSelect.js',
    'template/area/lighting/motion/MotionlightingModeAreaInputSelect.js',
    'template/area/lighting/motion/MotionlightingTargetAreaInputText.js',
    'template/area/lighting/motion/MotionlightingTargetAreaTemplateSelect.js',
    'template/area/lighting/motion/MotionlightingTimeoutAreaInputDatetime.js'

  ];

  const available_templates_count = available_templates.length;

  const climate_templates_count = available_templates.reduce((count, item) => {
    return item.startsWith('template/area/climate/') ? count + areas.length: count;
  }, 0);

  const motion_lighting_templates_count = available_templates.reduce((count, item) => {
    return item.startsWith('template/area/lighting/motion/') ? count + areas.length: count;
  }, 0);

  const generated_templates_count = available_templates.reduce((count, item) => {
    return item.startsWith('template/area/') ? count + areas.length: count + 1;
  }, 0);

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
      expect(templateClasses).toHaveLength(available_templates_count);
      expect(templateClasses.every(cls => typeof cls === 'function')).toBe(true);
    });

  });

  describe('generate', () => {
  
    it('should generate templates and return an array of correct length', () => {
      let generatedTemplates;

      // Call the generate function with a path
      generatedTemplates = templateGenerator.generate('./nodes/modules/system/domain/models/template/area/climate');

      // Verify that the result is an array of correct length
      expect(generatedTemplates).toHaveLength(climate_templates_count);

      // Call the generate function with a path
      generatedTemplates = templateGenerator.generate('./nodes/modules/system/domain/models/template/area/lighting/motion');
      
      // Verify that the result is an array of correct length
      expect(generatedTemplates).toHaveLength(motion_lighting_templates_count);

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

});
