const Areas = require("../../../Areas");
const AverageMetricSensor = require("../../dynamic/AverageMetricSensor");

class AverageLuxAreaSensor extends AverageMetricSensor {

  constructor(area_id, {

    area_name = area_id,
    path,
    ...options

  } = {}) {

    const metric = 'lux';

    super(metric, {

      // Required
      area_id,

      // Defaults
      unit_of_measurement: 'lx',
      domains: ['sensor'],
      inclusions: ['illuminance', 'lux'],
      exclusions: ['average', 'battery'],
      base_path: `/config/.storage/templates/area/climate/${area_id}/`,
      file_name: `average_lux_${area_id}_sensor.yaml`,
      iterable: Areas.getAreaRegistry().map(area => (
        [ area.id, { area_name: area.name } ]
      )),

      // Optional
      area_name,
      path,
      ...options

    });

  }

}

module.exports = AverageLuxAreaSensor;