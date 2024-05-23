const fs = require('fs');
const jsYaml = require('js-yaml');
const path = require('path');
const { mockAreas, mockEntities } = require('../../../../../util/test');
//const getRandomIndex = require('../../../../../util/test/getRandomIndex');

const { generateAverageAreaSensor } = require('../../../../../domain/templates/generators');

describe('generateAverageAreaSensor', () => {

  const areas = [
    { aliases: [], name: "Area 1", id: "area1", picture: null },
    { aliases: [], name: "Area 2", id: "area2", picture: null },
    { aliases: [], name: "Area 3", id: "area3", picture: null }
  ];

  const entities = [
    { entity_id: 'binary_sensor.area1_motion', area_id: 'area1' },
    { entity_id: 'binary_sensor.area2_motion', area_id: 'area2' },
  ];

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

  it('should generate the expected template for a given area ID', () => {
    const area_id = areas[0].id;
    const default_base_path = '/config/.storage/packages/dynamic/';

    // Generate Average Temperature Area Sensor Template
    const average_temperature_template = generateAverageAreaSensor(area_id, 'temperature', {
      area_name:areas[0].name,
      domains: ['sensor', 'climate'],
      inclusions: ['temp'],
      exclusions: ['average', 'battery'],
      unit_of_measurement: '°C',
    });

    const expected = fs.readFileSync(path.join(__dirname, '../mocks/average_temperature_area1_sensor.yaml'), 'utf8');

    // Assert that the file path has been generated correctly
    expect(average_temperature_template.path).toBe(`${default_base_path}average_temperature_${area_id}_sensor.yaml`);

    // Assert that the template has been generated correctly
    expect(average_temperature_template.payload).toBe(expected);

  });

  it('should generate the expected template for multiple inclusions', () => {
    const area_id = areas[0].id;
    const default_base_path = '/config/.storage/packages/dynamic/';

    // Generate Average Illuminance Area Sensor Template
    const average_temperature_template = generateAverageAreaSensor(area_id, 'illuminance', {
      area_name:areas[0].name,
      domains: ['sensor'],
      inclusions: ['illuminance', 'lux'],
      exclusions: ['average', 'battery'],
      unit_of_measurement: 'lx'
    });

    const expected = fs.readFileSync(path.join(__dirname, '../mocks/average_illuminance_area1_sensor.yaml'), 'utf8');

    // Assert that the file path has been generated correctly
    expect(average_temperature_template.path).toBe(`${default_base_path}average_illuminance_${area_id}_sensor.yaml`);

    // Assert that the template has been generated correctly
    expect(average_temperature_template.payload).toBe(expected);

  });

  it('should generate the expected template with the correct path if when specified', () => {
    const area_id = areas[0].id;
    const base_path = '/test/directory/';

    // Generate Average Temperature Area Sensor Template
    const average_temperature_template = generateAverageAreaSensor(area_id, 'temperature', {
      base_path,
      area_name:areas[0].name,
      domains: ['sensor', 'climate'],
      inclusions: ['temp'],
      exclusions: ['average', 'battery'],
      unit_of_measurement: '°C',
    });

    const expected = fs.readFileSync(path.join(__dirname, '../mocks/average_temperature_area1_sensor.yaml'), 'utf8');

    // Assert that the file path has been generated correctly
    expect(average_temperature_template.path).toBe(`${base_path}average_temperature_${area_id}_sensor.yaml`);

    // Assert that the template has been generated correctly
    expect(average_temperature_template.payload).toBe(expected);

  });

  // Add more test cases as needed

});