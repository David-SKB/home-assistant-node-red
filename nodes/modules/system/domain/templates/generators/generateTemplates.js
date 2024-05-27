const generateAreaTemplates = require('./area/generateAreaTemplates');

function generateTemplates(directory_path = "/config/.storage/packages/dynamic/") {

  // Generate Area Templates
  generateAreaTemplates({directory_path: `${directory_path}area/`});
  
  // More template generator functions can go here...
}


module.exports = generateTemplates;