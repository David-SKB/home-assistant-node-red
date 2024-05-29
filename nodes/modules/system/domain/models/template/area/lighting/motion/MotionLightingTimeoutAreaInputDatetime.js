const AreaTemplate = require("../../AreaTemplate");

class MotionLightingTimeoutAreaInputDatetime extends AreaTemplate {
  
  constructor(area_id, {

    area_name = area_id,
    path,
    ...options

  } = {}) {

    super(area_id, { 

      // Defaults
      base_path: `/config/.storage/templates/area/lighting/motion/${area_id}/`,
      file_name: `motion_lighting_timeout_${area_id}_input_datetime.yaml`,

      // Optional
      area_name,
      path,
      ...options 
      
    });

    this.template = this.build(area_id, { area_name });
    
  }

  build = (area_id = this.area_id, { area_name = this.area_name  }) =>

`input_datetime:
  motion_lighting_timeout_${area_id}:
    name: Motion Lighting Timeout ${area_name}
    has_date: false
    has_time: true`;

}

module.exports = MotionLightingTimeoutAreaInputDatetime;