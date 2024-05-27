const jsYaml = require('js-yaml');
const TemplateDirector = require('./TemplateDirector');

function generateMotionLightingAreaTemplates(area_id, options = {}) {
  const {
    area_name = area_id,
    base_path = `/config/.storage/packages/dynamic/motion_lighting/${area_id}/`,
  } = options;

  const director = new TemplateDirector();

  const templates = [

    // Build Mode Selection Helper
    director.buildInputSelect(
      `Motion Lighting Mode ${area_name}`, 
      ["TOGGLE", "DIM", "HYBRID"], 
      {
        initial: "TOGGLE", 
        icon: "mdi:motion-sensor", 
        base_path, 
        file_name: `motion_lighting_mode_${area_id}_input_select.yaml`
      }
    ),

    // Build Timeout Helper
    director.buildInputDatetime(
      `Motion Lighting Timeout ${area_name}`, 
      false, 
      true, 
      { 
        base_path, 
        file_name: `motion_lighting_timeout_${area_id}_input_datetime.yaml`
      }
    ),

    // Build Toggle/Dim Mode Target State Text Template
    director.buildInputText(
      `Motion Lighting Target ${area_name}`, 
      {
        file_name: `motion_lighting_target_${area_id}_input_text.yaml`, 
        object_id: `motion_lighting_target_${area_id}`
      }
    ),

    // Build Hybrid Mode Target State Text Template
    director.buildInputText(
      `Motion Lighting Hybrid Target ${area_name}`, 
      {
        file_name: `motion_lighting_hybrid_target_${area_id}_input_text.yaml`, 
        object_id: `motion_lighting_hybrid_target_${area_id}`
      }
    ),

    // Build Toggle/Dim Mode Entity Selection Template
    director.buildTemplateSelect(
      `Motion Lighting Target ${area_name}`, 
      `"{{ states('input_text.motion_lighting_target_${area_id}') }}"`, 
      `{{expand(area_entities("${area_id}"))
        | selectattr('domain', 'eq', 'light')
        | map(attribute='name') | list }}`, 
      {
        service: "input_text.set_value", 
        target: { 
          entity_id: `input_text.motion_lighting_target_${area_id}` 
        }, 
        data: { 
          value: `"{{ option }}"` 
        }
      }, 
      { 
        availability: `"{{ states('input_text.motion_lighting_target_${area_id}') is defined }}"` 
      }
    ),

    // Build Hybrid Mode Entity Selection Template
    director.buildTemplateSelect(
      `Motion Lighting Hybrid Target ${area_name}`, 
      `"{{ states('input_text.motion_lighting_hybrid_target_${area_id}') }}"`, 
      `{{expand(area_entities("${area_id}"))
        | selectattr('domain', 'eq', 'light')
        | map(attribute='name') | list }}`, 
      {
        service: "input_text.set_value", 
        target: { 
          entity_id: `input_text.motion_lighting_hybrid_target_${area_id}` 
        }, 
        data: { 
          value: `"{{ option }}"` 
        }
      }, 
      { 
        availability: `"{{ states('input_text.motion_lighting_hybrid_target_${area_id}') is defined }}"` 
      }
    )

  ];

  return templates.map(({ path, payload }) => {
    const yamlContent = payload.replace(/\|-/g, '>-').replace(/(state: \>-\n)\s*\n/, '$1');
    return { path, payload: yamlContent };
  });
}

module.exports = generateMotionLightingAreaTemplates;
