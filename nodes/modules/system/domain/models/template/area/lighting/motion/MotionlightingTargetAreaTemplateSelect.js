const AreaTemplate = require("../../AreaTemplate");

class MotionLightingTargetAreaTemplateSelect extends AreaTemplate {
  constructor(area_id, {

    area_name = area_id,
    path,
    ...options
    
  } = {}) {

    super(area_id, { 

      // Defaults
      base_path: `/config/.storage/templates/area/lighting/motion/${area_id}/`,
      file_name: `motion_lighting_target_${area_id}_template_select.yaml`,

      // Optional
      area_name,
      path,
      ...options 
      
    });

    this.template = this.build(area_id, { area_name });
    
  }

  build = (area_id = this.area_id, { area_name = this.area_name  }) =>

`template:
  - select:
      - name: "Motion Lighting Target ${area_name}"
        state: "{{ states('input_text.motion_lighting_target_${area_id}') }}"
        options: >
          {{ expand(area_entities("${area_id}"))
          | selectattr('domain', 'eq', 'light')
          | map(attribute='name') | list }}
        select_option:
          - service: input_text.set_value
            target:
              entity_id: input_text.motion_lighting_target_${area_id}
            data:
              value: "{{ option }}"
        availability: "{{ states('input_text.motion_lighting_target_${area_id}') is defined }}"`;

}

module.exports = MotionLightingTargetAreaTemplateSelect;