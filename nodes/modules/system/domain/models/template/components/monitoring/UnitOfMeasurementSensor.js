const Template = require('../../Template');

class UnitOfMeasurementSensor extends Template {
  constructor({

    name,
    unique_id,
    unit_of_measurement,
    entity_id,
    
    path,
    ...options

  } = {}) {

    super({ 

      // Required
      name,
      unique_id,
      unit_of_measurement,
      entity_id,

      // Defaults
      base_path: "/config/.storage/templates/components/monitoring/",
      file_name: unique_id ? `${unique_id}_sensor.yaml` : `unit_of_measurement_sensor.yaml`,

      // Optional Overrides
      path,
      ...options

    });

    this.template = this.build();

  }

  build = ({
    
      name = this.name,
      unique_id = this.unique_id, 
      unit_of_measurement = this.unit_of_measurement, 
      entity_id = this.entity_id

    } = {}) => 

`
template:
  - sensor:
      - name: "${name}"
        unique_id: ${unique_id}
        unit_of_measurement: "${unit_of_measurement}"
        state: >
          {{ state_attr('sensor.${unique_id}', '${unit_of_measurement}') }}
        attributes:
          ms: >
            {% set uom = state_attr('${entity_id}', 'unit_of_measurement') %}
            {% set value = states('${entity_id}') %}

            {% if uom is string and value is string %}

              {% set uom = uom | lower %}
              {% set value = value | default(0) | float(0) %}
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
              {{ (this.attributes.ms | default(0) | float(0)) / 1000 }}
            {% else %}
              {{ None }}
            {% endif %}
          minutes: >
            {% if this.attributes.ms is defined %}
              {{ (this.attributes.ms | default(0) | float(0)) / 60000 }}
            {% else %}
              {{ None }}
            {% endif %}
          hours: >
            {% if this.attributes.ms is defined %}
              {{ (this.attributes.ms | default(0) | float(0)) / 3600000 }}
            {% else %}
              {{ None }}
            {% endif %}
          days: >
            {% if this.attributes.ms is defined %}
              {{ (this.attributes.ms | default(0) | float(0)) / 86400000 }}
            {% else %}
              {{ None }}
            {% endif %}
`;

}

module.exports = UnitOfMeasurementSensor;