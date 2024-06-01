const AreaTemplate = require("../../AreaTemplate");

class MotionDetectionToggleAreaSwitch extends AreaTemplate {

  constructor(area_id, {

    area_name = area_id,
    path,
    ...options

  } = {}) {

    super(area_id, { 

      // Defaults
      base_path: `/config/.storage/templates/area/motion/detection/${area_id}/`,
      file_name: `motion_detection_toggle_${area_id}_switch.yaml`,

      // Optional
      area_name,
      path,
      ...options 

    });

    this.template = this.build(area_id, { area_name });

  }

  build = (area_id = this.area_id, { area_name = this.area_name }) => 

`switch:
  - platform: template
    switches:
      motion_detection_toggle_${area_id}:
        unique_id: "motion_detection_toggle_${area_id}"
        friendly_name: "Motion Detection Toggle ${area_name}"
        turn_on:
          - service: switch.turn_on
            entity_id: switch.motion_detection_toggle_${area_id}
        turn_off:
          - service: switch.turn_off
            entity_id: switch.motion_detection_toggle_${area_id}
        icon_template: >
          {% if is_state('switch.motion_detection_toggle_${area_id}', 'on') %}
            mdi:motion-sensor
          {% else %}
            mdi:motion-sensor-off
          {% endif %}`;

}

module.exports = MotionDetectionToggleAreaSwitch;