const InclusionExclusionSelectTemplate = require("../../../components/ui/config/inclusion_exclusion_select/InclusionExclusionSelectTemplate");

class DoorbellEntityInclusionExclusionSelect extends InclusionExclusionSelectTemplate {
  constructor({ base_path, ...options } = {}) {
    super({

      // Defaults
      name: 'Doorbell Entity',
      unique_id: 'doorbell_entity',
      select_mode: 'INCLUSION',
      options_template: 

`
{% set domain = (states('input_select.doorbell_entity_domain') | default('binary_sensor')) | slugify %}
{{
  states
  | selectattr('domain', 'eq', domain)
  | rejectattr('entity_id', 'in', inclusions)
  | map(attribute="entity_id")
  | list
}}
`,

      // Optional Overrides
      base_path,
      ...options
    });
  }
}

module.exports = DoorbellEntityInclusionExclusionSelect;
