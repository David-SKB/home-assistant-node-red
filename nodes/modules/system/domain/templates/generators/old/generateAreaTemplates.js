const { Areas, Entities } = require('../../../models');
const createFileSync = require('../../../../util/file/createFileSync');
const generateAverageAreaSensor = require('./../area/generateAverageAreaSensor');
const generateMotionLightingAreaTemplates = require('./generateMotionLightingAreaTemplates.js');

function generateAreaTemplates({ 
  areas = Areas.getAreas(), 
  directory_path = "/config/.storage/packages/dynamic/"
}) {

  let template = {};

  // Generate Area Templates
  for (const area_id in areas) {

    const area_name = areas[area_id].name;

    /** CLIMATE **/
    let base_path = `${directory_path}climate/`;

    // Generate Average Temperature Sensor Templates
    template = generateAverageAreaSensor(area_id, 'temperature', {
      area_name,
      base_path,
      domains: ['sensor', 'climate'],
      inclusions: ['temp'],
      exclusions: ['average', 'battery'],
      unit_of_measurement: '°C',
    });
    createFileSync(template.path, template.payload);

    // Generate Average Humidity Sensor Templates
    template = generateAverageAreaSensor(area_id, 'humidity', {
      area_name,
      base_path,
      domains: ['sensor', 'climate'],
      inclusions: ['humidity'],
      exclusions: ['average', 'battery'],
      unit_of_measurement: '%'
    });
    createFileSync(template.path, template.payload);

    // Generate Average Illuminance Sensor Templates
    template = generateAverageAreaSensor(area_id, 'illuminance', {
      area_name,
      base_path,
      domains: ['sensor'],
      inclusions: ['illuminance', 'lux'],
      exclusions: ['average', 'battery'],
      unit_of_measurement: 'lx'
    });
    createFileSync(template.path, template.payload);

    // Generate Motion Lighting Templates
    generateMotionLightingAreaTemplates(area_id, {
      base_path: `${directory_path}motion_lighting/${area_id}/`,
      area_name
    }).forEach(template => {
      createFileSync(template.path, template.payload);
      console.log(`Generated Motion templates for ${area_name}:`, template);
    });

  }

  // More dynamic template generators can go here...
}

module.exports = generateAreaTemplates;