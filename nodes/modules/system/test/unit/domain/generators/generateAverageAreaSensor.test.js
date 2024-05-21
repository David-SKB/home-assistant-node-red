const { mockAreas, mockEntities } = require('../../../../util/test');
const getRandomIndex = require('../../../../util/test/getRandomIndex');

const { generateAverageAreaSensor } = require('../../../../domain/generators');

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
    const area_id = getRandomIndex(areas).id;

    // Generate Average Temperature Area Sensor Templates
    const average_temperature_template = generateAverageAreaSensor(area_id, 'temperature', {
      domains: ['sensor', 'climate'],
      inclusions: ['temp'],
      exclusions: ['average', 'battery'],
      unit_of_measurement: '°C',
    });

    const state = `
    {% set domains = [\"sensor\",\"climate\"] %}
    {% set area_entities_list = area_entities('${area_id}') %}
    {% set temps = states
      | selectattr('domain', 'in', domains)
      | selectattr('entity_id', 'contains', 'temp')
      | selectattr('entity_id', 'in', area_entities_list)
      | rejectattr('entity_id', 'contains', 'average')
      | rejectattr('entity_id', 'contains', 'battery')
      | reject('none')
      | rejectattr('state', 'eq', 'unavailable')
      | map(attribute='state')
      | map('float')
      | list %}
    {% if temps | length > 0 %}
      {% set average_temp = temps | sum / temps | length %}
      {{ average_temp | round(1) }}
    {% else %}
      Unavailable
    {% endif %}
  `;

    const expected = {
      path: `/config/.storage/generated_templates/dynamic/average_temperature_${area_id}_sensor.yaml`,
      payload: {
        "template":[
          {
            "sensor":[
              {
                "name":`Average Temperature ${area_id}`,
                "unit_of_measurement":"°C",
                state
                }
              ]
            }
          ]
        }
    }

    // Assert that the template has been generated correctly
    expect(average_temperature_template).toStrictEqual(expected);

  });

  // Add more test cases as needed

});