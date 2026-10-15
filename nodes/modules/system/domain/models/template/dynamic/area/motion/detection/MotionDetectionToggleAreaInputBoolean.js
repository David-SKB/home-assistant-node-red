const AreaTemplate = require("../../AreaTemplate");

class MotionDetectionToggleAreaInputBoolean extends AreaTemplate {

  constructor(area_id, {

    area_name = area_id,
    path,
    ...options

  } = {}) {

    super(area_id, { 

      // Defaults
      base_path: `/config/.storage/templates/area/motion/detection/${area_id}/`,
      file_name: `motion_detection_toggle_${area_id}_input_boolean.yaml`,

      // Optional
      area_name,
      path,
      ...options 

    });

    this.template = this.build(area_id, { area_name });

  }

  build = (area_id = this.area_id, { area_name = this.area_name }) => 

`
input_boolean:
  motion_detection_toggle_${area_id}:
    name: "Motion Detection Toggle ${area_name}"
    icon: mdi:motion-sensor-off
`;

}

module.exports = MotionDetectionToggleAreaInputBoolean;