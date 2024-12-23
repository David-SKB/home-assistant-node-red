const AreaTemplate = require("../../AreaTemplate");

class MotionLightingAutoContextWindowAreaSensor extends AreaTemplate {
  
  constructor(area_id, {

    area_name = area_id,
    path,
    ...options

  } = {}) {

    super(area_id, { 

      // Defaults
      base_path: `/config/.storage/templates/area/motion/lighting/${area_id}/`,
      file_name: `motion_lighting_auto_context_window_${area_id}_sensor.yaml`,

      // Optional
      area_name,
      path,
      ...options 
      
    });

    this.template = this.build(area_id, { area_name });
    
  }

  build = (area_id = this.area_id, { area_name = this.area_name  }) =>

`
template:
  - sensor:
      - name: "Motion Lighting Auto Context Window ${area_name}"
        unique_id: "motion_lighting_auto_context_window_${area_id}"
        unit_of_measurement: "Seconds"
        state: >
          {{ states('input_number.motion_lighting_auto_context_window_${area_id}') }}
        attributes:
          ms: >
            {% set uom = state_attr('input_number.motion_lighting_auto_context_window_${area_id}', 'unit_of_measurement') %}
            {% set value = states('input_number.motion_lighting_auto_context_window_${area_id}') %}
            
            {% if uom is string and value is string %}

              {% set uom = uom | lower %}
              {% set value = value | float %}
              {% if uom == 'minutes' %}
                {{ value * 60000 }}
              {% elif uom == 'seconds' %}
                {{ value * 1000 }}
              {% elif uom == 'ms' %}
                {{ value }}
              {% else %}
                {{ None }}
              {% endif %}

            {% else %}
              {{ None }}
            {% endif %}
          seconds: >
            {% if this.attributes.ms is defined %}
              {{ (this.attributes.ms | float(0)) / 1000 }}
            {% else %}
              {{ None }}
            {% endif %}
          minutes: >
            {% if this.attributes.ms is defined %}
              {{ (this.attributes.ms | float(0)) / 60000 }}
            {% else %}
              {{ None }}
            {% endif %}
          hours: >
            {% if this.attributes.ms is defined %}
              {{ (this.attributes.ms | float(0)) / 3600000 }}
            {% else %}
              {{ None }}
            {% endif %}
          days: >
            {% if this.attributes.ms is defined %}
              {{ (this.attributes.ms | float(0)) / 86400000 }}
            {% else %}
              {{ None }}
            {% endif %}
`;

}

module.exports = MotionLightingAutoContextWindowAreaSensor;