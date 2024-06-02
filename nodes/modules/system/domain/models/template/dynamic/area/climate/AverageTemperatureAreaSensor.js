const Areas = require("../../../../Areas");
const AverageMetricSensor = require("../../../dynamic/AverageMetricSensor");

class AverageTemperatureAreaSensor extends AverageMetricSensor {

  constructor({

    area_id,

    area_name = area_id,
    path,
    ...options

  } = {}) {

    const metric = 'temperature';

    super({

      // Required
      area_id,

      // Defaults
      metric,
      unit_of_measurement: '°C',
      domains: ['sensor', 'climate'],
      inclusions: ['temp'],
      exclusions: ['average', 'battery'],
      base_path: `/config/.storage/templates/area/climate/${area_id}/`,
      file_name: `average_${metric}_${area_id}_sensor.yaml`,
      iterable: Areas.getAreaRegistry().map(area => (
        [ { metric, area_id: area.id, area_name: area.name } ]
      )),

      // Optional
      area_name,
      path,
      ...options

    });

    this.template = this.build();

  }

}

module.exports = AverageTemperatureAreaSensor;