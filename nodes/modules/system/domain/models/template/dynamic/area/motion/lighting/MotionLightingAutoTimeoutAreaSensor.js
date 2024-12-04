const AreaTemplate = require("../../AreaTemplate");

class MotionLightingAutoTimeoutAreaSensor extends AreaTemplate {
  
  constructor(area_id, {

    area_name = area_id,
    path,
    ...options

  } = {}) {

    super(area_id, { 

      // Defaults
      base_path: `/config/.storage/templates/area/motion/lighting/${area_id}/`,
      file_name: `motion_lighting_auto_timeout_${area_id}_sensor.yaml`,

      // Optional
      area_name,
      path,
      ...options 
      
    });

    this.template = this.build(area_id, { area_name });
    
  }

  build = (area_id = this.area_id, { area_name = this.area_name  }) =>

`template:
  - sensor:
      - name: "Motion Lighting Auto Timeout ${area_name}"
        unique_id: "motion_lighting_auto_timeout_${area_id}"
        unit_of_measurement: "Seconds"
        state: >
          {% set sensitivity = state_attr('sensor.motion_lighting_auto_timeout_${area_id}', 'sensitivity') | float(0) %}
          {% set avg_interval = state_attr('sensor.motion_lighting_auto_timeout_${area_id}', 'avg_interval') | float(0) %}
          {% set min_timeout = state_attr('sensor.motion_lighting_auto_timeout_${area_id}', 'min_timeout') | float(0) %}
          {% set max_timeout = state_attr('sensor.motion_lighting_auto_timeout_${area_id}', 'max_timeout') | float(0) %}

          {% set timeout_value = avg_interval * (sensitivity | float / 100) %}

          {% set final_timeout = timeout_value if timeout_value > min_timeout else min_timeout %}
          {% set final_timeout = final_timeout if final_timeout < max_timeout else max_timeout %}

          {{ final_timeout | round(0) }}

        attributes:
          sensitivity: "{{ states('input_number.motion_lighting_auto_sensetivity_${area_id}') | float(0) }}"
          avg_interval: "{{ state_attr('sensor.average_motion_detection_interval_${area_id}', 'seconds') | float(0) }}"
          avg_duration: "{{ state_attr('sensor.average_motion_detection_duration_${area_id}', 'seconds') | float }}"
          min_timeout: "{{ state_attr('sensor.motion_lighting_auto_minimum_timeout_${area_id}', 'seconds') | float(0) }}"
          max_timeout: "{{ state_attr('sensor.motion_lighting_auto_maximum_timeout_${area_id}', 'seconds') | float(0) }}"`;

}

module.exports = MotionLightingAutoTimeoutAreaSensor;