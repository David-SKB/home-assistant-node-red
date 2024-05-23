const { Areas, Entities } = require('../../models');
const createFileSync = require('../../../util/file/createFileSync');
const generateAverageAreaSensor = require('./generateAverageAreaSensor');

function generateDynamicTemplates(options = {}) {

  // Extract options
  const { 
    areas = Areas.getAreas(), 
    entities = Entities.getEntities(), 
    directory_path = "/config/.storage/packages/dynamic/"
  } = options;

  let template = {};

  // Generate Area Templates
  for (const area_id in areas) {

    /** CLIMATE **/
    let base_path = `${directory_path}climate/`;

    // Generate Average Temperature Sensor Templates
    template = generateAverageAreaSensor(area_id, 'temperature', {
      area_name: areas[area_id].name,
      base_path,
      domains: ['sensor', 'climate'],
      inclusions: ['temp'],
      exclusions: ['average', 'battery'],
      unit_of_measurement: '°C',
    });
    createFileSync(template.path, template.payload);

    // Generate Average Humidity Sensor Templates
    template = generateAverageAreaSensor(area_id, 'humidity', {
      area_name: areas[area_id].name,
      base_path,
      domains: ['sensor', 'climate'],
      inclusions: ['humidity'],
      exclusions: ['average', 'battery'],
      unit_of_measurement: '%'
    });
    createFileSync(template.path, template.payload);

    // Generate Average Illuminance Sensor Templates
    template = generateAverageAreaSensor(area_id, 'illuminance', {
      area_name: areas[area_id].name,
      base_path,
      domains: ['sensor'],
      inclusions: ['illuminance', 'lux'],
      exclusions: ['average', 'battery'],
      unit_of_measurement: 'lx'
    });
    createFileSync(template.path, template.payload);

  }

  // More dynamic template generators can go here...
}

module.exports = generateDynamicTemplates;