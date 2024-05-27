const { Areas } = require('../../../../models');
const createFileSync = require('../../../../util/file/createFileSync');
const generateMotionLightingAreaTemplates = require('./lighting/motion/generateMotionLightingAreaTemplates.js');

function generateLightingAreaTemplates(areas = Areas.getAreaRegistry(), { 
  directory_path = "/config/.storage/templates/dynamic/area/lighting/"
}) {

  areas = (Array.isArray(areas)) ? areas : [areas]

  let templates = [];

  // Generate Area Templates
  areas.forEach(function (area) {

    templates = [ ...templates,

      // Generate Motion Lighting Templates
      ...generateMotionLightingAreaTemplates( area, { directory_path: `${directory_path}motion/` } )
      
    ];

  });

  // More generator functions can go here...
}
//  console.log(`Generated Lighting Area Template [${template.path}]: `, template.payload);
module.exports = generateLightingAreaTemplates;


generateAreaTemplates("area/lighting/motion/", {write:true} )