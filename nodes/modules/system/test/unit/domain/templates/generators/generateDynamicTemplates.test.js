const { mockAreas, mockEntities } = require('../../../../../util/test');
const getRandomIndex = require('../../../../../util/test/getRandomIndex');
const fs = require('fs');
const jsYaml = require('js-yaml');

const { generateDynamicTemplates, generateAverageAreaSensor } = require('../../../../../domain/templates/generators');

describe('generateDynamicTemplates', () => {

  const areas = [
    { aliases: [], name: "Area 1", id: "area1", picture: null },
    { aliases: [], name: "Area 2", id: "area2", picture: null },
    { aliases: [], name: "Area 3", id: "area3", picture: null }
  ];

  const entities = [
    { entity_id: 'binary_sensor.area1_motion', area_id: 'area1' },
    { entity_id: 'binary_sensor.area2_motion', area_id: 'area2' },
  ];

  const available_templates = ['Temperature', 'Humidity', 'Illuminance'];

  beforeEach(() => {
    // Initialize areas before each test case
    mockAreas.setup(areas);
    mockEntities.setup(entities);
  });

  afterEach(() => {
    // Reset areas after each test case
    mockAreas.resetMocks();
    mockEntities.resetMocks();
  });

  it('should call fs.writeFileSync with the correct path', () => {
    const area_id = 'area1';
    const directory_path = "/test/output/";
    //generateAverageAreaSensor(area_id, 'temperature');
    generateDynamicTemplates({directory_path});

    expect(fs.writeFileSync).toHaveBeenNthCalledWith(1, 
      `${directory_path}climate/average_temperature_${area_id}_sensor.yaml`, 
      expect.any(String), 
      'utf8'
    );
    expect(fs.writeFileSync).toHaveBeenNthCalledWith(2, 
      `${directory_path}climate/average_humidity_${area_id}_sensor.yaml`, 
      expect.any(String), 
      'utf8'
    );
    expect(fs.writeFileSync).toHaveBeenNthCalledWith(3, 
      `${directory_path}climate/average_illuminance_${area_id}_sensor.yaml`, 
      expect.any(String), 
      'utf8'
    );

    // Check that fs.readFileSync was called the correct number of times
    expect(fs.writeFileSync).toHaveBeenCalledTimes(areas.length * available_templates.length);

    const dumpedYaml = jsYaml.dump(generateAverageAreaSensor(area_id, 'temperature', {
      domains: ['sensor', 'climate'],
      inclusions: ['temp'],
      exclusions: ['average', 'battery'],
      unit_of_measurement: '°C',
    }).payload);

    console.log(dumpedYaml);
  });


  // Add more test cases as needed

});