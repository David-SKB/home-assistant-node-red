const fs = require('fs');
const jsYaml = require('js-yaml');
const { Areas, Entities } = require('../models');
//const { exists } = require('../../util/common');
//const { generateAverageAreaSensor } = require('./generateAverageAreaSensor');
const generateAverageAreaSensor = require('./generateAverageAreaSensor');
function generateDynamicTemplates(options = {}) {
  
  let {
    areas = Areas.getAreas(), 
    entities = Entities.getEntities(), 
    directory_path = "/config/.storage/generated_templates/dynamic/"
  } = options;
  
  let template = {}

  // Generate Area Templates
  for (const area_id in areas) {

    /** CLIMATE **/
    let base_path = `${directory_path}climate/`;

    //Generate Average Temperature Area Sensor Templates
    template = generateAverageAreaSensor(area_id, 'temperature', {
      base_path,
      domains: ['sensor', 'climate'],
      inclusions: ['temp'],
      exclusions: ['average', 'battery'],
      unit_of_measurement: '°C',
    });
    fs.writeFileSync(template.path, jsYaml.dump(template.payload), 'utf8');

    // Generate Average Humidity Area Sensor Templates
    template = generateAverageAreaSensor(area_id, 'humidity', {
      base_path,
      domains: ['sensor', 'climate'],
      inclusions: ['humidity'],
      exclusions: ['average', 'battery'],
      unit_of_measurement: '%'
    });
    fs.writeFileSync(template.path, jsYaml.dump(template.payload), 'utf8');

  }

  // More dynamic template generators can go here...

}

module.exports = generateDynamicTemplates;