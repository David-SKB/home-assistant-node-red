function generateAverageAreaSensor(metric, {
  base_path = "/config/.storage/packages/dynamic/",
  file_name = `average_${metric}_${area_id}_sensor.yaml`,
  path = `${base_path}${file_name}`,
  area_id = "",
  area_name = area_id,
  
  domains = ['sensor'],
  inclusions = [metric],
  exclusions = ['average'],
  metric_title_case = metric.charAt(0).toUpperCase() + metric.slice(1),
  unit_of_measurement = '%'
}) {

  const inclusions_string = inclusions.map(inclusion => `
{% set ${inclusion}_states = all_states
  | selectattr('entity_id', 'contains', '${inclusion}')
  | map(attribute='state')
  | map('float')
  | list %}
{% set combined_states = combined_states + ${inclusion}_states %}`).join('\n');
  
  const exclusions_string = exclusions.map(exclusion => 
    `          | rejectattr('entity_id', 'contains', '${exclusion}')`).join('\n');

  const area_filter = area_id ? 
    `          | selectattr('entity_id', 'in', area_entities('${area_id}'))` : "";

  const payload = 
`template:
- sensor:
    - name: "Average ${metric_title_case} ${area_name}"
      unit_of_measurement: "${unit_of_measurement}"
      state: >-
        {% set domains = ${JSON.stringify(domains)} %}
        {% set combined_states = [] %}
        {% set all_states = states
          | selectattr('domain', 'in', domains)
${area_filter}
          | rejectattr('state', 'eq', 'unavailable')
${exclusions_string}
          | list %}
${inclusions_string}

        {% set unique_states = combined_states | unique | list %}

        {% if unique_states | length > 0 %}
        {% set average_state = unique_states | sum / unique_states | length %}
        {{ average_state | round(1) }}
        {% else %}
        Unavailable
        {% endif %}`;

  return { path, payload };
}

module.exports = generateAverageAreaSensor;
