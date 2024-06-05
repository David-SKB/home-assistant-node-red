const fs = require('fs');
const path = require('path');
const { mockAreas, mockEntities, normalizeMultilineString } = require('../../../../../../../util/test');

const AverageMetricSensor = require('../../../../../../../domain/models/template/dynamic/AverageMetricSensor');

describe('AverageSensor', () => {

  const areas = [
    { aliases: [], name: "Area 1", id: "area1", picture: null },
    { aliases: [], name: "Area 2", id: "area2", picture: null },
    { aliases: [], name: "Area 3", id: "area3", picture: null }
  ];

  const base_path = (area_id) => `/config/.storage/templates/area/${area_id}/`;
  const file_name = (metric, area_id) => `average_${metric}_${area_id}_sensor.yaml`;
  const general_file_name = (metric) => `average_${metric}_sensor.yaml`;

  beforeEach(() => {
    mockAreas.setup(areas);
    mockEntities.setup([]);
  });

  afterEach(() => {
    mockAreas.resetMocks();
    mockEntities.resetMocks();
  });

  it('should set default values correctly with area_id', () => {
    const metric = 'temperature';
    const area_id = areas[0].id;

    const template = new AverageMetricSensor({ metric, area_id });

    expect(template.area_name).toBe(area_id);
    expect(template.base_path).toBe(base_path(area_id));
    expect(template.file_name).toBe(file_name(metric, area_id));
    expect(template.path).toBe(path.join(base_path(area_id), file_name(metric, area_id)));
  });

  it('should set default values correctly without area_id', () => {
    const metric = 'temperature';

    const template = new AverageMetricSensor({metric});

    expect(template.area_name).toBeUndefined();
    expect(template.base_path).toBe('/config/.storage/templates/');
    expect(template.file_name).toBe(general_file_name(metric));
    expect(template.path).toBe(path.join('/config/.storage/templates/', general_file_name(metric)));
  });

  it('should override default values correctly', () => {
    const metric = 'humidity';
    const custom_base_path = '/custom/path/';
    const custom_file_name = 'custom.yaml';
    const custom_path = '/custom/full/path/custom.yaml';
    const custom_area_name = 'Custom Area';
    const custom_domains = ['sensor', 'binary_sensor'];
    const custom_inclusions = ['humidity', 'moisture'];
    const custom_exclusions = ['average', 'median'];
    const custom_unit_of_measurement = 'g/m³';

    const template = new AverageMetricSensor({
      metric,
      base_path: custom_base_path,
      file_name: custom_file_name,
      path: custom_path,
      area_name: custom_area_name,
      domains: custom_domains,
      inclusions: custom_inclusions,
      exclusions: custom_exclusions,
      unit_of_measurement: custom_unit_of_measurement,
    });

    expect(template.base_path).toBe(custom_base_path);
    expect(template.file_name).toBe(custom_file_name);
    expect(template.path).toBe(custom_path);
    expect(template.area_name).toBe(custom_area_name);
    expect(template.domains).toEqual(custom_domains);
    expect(template.inclusions).toEqual(custom_inclusions);
    expect(template.exclusions).toEqual(custom_exclusions);
    expect(template.unit_of_measurement).toBe(custom_unit_of_measurement);
  });

  it('should generate the expected average sensor template with area_id', () => {
    const metric = 'temperature';
    const area_id = areas[0].id;
    const area_name = areas[0].name;
    const expected = fs.readFileSync(path.join(__dirname, `../../../../templates/mocks/average_${metric}_${area_id}_sensor.yaml`), 'utf8');

    const generated_template = new AverageMetricSensor({
      metric,
      area_id,
      area_name,
      domains: ['sensor', 'climate'],
      inclusions: ['temp'],
      exclusions: ['average', 'battery'],
      unit_of_measurement: '°C',
      device_class:"temperature"
    }).generate().payload;

    expect(normalizeMultilineString(generated_template)).toBe(normalizeMultilineString(expected));
  });

  it('should generate the expected average sensor template without area_id', () => {
    const metric = 'temperature';
    const expected = fs.readFileSync(path.join(__dirname, `../../../../templates/mocks/average_${metric}_sensor.yaml`), 'utf8');

    const generated_template = new AverageMetricSensor({metric}).generate().payload;

    expect(normalizeMultilineString(generated_template)).toBe(normalizeMultilineString(expected));
  });

  it('should generate the expected average sensor template for illuminance with two inclusions', () => {
    const metric = 'lux';
    const area_id = areas[0].id;
    const area_name = areas[0].name;
    const expected = fs.readFileSync(path.join(__dirname, `../../../../templates/mocks/average_${metric}_${area_id}_sensor.yaml`), 'utf8');

    const generated_template = new AverageMetricSensor({
      metric,
      area_id,
      area_name,
      domains: ['sensor'],
      inclusions: ['illuminance', 'lux'],
      exclusions: ['average', 'battery'],
      unit_of_measurement: 'lx'
    }).generate().payload;

    expect(normalizeMultilineString(generated_template)).toBe(normalizeMultilineString(expected));
  });

});