const AreaTemplate = require("../../AreaTemplate");

class MotionLightingModeAreaInputSelect extends AreaTemplate {
  
  constructor(area_id, {

    area_name = area_id,
    path,
    ...options

  } = {}) {

    super(area_id, { 

      // Defaults
      base_path: `/config/.storage/templates/area/lighting/motion/${area_id}/`,
      file_name: `motion_lighting_mode_${area_id}_input_select.yaml`,

      // Optional
      area_name,
      path,
      ...options 
      
    });

    this.template = this.build(area_id, { area_name });

  }

  build = (area_id = this.area_id, { area_name = this.area_name  }) =>

`input_select:
  motion_lighting_mode_${area_id}:
    name: Motion Lighting Mode ${area_name}
    options:
      - TOGGLE
      - DIM
      - HYBRID
    initial: TOGGLE
    icon: mdi:motion-sensor`;

}

module.exports = MotionLightingModeAreaInputSelect;