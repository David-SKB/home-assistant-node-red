const Areas = require("../../../Areas");
const AverageMetricSensor = require("../../dynamic/AverageMetricSensor");

class AverageHumidityAreaSensor extends AverageMetricSensor {

  constructor(area_id, {

    area_name = area_id,
    path,
    ...options

  } = {}) {

    super('humidity', {

      // Required
      area_id,

      // Defaults
      unit_of_measurement: '%',
      domains: ['sensor', 'climate'],
      inclusions: ['humidity'],
      exclusions: ['average', 'battery'],
      base_path: `/config/.storage/templates/area/climate/${area_id}/`,
      file_name: `average_humidity_${area_id}_sensor.yaml`,
      iterable: Areas.getAreaRegistry().map(area => ({ 
        area_id: area.id, 
        area_name: area.name 
      })),

      // Optional
      area_name,
      path,
      ...options

    });
  }
}

module.exports = AverageHumidityAreaSensor;
