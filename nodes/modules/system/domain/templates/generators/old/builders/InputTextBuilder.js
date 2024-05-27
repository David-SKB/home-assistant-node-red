class InputTextBuilder {
  constructor(name) {
    this.template = {
      input_text: {}
    };
    this.template.input_text[name] = {
      name
    };
  }

  build() {
    return this.template;
  }
}

module.exports = InputTextBuilder;
