const AreaTemplate = require("../../AreaTemplate");

class MotionLightingAutoSensetivityAreaInputNumber extends AreaTemplate {
  
  constructor(area_id, {

    area_name = area_id,
    path,
    ...options

  } = {}) {

    super(area_id, { 

      // Defaults
      base_path: `/config/.storage/templates/area/motion/lighting/${area_id}/`,
      file_name: `motion_lighting_auto_sensetivity_${area_id}_input_number.yaml`,

      // Optional
      area_name,
      path,
      ...options 
      
    });

    this.template = this.build(area_id, { area_name });
    
  }

  build = (area_id = this.area_id, { area_name = this.area_name  }) =>

`input_number:
  motion_lighting_auto_sensetivity_${area_id}:
    name: "Motion Lighting Auto Sensitivity ${area_name}"
    min: 0
    max: 100
    step: 1
    unit_of_measurement: "%"
    icon: mdi:access-point
    initial: 50`;

}

module.exports = MotionLightingAutoSensetivityAreaInputNumber;