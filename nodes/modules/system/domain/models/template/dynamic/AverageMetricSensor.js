const Areas = require('../../Areas');
const Template = require('../Template');

class AverageMetricSensor extends Template {
  constructor(metric, {
    
    unit_of_measurement = '%',
    area_id,
    area_name = area_id,
    path,
    ...options

  } = {}) {

    super({ 

      // Required
      metric,

      // Defaults
      base_path: "/config/.storage/templates/" + (area_id ? `area/${area_id}/` : ""),
      file_name: area_id ? `average_${metric}_${area_id}_sensor.yaml` : `average_${metric}_sensor.yaml`,
      domains: ['sensor'],
      inclusions: [metric],
      exclusions: ['average'],
      iterable: Areas.getAreaRegistry().map(area => (
        [ metric, { area_id: area.id, area_name: area.name } ]
      )),

      // Optional Overrides
      unit_of_measurement,
      area_id,
      area_name,
      path,
      ...options

    });

    this.template = this.build();

  }

  build = (
    
    metric = this.metric, {

      area_id = this.area_id, 
      area_name = this.area_name, 
      unit_of_measurement = this.unit_of_measurement, 
      domains = this.domains, 
      inclusions = this.inclusions, 
      exclusions = this.exclusions

    } = {}) => 

`template:
- sensor:
    - name: Average ${this.metricTitleCase(metric)} ${this.areaName(area_name)}
      unit_of_measurement: '${unit_of_measurement}'
      state: >-
        {% set domains = ${JSON.stringify(domains)} %}
        {% set combined_states = [] %}
        {% set all_states = states
          | selectattr('domain', 'in', domains)
${this.areaFilter(area_id)}
          | rejectattr('state', 'eq', 'unavailable')
${this.exclusionsFilter(exclusions)}
          | list %}
${this.inclusionsFilter(inclusions)}

        {% set unique_states = combined_states | unique | list %}

        {% if unique_states | length > 0 %}
        {% set average_state = unique_states | sum / unique_states | length %}
        {{ average_state | round(1) }}
        {% else %}
        Unavailable
        {% endif %}`;

// Utility Functions

  metricTitleCase = (metric) => metric.charAt(0).toUpperCase() + metric.slice(1)

  areaName = (area_name) => area_name ? area_name : "";

  areaFilter = (area_id) => area_id ? 
`          | selectattr('entity_id', 'in', area_entities('${area_id}'))` : "";

  exclusionsFilter = (exclusions) => exclusions.map(exclusion => 
`          | rejectattr('entity_id', 'contains', '${exclusion}')`).join('\n');

  inclusionsFilter = (inclusions) => inclusions.map(inclusion => 
`
        {% set ${inclusion}_states = all_states
          | selectattr('entity_id', 'contains', '${inclusion}')
          | map(attribute='state')
          | map('float')
          | list %}
        {% set combined_states = combined_states + ${inclusion}_states %}`).join('\n');

}

module.exports = AverageMetricSensor;