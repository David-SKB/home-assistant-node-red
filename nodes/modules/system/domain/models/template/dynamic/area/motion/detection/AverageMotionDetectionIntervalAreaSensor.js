const AreaTemplate = require("../../AreaTemplate");

class AverageMotionDetectionIntervalAreaSensor extends AreaTemplate {

  constructor(area_id, {

    area_name = area_id,
    path,
    ...options

  } = {}) {

    super(area_id, { 

      // Defaults
      base_path: `/config/.storage/templates/area/motion/detection/${area_id}/`,
      file_name: `average_motion_detection_interval_${area_id}_sensor.yaml`,

      // Optional
      area_name,
      path,
      ...options 

    });

    this.template = this.build(area_id, { area_name });

  }

  build = (area_id = this.area_id, { area_name = this.area_name }) => 

`template:
  - sensor:
      - name: "Average Motion Detection Interval ${area_name}"
        unique_id: "average_motion_detection_interval_${area_id}"
        unit_of_measurement: "Seconds"
        state: >
          {{ states('input_number.average_motion_detection_interval_${area_id}') }}
        attributes:
          ms: >
            {% set uom = state_attr('input_number.average_motion_detection_interval_${area_id}', 'unit_of_measurement') | lower %}
            {% set value = states('input_number.average_motion_detection_interval_${area_id}') | float %}
            {% if uom == 'minutes' %}
              {{ value * 60000 }}
            {% elif uom == 'seconds' %}
              {{ value * 1000 }}
            {% elif uom == 'ms' %}
              {{ value }}
            {% else %}
              0
            {% endif %}

          seconds: >
            {% set ms = this.attributes.ms | float %}
            {{ ms / 1000 }}

          minutes: >
            {% set ms = this.attributes.ms | float %}
            {{ ms / 60000 }}

          hours: >
            {% set ms = this.attributes.ms | float %}
            {{ ms / 3600000 }}

          days: >
            {% set ms = this.attributes.ms | float %}
            {{ ms / 86400000 }}`;

}

module.exports = AverageMotionDetectionIntervalAreaSensor;