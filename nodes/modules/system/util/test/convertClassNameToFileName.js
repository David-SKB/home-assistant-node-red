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
  suffix = ".yaml",
  visible = false

} = {}) {

  const template_iterators = {

    Area: area_id,
    Entity: entity_id,
    Person: entity_id

  };

  const template_name = path.basename(template_path, path.extname(template_path));
  if (visible) console.log(`template_name: ${template_name}`);
  
  // Split the template_path string on 'template/'
  const pathParts = template_path.split(template_directory);
  if (visible) console.log(`pathParts: ${pathParts}`);

  // Extract context path
  const context_path = pathParts.length > 1 ? pathParts[1].split(template_name)[0] : ''; 
  if (visible) console.log(`context_path: ${context_path}`);

  // Extract iterator context from context path
  const iterator_context = context_path.split('/')[0];
  if (visible) console.log(`iterator_context: ${iterator_context}`);

  // Determine the appropriate context ID based on iterator context
  let context_id = iterator_context ? template_iterators[titleCase(iterator_context)] : "";
  if (visible) console.log(`context_id: ${context_id}`);
  
  // Split based on uppercase letters
  const words = template_name.match(/[A-Z][a-z]*/g); 
  if (visible) console.log(`words: ${words}`);

  // Search and replace words with matching item in template_iterators 
  let words_replaced = false;
  const replaced_words = words.map(word => {
    const match = template_iterators[word];
    if (match) words_replaced = true;
    return match ? match : word.toLowerCase();
  });
  if (visible) console.log(`replaced_words: ${replaced_words}`);
  if (visible) console.log(`words_replaced: ${words_replaced}`);
  
  if (!words_replaced) context_id = '';
  if (visible) console.log(`context_id: ${context_id}`);

  // Construct the file name
  const file_name = replaced_words.join(delimiter);
  if (visible) console.log(`file_name: ${file_name}`);
  
  // Construct the final path considering the context
  const full_path = path.join(prefix, context_path, context_id, file_name + suffix);
  if (visible) console.log(`full_path: ${full_path}`);

  return full_path;

}

module.exports = convertClassNameToFileName;