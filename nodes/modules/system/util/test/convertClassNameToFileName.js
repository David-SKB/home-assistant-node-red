const path = require('path');
const { titleCase } = require('../common');

function convertClassNameToFileName(template_path, { 

  // Iterators
  area_id, 
  entity_id,

  // Defaults
  template_directory = "/template/",
  delimiter = "_",
  prefix = "/config/.storage/templates",
  suffix = ".yaml"

} = {}) {

  const template_iterators = {

    Area: area_id,
    Entity: entity_id,
    Person: entity_id

  };

  const template_name = path.basename(template_path, path.extname(template_path));
  
  // Split the template_path string on 'template/'
  const pathParts = template_path.split(template_directory);

  // Extract context path
  const context_path = pathParts.length > 1 ? pathParts[1].split(template_name)[0] : ''; 

  // Extract iterator context from context path
  const iterator_context = context_path.split('/')[0];

  // Determine the appropriate context ID based on iterator context
  const context_id = template_iterators[titleCase(iterator_context)];
  
  // Split based on uppercase letters
  const words = template_name.match(/[A-Z][a-z]*/g); 

  // Search and replace words with matching item in template_iterators 
  const replaced_words = words.map(word => {
    return template_iterators[word] ? template_iterators[word] : word.toLowerCase();
  });

  // Construct the file name
  const file_name = replaced_words.join(delimiter);
  
  // Construct the final path considering the context
  const full_path = path.join(prefix, context_path, context_id, file_name + suffix);

  return full_path;
}

module.exports = convertClassNameToFileName;