class InputSelectBuilder {
  constructor(name, options, initial, icon) {
    this.template = {
      input_select: {}
    };
    this.template.input_select[name] = {
      name,
      options,
      initial,
      icon
    };
  }

  build() {
    return this.template;
  }
}

module.exports = InputSelectBuilder;
