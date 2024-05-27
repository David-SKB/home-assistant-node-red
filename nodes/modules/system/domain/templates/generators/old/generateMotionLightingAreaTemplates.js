const TemplateDirector = require('../../../models/TemplateDirector');

function generateMotionLightingAreaTemplates(area_id, options = {}) {
  const {
    area_name = area_id,
    base_path = `/config/.storage/packages/dynamic/motion_lighting/${area_id}/`,
  } = options;

  const director = new TemplateDirector();

  const templates = [
    // Build Mode Selection Helper
    director.buildTemplate(
`input_select:
motion_lighting_mode_${area_id}:
  name: Motion Lighting Mode ${area_name}
  options:
    - TOGGLE
    - DIM
    - HYBRID
  initial: TOGGLE
  icon: mdi:motion-sensor`
      ,
      `motion_lighting_mode_${area_id}_input_select.yaml`,
      base_path
    ),

    // Build Timeout Helper
    director.buildTemplate(
`input_datetime:
  motion_lighting_timeout_${area_id}:
    name:  Motion Lighting Timeout ${area_name}
    has_date: false
    has_time: true`
      ,
      `motion_lighting_timeout_${area_id}_input_datetime.yaml`,
      base_path
    ),

    // Build Toggle/Dim Mode Target State Text Template
    director.buildTemplate(
      `input_text:
        motion_lighting_target_${area_id}:
          name: Motion Lighting Target ${area_name}`
      ,
      `motion_lighting_target_${area_id}_input_text.yaml`,
      base_path
    ),

    // Build Hybrid Mode Target State Text Template
    director.buildTemplate(
`input_text:
  motion_lighting_hybrid_target_${area_id}:
    name: Motion Lighting Hybrid Target ${area_name}`
      ,
      `motion_lighting_hybrid_target_${area_id}_input_text.yaml`,
      base_path
    ),
    // Build Toggle/Dim Mode Entity Selection Template
    director.buildTemplate(
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
        availability: "{{ states('input_text.motion_lighting_target_${area_id}') is defined }}"`
      ,
      `motion_lighting_target_${area_id}_template_select.yaml`,
      base_path
    ),

    // Build Hybrid Mode Entity Selection Template
    director.buildTemplate(
`template:
  - select:
      - name: "Motion Lighting Hybrid Target ${area_name}"
        state: "{{ states('input_text.motion_lighting_hybrid_target_${area_id}') }}"
        options: >
          {{ expand(area_entities("${area_id}"))
          | selectattr('domain', 'eq', 'light')
          | map(attribute='name') | list }}
        select_option:
          - service: input_text.set_value
            target:
              entity_id: input_text.motion_lighting_hybrid_target_${area_id}
            data:
              value: "{{ option }}"
        availability: "{{ states('input_text.motion_lighting_hybrid_target_${area_id}') is defined }}"`
      ,
      `motion_lighting_hybrid_target_${area_id}_template_select.yaml`,
      base_path
    )
  ];

  return templates;
}

module.exports = generateMotionLightingAreaTemplates;
