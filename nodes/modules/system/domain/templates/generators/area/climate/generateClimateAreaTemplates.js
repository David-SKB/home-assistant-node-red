const AverageSensor = require('../../../../models/template/dynamic/AverageMetricSensor');

function generateClimateAreaTemplates(area_id, {
  base_path = `/config/.storage/packages/dynamic/climate/${area_id}/`,
  area_name = area_id,
}) {

  const templates = [

    // Average Temperature Sensor
    new AverageSensor('temperature', { 
      area_id, 
      area_name,
      base_path,

      domains: ['sensor', 'climate'],
      inclusions: ['temp'],
      exclusions: ['average', 'battery'],
      unit_of_measurement: '°C'
    }).generate(),

    // Average Humidity Sensor
    new AverageSensor('humidity', { 
      area_id, 
      area_name,
      base_path,

      domains: ['sensor', 'climate'],
      inclusions: ['humidity'],
      exclusions: ['average', 'battery'],
      unit_of_measurement: '%'
    }).generate(),

    // Average Illuminance Sensor
    new AverageSensor('lux', { 
      area_id, 
      area_name,
      base_path,

      domains: ['sensor'],
      inclusions: ['illuminance', 'lux'],
      exclusions: ['average', 'battery'],
      unit_of_measurement: 'lx'
    }).generate()
  ];

  return templates;
}

module.exports = generateClimateAreaTemplates;
