const fs = require('fs');
const pathUtil = require('path');
const TemplateGenerator = require("../../../../../domain/models/template/TemplateGenerator");
const template = require("../../../../../domain/models/template");
const { mockAreas, mockEntities, mockDomains } = require('../../../../../util/test');
const convertClassNameToFileName = require('../../../../../util/test/convertClassNameToFileName');
const InclusionExclusionSelectTemplate = require('../../../../../domain/models/template/components/ui/config/inclusion_exclusion_select/InclusionExclusionSelectTemplate');

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

  const domains = [
    'light',
    'switch',
    'button'
  ];

  // Directory paths
  const templates_directory = "/template/";

  const area_templates_directory = `${templates_directory}area/`;
  const area_climate_templates_directory = `${area_templates_directory}climate/`;
  const area_motion_templates_directory = `${area_templates_directory}motion/`;
  const area_motion_detection_templates_directory = `${area_motion_templates_directory}detection/`;
  const area_motion_lighting_templates_directory = `${area_motion_templates_directory}lighting/`;

  const domain_templates_directory = `${templates_directory}domain/`;
  const domain_monitoring_templates_directory = `${domain_templates_directory}monitoring/`;
  const domain_util_templates_directory = `${domain_templates_directory}util/`;

  const components_templates_directory = `${templates_directory}components/`;
  const dynamic_components_directory = `${templates_directory}dynamic/components/`;
  const ui_components_templates_directory = `${components_templates_directory}ui/`;
  const ui_motion_components_templates_directory = `${ui_components_templates_directory}motion/`;
  const ui_motion_lighting_components_templates_directory = `${ui_motion_components_templates_directory}lighting/`;
  const components_inclusion_exclusion_select_directory = `${dynamic_components_directory}inclusion_exclusion_select/`;


  const available_templates = [
    // Area - Climate
    { template: `${area_climate_templates_directory}AverageHumidityAreaSensor.js`, squash: false },
    { template: `${area_climate_templates_directory}AverageLuxAreaSensor.js`, squash: false },
    { template: `${area_climate_templates_directory}AverageTemperatureAreaSensor.js`, squash: false },
    // Area - Motion - Detection
    { template: `${area_motion_detection_templates_directory}AverageMotionDetectionDurationAreaInputNumber.js`, squash: false },
    { template: `${area_motion_detection_templates_directory}AverageMotionDetectionDurationAreaSensor.js`, squash: false },
    { template: `${area_motion_detection_templates_directory}AverageMotionDetectionIntervalAreaInputNumber.js`, squash: false },
    { template: `${area_motion_detection_templates_directory}AverageMotionDetectionIntervalAreaSensor.js`, squash: false },
    { template: `${area_motion_detection_templates_directory}CalculateAverageMotionDetectionIntervalAreaAutomation.js`, squash: false },
    { template: `${area_motion_detection_templates_directory}CalculateAverageMotionDetectionIntervalAreaToggleAutomation.js`, squash: false },
    { template: `${area_motion_detection_templates_directory}MotionDetectionToggleAreaInputBoolean.js`, squash: false },
    { template: `${area_motion_detection_templates_directory}MotionDetectionToggleAreaSwitch.js`, squash: false },
    { template: `${area_motion_detection_templates_directory}MotionDetectionToggleSwitchGroup.js`, squash: true },
    { template: `${area_motion_detection_templates_directory}MotionDetectorsAreaBinarySensor.js`, squash: false },
    // Area - Motion - Lighting
    { template: `${area_motion_lighting_templates_directory}MotionLightingAutoContextWindowAreaInputNumber.js`, squash: false },
    { template: `${area_motion_lighting_templates_directory}MotionLightingAutoContextWindowAreaSensor.js`, squash: false },
    { template: `${area_motion_lighting_templates_directory}MotionLightingAutoMaximumTimeoutAreaInputNumber.js`, squash: false },
    { template: `${area_motion_lighting_templates_directory}MotionLightingAutoMaximumTimeoutAreaSensor.js`, squash: false },
    { template: `${area_motion_lighting_templates_directory}MotionLightingAutoMinimumTimeoutAreaInputNumber.js`, squash: false },
    { template: `${area_motion_lighting_templates_directory}MotionLightingAutoMinimumTimeoutAreaSensor.js`, squash: false },
    { template: `${area_motion_lighting_templates_directory}MotionLightingAutoSensetivityAreaInputNumber.js`, squash: false },
    { template: `${area_motion_lighting_templates_directory}MotionLightingAutoTimeoutAreaSensor.js`, squash: false },
    { template: `${area_motion_lighting_templates_directory}MotionLightingHybridTargetAreaInputText.js`, squash: false },
    { template: `${area_motion_lighting_templates_directory}MotionLightingHybridTargetAreaTemplateSelect.js`, squash: false },
    { template: `${area_motion_lighting_templates_directory}MotionLightingHybridTargetStateAreaInputText`, squash: false },
    { template: `${area_motion_lighting_templates_directory}MotionLightingModeAreaInputSelect.js`, squash: false },
    { template: `${area_motion_lighting_templates_directory}MotionLightingTargetAreaInputText.js`, squash: false },
    { template: `${area_motion_lighting_templates_directory}MotionLightingTargetAreaTemplateSelect.js`, squash: false },
    { template: `${area_motion_lighting_templates_directory}MotionLightingTargetStateAreaInputText.js`, squash: false },
    { template: `${area_motion_lighting_templates_directory}MotionLightingTimeoutAreaInputNumber.js`, squash: false },
    // Domain - Monitoring
    { template: `${domain_monitoring_templates_directory}SceneManagerScript.js`, squash: true },
    // Domain - Util
    { template: `${domain_util_templates_directory}ConvertTargetToEntitiesScript.js`, squash: true },
    // Components - UI - Motion - Lighting
    { template: `${ui_motion_lighting_components_templates_directory}MotionLightingSettingsZoneComponent.js`, squash: true },
    // Components - Inclusion / Exclusion Select
    
    //{ template: `${components_inclusion_exclusion_select_directory}DoorbellEntityInclusionExclusionSelect.js`, squash: false }
    // Temporary test solution, suite needs refactoring...
    { template: `${components_inclusion_exclusion_select_directory}doorbell_entity/add_remove_doorbell_entity_inclusion_input_button.yaml`, squash: true },
    { template: `${components_inclusion_exclusion_select_directory}doorbell_entity/doorbell_entity_inclusions_input_text.yaml`, squash: true },
    { template: `${components_inclusion_exclusion_select_directory}doorbell_entity/doorbell_entity_inclusions_exclusions_state_input_text.yaml`, squash: true },
    { template: `${components_inclusion_exclusion_select_directory}doorbell_entity/doorbell_entity_inclusions_exclusions_template_select.yaml`, squash: true },
    { template: `${components_inclusion_exclusion_select_directory}doorbell_entity/update_doorbell_entity_inclusions_exclusions_automation.yaml`, squash: true },
    
    { template: `${components_inclusion_exclusion_select_directory}mobile_app_notify_service/add_remove_mobile_app_notify_service_exclusion_input_button.yaml`, squash: true },
    { template: `${components_inclusion_exclusion_select_directory}mobile_app_notify_service/mobile_app_notify_service_exclusions_input_text.yaml`, squash: true },
    { template: `${components_inclusion_exclusion_select_directory}mobile_app_notify_service/mobile_app_notify_service_exclusions_inclusions_state_input_text.yaml`, squash: true },
    { template: `${components_inclusion_exclusion_select_directory}mobile_app_notify_service/mobile_app_notify_service_exclusions_inclusions_template_select.yaml`, squash: true },
    { template: `${components_inclusion_exclusion_select_directory}mobile_app_notify_service/update_mobile_app_notify_service_exclusions_inclusions_automation.yaml`, squash: true },

  ];

  const longestMatchingBasePath = (templatePath) => {
    const paths = [
      components_inclusion_exclusion_select_directory,
      ui_motion_lighting_components_templates_directory,
      domain_monitoring_templates_directory,
      domain_util_templates_directory,
      domain_templates_directory,
      area_motion_lighting_templates_directory,
      area_motion_detection_templates_directory,
      area_motion_templates_directory,
      area_climate_templates_directory,
      area_templates_directory
    ];

    return paths.reduce((longest, current) => {
      return templatePath.includes(current) && current.length > longest.length ? current : longest;
    }, "");
  };

  const generatedTemplatesCount = (base_path = "/") => {
    const multiplierMapping = {
      [area_templates_directory]: areas.length,
      [area_climate_templates_directory]: areas.length,
      [area_motion_templates_directory]: areas.length,
      [area_motion_detection_templates_directory]: areas.length,
      [area_motion_lighting_templates_directory]: areas.length,
      [domain_templates_directory]: domains.length,
      //[components_inclusion_exclusion_select_directory]: 5
    };

    return available_templates.reduce((count, item) => {
      const longestBasePath = longestMatchingBasePath(item.template);
      const multiplier = item.squash ? 1 : multiplierMapping[longestBasePath] || 0;
      return item.template.includes(base_path) ? count + multiplier : count;
    }, 0);
  };

  const templatesCount = (base_path = "/") => {
    return available_templates.reduce((count, item) => {
      return item.template.includes(base_path) ? count + 1 : count;
    }, 0);
  };

  const templates_count = templatesCount();
  const generated_templates_count = generatedTemplatesCount();

  beforeEach(() => {
    mockAreas.setup(areas);
    mockEntities.setup(entities);
    mockDomains.setup(domains);
    templateGenerator = new TemplateGenerator();
  });

  afterEach(() => {
    mockAreas.resetMocks();
    mockEntities.resetMocks();
    mockDomains.resetMocks();
    jest.clearAllMocks();
  });

  describe('getTemplateClasses', () => {
    it('should return an array of template classes', () => {
      // Mock the file system to simulate template files
      fs.readdirSync.mockReturnValue(['Template1.js', 'Template2.js']);
      
      // Call the method and check the result
      const templateClasses = templateGenerator.getTemplateClasses(template);

      // Needs refactoring
      const inclusions_exclusions_multiplier = 4;
      const inclusions_exclusions_component_count = 2;
      const inclusions_exclusions_diff = (inclusions_exclusions_multiplier * inclusions_exclusions_component_count);

      // Assert that the result is an array of template classes
      expect(templateClasses).toHaveLength(templates_count - inclusions_exclusions_diff);
      expect(templateClasses.every(cls => typeof cls === 'function')).toBe(true);
    });
  });

  describe('generate', () => {
    it('should generate templates and return an array of correct length', () => {
      let generatedTemplates;

      // Call the generate function with a path
      generatedTemplates = templateGenerator.generate('./nodes/modules/system/domain/models/template/');

      const generated_area_templates_count = generatedTemplatesCount(templates_directory);

      // Verify that the result is an array of correct length
      expect(generatedTemplates).toHaveLength(generated_area_templates_count);

      // Call the generate function with a sub path
      generatedTemplates = templateGenerator.generate('./nodes/modules/system/domain/models/template/dynamic/area/climate/');
      
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
      templateGenerator.generate(template, { write: true, visible: false });

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
        available_templates.map(templatePath => convertClassNameToFileName(templatePath.template, { area_id: area.id, visible: false }))
      );

      console.log('expected paths:');
      console.log(expectedPaths);

      const generatedTemplates = templateGenerator.generate(template);
      const generatedPaths = generatedTemplates.map(t => pathUtil.normalize(t.path));

      console.log('generated paths:');
      console.log(generatedPaths);

      // Verify that generated paths match the expected paths
      expectedPaths.forEach(expectedPath => {
        //const template_name = pathUtil.basename(template_path, pathUtil.extname(template_path));

        expect(generatedPaths).toContain(expectedPath);
      });
    });
  });
});
