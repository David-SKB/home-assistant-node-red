const pathUtil = require('path');
const Template = require("./Template");
const AreaTemplate = require("./area/AreaTemplate");
const AverageMetricSensor = require("./dynamic/AverageMetricSensor");

class TemplateGenerator {

  templateClasses = [
    Template, 
    AreaTemplate, 
    AverageMetricSensor
  ];

  getTemplateClasses(module) {
    const templateClasses = [];
    
    // Recursively traverse the module
    const traverse = (obj) => {
      for (const key of Object.keys(obj)) {
        const value = obj[key];
        if (typeof value === 'object' && value !== null) {
          traverse(value); // Recursively traverse nested objects
        } else if (this.isTemplateClass(value)) {
          //console.log(`item found: ${key} | ${value}`);
          templateClasses.push(value);
        }
      }
    };

    traverse(module);
    
    return templateClasses;
  }
  
  isTemplateClass(cls) {
    // Check if cls is a function (class) and if it extends any of the specified classes
    return (
      typeof cls === 'function' &&
      this.templateClasses.some(Class => cls.prototype instanceof Class)
    );
  }

  generate(target, { write = false } = {}) {
    let moduleObj;
    if (typeof target === 'string') {
      // If the target is a string, resolve it to an imported module object
      moduleObj = require(pathUtil.resolve(target));
    } else {
      // If the target is already an imported module object, use it directly
      moduleObj = target;
    }

    const templateClasses = this.getTemplateClasses(moduleObj);
    const generatedTemplates = [];

    templateClasses.forEach(TemplateClass => {
      const templateInstance = new TemplateClass({});
      const templates = templateInstance.generateAll();
      generatedTemplates.push(...templates);
      if (write) templateInstance.writeAllToFileSync();
      console.log(`Generated Templates for ${TemplateClass.name}:`, templates);
    });

    return generatedTemplates;
  }

}

module.exports = TemplateGenerator;