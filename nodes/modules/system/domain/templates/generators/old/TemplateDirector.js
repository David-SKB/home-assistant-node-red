const InputSelectBuilder = require('./InputSelectBuilder');
const InputDatetimeBuilder = require('./InputDatetimeBuilder');
const TemplateSelectBuilder = require('./TemplateSelectBuilder');
const InputTextBuilder = require('./InputTextBuilder');

class TemplateDirector {
  constructor(area) {
    this.area = area;
    this.templates = {};
  }

  buildInputSelect() {
    const builder = new InputSelectBuilder()
      .setName('Motion Lighting Mode Template')
      .setOptions(['TOGGLE', 'DIM', 'HYBRID'])
      .setInitial('TOGGLE')
      .setIcon('mdi:motion-sensor');
    this.templates.input_select = { motion_lighting_mode_template: builder.build() };
  }

  buildInputDatetime() {
    const builder = new InputDatetimeBuilder()
      .setName('Motion Lighting Timeout Template')
      .setHasDate(false)
      .setHasTime(true);
    this.templates.input_datetime = { motion_lighting_timeout_template: builder.build() };
  }

  buildTemplates() {
    const TemplateSelectBuilder = new TemplateSelectBuilder();

    TemplateSelectBuilder.addSelect(
      'Motion Lighting Target Template',
      "{{ states('input_text.motion_lighting_target_template') }}",
      `{{expand(area_entities("${this.area}"))
        | selectattr('domain', 'eq', 'light')
        | map(attribute='name') | list }}`,
      'input_text.set_value',
      "{{ states('input_text.motion_lighting_target_template') is defined }}"
    );

    TemplateSelectBuilder.addSelect(
      'Motion Lighting Hybrid Target Template',
      "{{ states('input_text.motion_lighting_hybrid_target_template') }}",
      `{{expand(area_entities("${this.area}"))
        | selectattr('domain', 'eq', 'light')
        | map(attribute='name') | list }}`,
      'input_text.set_value',
      "{{ states('input_text.motion_lighting_hybrid_target_template') is defined }}"
    );

    this.templates.template = TemplateSelectBuilder.build().template;
  }

  buildInputText() {
    const builder = new InputTextBuilder()
      .setName('Motion Lighting Target Template');
    this.templates.input_text = { motion_lighting_target_template: builder.build() };

    const hybridBuilder = new InputTextBuilder()
      .setName('Motion Lighting Hybrid Target Template');
    this.templates.input_text.motion_lighting_hybrid_target_template = hybridBuilder.build();
  }

  build() {
    this.buildInputSelect();
    this.buildInputDatetime();
    this.buildTemplates();
    this.buildInputText();
    return this.templates;
  }
}

module.exports = TemplateDirector;

{
  input_datetime: {
    motion_lighting_timeout_template:{
      name:"Motion Lighting Timeout Template",
      has_date:false,
      has_time:true
    }
  }
}
