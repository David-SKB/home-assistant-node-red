const AreaTemplate = require("../../AreaTemplate");

class AverageMotionDetectionIntervalAreaInputNumber extends AreaTemplate {

  constructor(area_id, {

    area_name = area_id,
    path,
    ...options

  } = {}) {

    super(area_id, { 

      // Defaults
      base_path: `/config/.storage/templates/area/motion/detection/${area_id}/`,
      file_name: `average_motion_detection_interval_${area_id}_input_number.yaml`,

      // Optional
      area_name,
      path,
      ...options 

    });

    this.template = this.build(area_id, { area_name });

  }

  build = (area_id = this.area_id, { area_name = this.area_name }) => 

`input_number:
  average_motion_detection_interval_${area_id}:
    name: Average Motion Detection Interval ${area_name}
    initial: 0
    min: 0
    max: 86400
    step: 1
    mode: box
    unit_of_measurement: Seconds
    icon: mdi:timer-settings-outline`;

}

module.exports = AverageMotionDetectionIntervalAreaInputNumber;