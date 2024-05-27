const { Areas } = require('../../../models');
const createFileSync = require('../../../../util/file/createFileSync');
const generateLightingAreaTemplates = require('./lighting/generateLightingAreaTemplates.js');
const generateClimateAreaTemplates = require('./climate/generateClimateAreaTemplates.js');

function generateAreaTemplates({ 
  areas = Areas.getAreas(), 
  directory_path = "/config/.storage/packages/dynamic/area/"
}) {

  // Generate Area Templates
  for (const area_id in areas) {

    const area_name = areas[area_id].name;

    // Generate Climate Templates
    generateClimateAreaTemplates(area_id, {
      base_path: `${directory_path}climate/${area_id}/`,
      area_name
    }).forEach(template => {
      createFileSync(template.path, template.payload);
      console.log(`Generated Climate Area Template [${template.path}]: `, template.payload);
    });

    // Generate Lighting Templates
    generateLightingAreaTemplates(area_id, {
      base_path: `${directory_path}lighting/${area_id}/`,
      area_name
    }).forEach(template => {
      createFileSync(template.path, template.payload);
      
    });

  }

  // More area template generators can go here...
}

module.exports = generateAreaTemplates;