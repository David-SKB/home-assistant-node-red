const AreaTemplate = require("../../AreaTemplate");

class MotionLightingAutoMaximumTimeoutAreaInputNumber extends AreaTemplate {
  
  constructor(area_id, {

    area_name = area_id,
    path,
    ...options

  } = {}) {

    super(area_id, { 

      // Defaults
      base_path: `/config/.storage/templates/area/motion/lighting/${area_id}/`,
      file_name: `motion_lighting_auto_maximum_timeout_${area_id}_input_number.yaml`,

      // Optional
      area_name,
      path,
      ...options 
      
    });

    this.template = this.build(area_id, { area_name });
    
  }

  build = (area_id = this.area_id, { area_name = this.area_name  }) =>

`input_number:
  motion_lighting_auto_maximum_timeout_${area_id}:
    name: Motion Lighting Auto Maximum Timeout ${area_name}
    initial: 0
    min: 0
    max: 86400
    step: 1
    mode: box
    unit_of_measurement: Seconds
    icon: mdi:timer-settings-outline`;

}

module.exports = MotionLightingAutoMaximumTimeoutAreaInputNumber;