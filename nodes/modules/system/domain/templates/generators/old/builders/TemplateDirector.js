const jsYaml = require('js-yaml');
const InputSelectBuilder = require('./InputSelectBuilder');
const InputDatetimeBuilder = require('./InputDatetimeBuilder');
const TemplateSelectBuilder = require('./TemplateSelectBuilder');
const InputTextBuilder = require('./InputTextBuilder');

class TemplateDirector {
  buildInputSelect(name, options, { initial = 'TOGGLE', icon = 'mdi:motion-sensor', base_path, file_name }) {
    const builder = new InputSelectBuilder(name, options, initial, icon);
    const path = `${base_path}${file_name}`;
    const payload = jsYaml.dump(builder.build());
    return { path, payload };
  }

  buildInputDatetime(name, has_date, has_time, { base_path, file_name }) {
    const builder = new InputDatetimeBuilder(name, has_date, has_time);
    const path = `${base_path}${file_name}`;
    const payload = jsYaml.dump(builder.build());
    return { path, payload };
  }

  buildTemplateSelect(name, state, options, select_option, additional_options = {}) {
    const builder = new TemplateSelectBuilder(name, state, options, select_option, additional_options);
    const path = `${base_path}${file_name}`;
    const payload = jsYaml.dump(builder.build());
    return { path, payload };
  }

  buildInputText(name, { base_path, file_name, object_id = name.toLowerCase().replace(/ /g, '_') }) {
    const builder = new InputTextBuilder(name);
    const path = `${base_path}${file_name}`;
    const payload = jsYaml.dump(builder.build());
    return { path, payload };
  }
}

module.exports = TemplateDirector;
