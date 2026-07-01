const Template = require('../../../../Template');
const AddRemoveInclusionExclusionInputButton = require('./AddRemoveInclusionExclusionInputButton');
const { SelectModes, validateSelectMode } = require('./config');
const InclusionsExclusionsInputText = require('./InclusionsExclusionsInputText');
const InclusionsExclusionsStateInputText = require('./InclusionsExclusionsStateInputText');
const InclusionsExclusionsTemplateSelect = require('./InclusionsExclusionsTemplateSelect');
const UpdateInclusionsExclusionsAutomation = require('./UpdateInclusionsExclusionsAutomation');

class InclusionExclusionSelectTemplate extends Template {
  constructor({

    name,
    unique_id,
    select_mode,
    options_template,

    base_path = `/config/.storage/templates/dynamic/components/inclusion_exclusion_select/${unique_id}/`,
    ...options

  } = {}) {

    const mode = SelectModes[validateSelectMode(select_mode)];

    super({ 

      // Required
      name,
      unique_id,
      select_mode,
      options_template,
      iterable: [
        [
          {
            TemplateClass: AddRemoveInclusionExclusionInputButton,  
            options: {name, unique_id, select_mode},
            base_path,
            file_name: `add_remove_${unique_id}_${mode.primary}_input_button.yaml`
          }
        ],
        [
          {
            TemplateClass: InclusionsExclusionsInputText, 
            options: {name, unique_id, select_mode},
            base_path,
            file_name: `${unique_id}_${mode.primary}s_input_text.yaml`
          }
        ],
        [
          {
            TemplateClass: InclusionsExclusionsStateInputText, 
            options: {name, unique_id, select_mode},
            base_path,
            file_name: `${unique_id}_${mode.primary}s_${mode.secondary}s_state_input_text.yaml`
          }
        ],
        [
          {
            TemplateClass: InclusionsExclusionsTemplateSelect, 
            options: {name, unique_id, select_mode, options_template},
            base_path,
            file_name: `${unique_id}_${mode.primary}s_${mode.secondary}s_template_select.yaml`
          }
        ],
        [
          {
            TemplateClass: UpdateInclusionsExclusionsAutomation, 
            options: {name, unique_id, select_mode},
            base_path,
            file_name: `update_${unique_id}_${mode.primary}s_${mode.secondary}s_automation.yaml`
          }
        ]
      ],

      // Defaults
      base_path,

      // Optional Overrides
      ...options

    });

    //this.template = this.build();

  }

  build = ({

    TemplateClass = this.TemplateClass,
    options,
    base_path = this.base_path,

  } = {}) => {

      options.base_path = options.base_path || base_path;
      const instance = new TemplateClass({...options});
      this.file_name = instance.file_name;
      return instance.build();

    }

}

module.exports = InclusionExclusionSelectTemplate;