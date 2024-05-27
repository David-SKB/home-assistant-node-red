const fs = require('fs');
const path = require('path');
const { mockAreas, mockEntities, normalizeMultilineString } = require('../../../../../../../util/test');
const AverageLuxAreaSensor = require('../../../../../../../domain/models/template/area/climate/AverageLuxAreaSensor');

describe('LuxSensor', () => {
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

  it('should generate the expected lux sensor template with area_id', () => {
    const area_id = areas[0].id;
    const area_name = areas[0].name;
    const expected = fs.readFileSync(path.join(__dirname, `../../../../templates/mocks/average_lux_${area_id}_sensor.yaml`), 'utf8');

    const generated_template = new AverageLuxAreaSensor(area_id, { area_name }).generate().payload;

    expect(normalizeMultilineString(generated_template)).toBe(normalizeMultilineString(expected));
  });

  // Add more tests as needed
});
