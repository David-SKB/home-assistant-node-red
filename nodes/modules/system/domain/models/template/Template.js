const pathUtil = require('path');
const createFileSync = require('../../../util/file/createFileSync');

class Template {

  constructor({

    base_path = "/config/.storage/templates/",
    file_name = "template.yaml",
    path,
    iterable = [],
    TemplateClass = this.constructor,

    ...options

  }) {

    this.base_path = base_path;
    this.file_name = file_name;
    this.path = path || pathUtil.join(base_path, file_name);
    this.iterable = iterable;
    this.TemplateClass = TemplateClass;

    // Spread additional options onto the instance
    Object.assign(this, options);

  }

  generate() {
    return { path: this.path, payload: this.template };
  }

  writeToFileSync() {
    return createFileSync(this.path, this.template);
  }

  generateAll() {
    return this._generateTemplatesFromIterable(false);
  }

  writeAllToFileSync() {
    return this._generateTemplatesFromIterable(true);
  }

  // Private method to handle generation and optional writing
  _generateTemplatesFromIterable(write = false) {
    if (this.iterable.length === 0) throw new Error("Missing iterable");
    
    return this.iterable.map(iterator => {

      const instance = new this.TemplateClass(...iterator);
      instance.template = instance.build(...iterator);

      // Optionally write to file
      if (write) instance.writeToFileSync();

      return instance.generate();

    });

  }

}

module.exports = Template;