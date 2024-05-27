const jsYaml = require('js-yaml');
//const TemplateDirector = require('./TemplateDirector');
//const createFileSync = require('../../../util/file/createFileSync');
const TemplateDirector = require('../builders/TemplateDirector');

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
        intial:"TOGGLE", 
        icon:"mdi:motion-sensor", 
        base_path, 
        file_name:`motion_lighting_timeout_${area_id}_input_datetime.yaml`
      }
    ),

    // Build Timeout Helper
    director.buildInputDatetime(
      `Motion Lighting Timeout ${area_name}`, 
      false, 
      true, 
      { 
        base_path, 
        file_name:`motion_lighting_timeout_${area_id}_input_datetime.yaml`
      }
    ),

    // Build Timeout Helper
    director.buildTemplate(
      {
        input_datetime: {
          motion_lighting_timeout_template:{
            name:`Motion Lighting Timeout ${area_name}`,
            has_date:false,
            has_time:true
          }
        }
      }, 
      `motion_lighting_timeout_${area_id}_input_datetime.yaml` 
    ),

    // (name, options = {object_id = name.toLowerCaseString.trim.replace("_"), file_name=`${object_id}_input_text.yaml`, initial = undefined})
    // Build Toggle/Dim Mode Target State Text Template
    director.buildInputText(
      `Motion Lighting Target ${area_name}`, 
      {
        file_name:`motion_lighting_target_${area_id}_input_text.yaml`, 
        object_id:`motion_lighting_target_${area_id}`
      }
    ),

    // Build Hybrid Mode Target State Text Template
    director.buildInputText(
      `Motion Lighting Hybrid Target ${area_name}`, 
      {
        file_name:`motion_lighting_hybrid_target_${area_id}_input_text.yaml`, 
        object_id:`motion_lighting_hybrid_target_${area_id}`
      }
    ),

    // (name, state, options, select_option, additional_options = {}) where select_option is [{service, target, data}] and target is {entity_id} and data is {value} and additional_options contains {availability}
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
          entity_id:`input_text.motion_lighting_target_${area_id}` 
        }, 
        data: { 
          value:`"{{ option }}"` 
        }
      }, 
      { 
        availability:`"{{ states('input_text.motion_lighting_target_${area_id}') is defined }}"` 
      } 
    ),

    // Build Hybrid Mode Entity Selection Template
    director.buildTemplateSelect(
      `Motion Lighting Hybrid Target ${area_name}`, 
      `"{{ states('input_text.motion_lighting_hybrid_target_${area_id}') }}"`, 
      `
      {{expand(area_entities("${area_id}"))
      | selectattr('domain', 'eq', 'light')
      | map(attribute='name') | list }}
      `, 
      {
        service: "input_text.set_value", 
        target: { 
          entity_id:`input_text.motion_lighting_hybrid_target_${area_id}` 
        }, 
        data: { 
          value:`"{{ option }}"` 
        }
      }, 
      { 
        availability:`"{{ states('input_text.motion_lighting_hybrid_target_${area_id}') is defined }}"` 
      } 
    )

  ];

  // Do this in the builder?, not all templates have a state attribute that can be templated, e.g. input_text only has name and initial value
  // Only template_select options, has that possibility I think
  /*return templates.map(({ file_name, content }) => {
    const path = `${base_path}${file_name}`;
    const yamlContent = jsYaml.dump(content);
    const payload = yamlContent.replace(/\|-/g, '>-').replace(/(state: \>-\n)\s*\n/, '$1');
    return { path, payload };
  });*/

  return templates;

}

// Example usage
// const areas = ['living_room', 'bedroom', 'kitchen'];
// areas.forEach(area => {
//   const motion_templates = generateMotionLightingAreaTemplates(area);
//   motion_templates.forEach(template => {
//     createFileSync(template.path, template.payload);
//     console.log(`Generated Motion templates for ${area}:`, template);
//   });
// });

module.exports = generateMotionLightingAreaTemplates;
