const fs = require('fs');
const path = require('path');
const { mockAreas, mockEntities, normalizeMultilineString } = require('../../../../../../../util/test');
const AverageTemperatureAreaSensor = require('../../../../../../../domain/models/template/dynamic/area/climate/AverageTemperatureAreaSensor');
const { Areas } = require('../../../../../../../domain/models');

describe('TemperatureSensor', () => {

  const default_base_path = (area_id) => `/config/.storage/templates/area/climate/${area_id}/`;
  const default_file_name = (area_id) =>`average_temperature_${area_id}_sensor.yaml`;

  const areas = [
    { aliases: [], name: "Area 1", id: "area1", picture: null },
    { aliases: [], name: "Area 2", id: "area2", picture: null },
    { aliases: [], name: "Area 3", id: "area3", picture: null }
  ];

  beforeEach(() => {
    mockAreas.setup(areas);
    mockEntities.setup([]);
  });

  afterEach(() => {
    mockAreas.resetMocks();
    mockEntities.resetMocks();
  });

  it('should generate the expected temperature sensor template and path with area_id', () => {
    const iterable = Areas.getAreaRegistry().map(area => (
      [ area.id, { area_name: area.name } ]
    ));

    const area_id = areas[0].id;
    const area_name = areas[0].name;

    const expected = fs.readFileSync(path.join(__dirname, 
      `../../../../templates/mocks/average_temperature_${area_id}_sensor.yaml`), 
      'utf8'
    );

    const generated_template = new AverageTemperatureAreaSensor({ area_id, area_name }).generate();

    // Check the generated path is correct
    expect(generated_template.path).toBe(path.join(default_base_path(area_id), default_file_name(area_id)));

    // Check the generated template is correct
    expect(normalizeMultilineString(generated_template.payload)).toBe(normalizeMultilineString(expected));
  });

  // Add more tests as needed
});