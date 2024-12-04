const AreaTemplate = require("../../AreaTemplate");

class MotionLightingAutoMaximumTimeoutAreaSensor extends AreaTemplate {
  
  constructor(area_id, {

    area_name = area_id,
    path,
    ...options

  } = {}) {

    super(area_id, { 

      // Defaults
      base_path: `/config/.storage/templates/area/motion/lighting/${area_id}/`,
      file_name: `motion_lighting_auto_maximum_timeout_${area_id}_sensor.yaml`,

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
      - name: "Motion Lighting Auto Maximum Timeout ${area_name}"
        unique_id: "motion_lighting_auto_maximum_timeout_${area_id}"
        unit_of_measurement: "Seconds"
        state: >
          {{ state_attr('sensor.motion_lighting_auto_maximum_timeout_${area_id}', 'minutes') }}
        attributes:
          ms: >
            {% set uom = state_attr('input_number.motion_lighting_auto_maximum_timeout_${area_id}', 'unit_of_measurement') | lower %}
            {% set value = states('input_number.motion_lighting_auto_maximum_timeout_${area_id}') | float %}
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
            {% set ms = state_attr('sensor.motion_lighting_auto_maximum_timeout_${area_id}', 'ms') | float %}
            {{ ms / 1000 }}

          minutes: >
            {% set ms = state_attr('sensor.motion_lighting_auto_maximum_timeout_${area_id}', 'ms') | float %}
            {{ ms / 60000 }}

          hours: >
            {% set ms = state_attr('sensor.motion_lighting_auto_maximum_timeout_${area_id}', 'ms') | float %}
            {{ ms / 3600000 }}

          days: >
            {% set ms = state_attr('sensor.motion_lighting_auto_maximum_timeout_${area_id}', 'ms') | float %}
            {{ ms / 86400000 }}`;

}

module.exports = MotionLightingAutoMaximumTimeoutAreaSensor;