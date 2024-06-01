const AreaTemplate = require("../../AreaTemplate");

class MotionLightingTimeoutAreaInputNumber extends AreaTemplate {
  
  constructor(area_id, {

    area_name = area_id,
    path,
    ...options

  } = {}) {

    super(area_id, { 

      // Defaults
      base_path: `/config/.storage/templates/area/motion/lighting/${area_id}/`,
      file_name: `motion_lighting_timeout_${area_id}_input_number.yaml`,

      // Optional
      area_name,
      path,
      ...options 
      
    });

    this.template = this.build(area_id, { area_name });
    
  }

  build = (area_id = this.area_id, { area_name = this.area_name  }) =>

`input_number:
  motion_lighting_timeout_${area_id}:
    name: Motion Lighting Timeout ${area_name}
    initial: 5
    min: 0.25
    max: 60
    step: 0.01
    mode: box
    unit_of_measurement: Minutes
    icon: mdi:timer-settings-outline`;

}

module.exports = MotionLightingTimeoutAreaInputNumber;