class TemplateSelectBuilder {
  constructor(name, state, options, select_option, additional_options = {}) {
    this.template = {
      template: [
        {
          select: [
            {
              name,
              state,
              options,
              select_option: [
                {
                  service: select_option.service,
                  target: select_option.target,
                  data: select_option.data
                }
              ],
              ...additional_options
            }
          ]
        }
      ]
    };
  }

  build() {
    return this.template;
  }
}

module.exports = TemplateSelectBuilder;
