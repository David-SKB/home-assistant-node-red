const fs = require('fs');
const pathUtil = require('path');
const Template = require('./Template');

class TemplateGenerator {

  getTemplateClasses(dir) {

    let templateClasses = [];

    fs.readdirSync(dir).forEach(file => {

      const fullPath = pathUtil.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {

        // Recurse into sub-directories
        templateClasses = templateClasses.concat(this.getTemplateClasses(fullPath));

      } else if (file.endsWith('.js')) {

        // Load the template class from the template file.
        const templateClass = require(fullPath);

        // Check if the template class is a subclass of the Template class.
        if (typeof templateClass === 'function' && templateClass.prototype instanceof Template) {
          
          // Add the template class to the list of template classes.
          templateClasses.push(templateClass);

        }

      }
      
    });

    return templateClasses;

  }

  generate(path, { write = false } = {}) {

    const templates_directory = pathUtil.resolve(path);
    const templateClasses = this.getTemplateClasses(templates_directory);

    templateClasses.forEach(TemplateClass => {

      const templateInstance = new TemplateClass({});

      const generatedTemplates = templateInstance.generateAll();
      

      if (write) templateInstance.writeAllToFileSync();
      console.log(`Generated Templates for ${TemplateClass.name}:`, generatedTemplates);
    });

  }
}

module.exports = TemplateGenerator;
