const Areas = require("../../../../Areas");
const AverageMetricSensor = require("../../../dynamic/AverageMetricSensor");

class AverageHumidityAreaSensor extends AverageMetricSensor {

  constructor({

    area_id,

    area_name = area_id,
    path,
    ...options

  } = {}) {

    const metric = 'humidity';

    super({

      // Required
      area_id,

      // Defaults
      metric,
      device_class: 'humidity',
      unit_of_measurement: '%',
      domains: ['sensor', 'climate'],
      inclusions: ['humidity'],
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

module.exports = AverageHumidityAreaSensor;