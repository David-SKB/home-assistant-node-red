const pathUtil = require('path');
const createFileSync = require('../../../util/file/createFileSync');

class Template {

  constructor({
    base_path = "/config/.storage/templates/",
    file_name = "template.yaml",
    path,
    iterable = [],
    TemplateClass = this.constructor,
    // Add the spread operator to pass additional options
    ...options

  }) {

    this.base_path = base_path;
    this.file_name = file_name;
    this.path = path || pathUtil.join(base_path, file_name);
    this.iterable = iterable;
    this.TemplateClass = TemplateClass;
    // Spread the options onto the instance
    Object.assign(this, options);

  }

  generate() {

    return {

      path: this.path,
      payload: this.template

    };

  }

  generateAll() {

    if (this.iterable.length === 0) throw new Error("Missing iterable");
  
    return this.iterable.map(iterator => {

      const instance = new this.TemplateClass( ...iterator );
      instance.template = instance.build(...iterator);
      return instance.generate();

    });
    
  }

  writeToFileSync() {
    return createFileSync(this.path, this.template);
  }

  writeAllToFileSync() {

    if (this.iterable.length === 0) throw new Error("Missing iterable");

    return this.iterable.map(iterator => {

      const instance = new this.TemplateClass({ ...iterator });
      instance.template = instance.build(iterator.area_id, { area_name: iterator.area_name });
      instance.writeToFileSync();
      return instance.generate();

    });

  }

}

module.exports = Template;