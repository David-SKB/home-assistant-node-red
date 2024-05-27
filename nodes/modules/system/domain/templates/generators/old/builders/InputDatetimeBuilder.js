class InputDatetimeBuilder {
  constructor(name, has_date, has_time) {
    this.template = {
      input_datetime: {}
    };
    this.template.input_datetime[name] = {
      name,
      has_date,
      has_time
    };
  }

  build() {
    return this.template;
  }
}

module.exports = InputDatetimeBuilder;
