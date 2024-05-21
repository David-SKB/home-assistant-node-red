function generateAverageAreaSensor(area_id, metric, options = {}) {

  const {
    area_name = area_id,
    base_path = "/config/.storage/generated_templates/dynamic/",
    file_name = `average_${metric}_${area_id}_sensor.yaml`,
    domains = ['sensor'],
    inclusions = [metric],
    exclusions = ['average'],
    metric_title_case = metric.charAt(0).toUpperCase() + metric.slice(1),
    unit_of_measurement = '%'
  } = options;

  const inclusions_string = inclusions.map(inclusion => `      | selectattr('entity_id', 'contains', '${inclusion}')`).join('\n');
  const exclusions_string = exclusions.map(exclusion => `      | rejectattr('entity_id', 'contains', '${exclusion}')`).join('\n');

  const stateTemplate = `
    {% set domains = ${JSON.stringify(domains)} %}
    {% set area_entities_list = area_entities('${area_id}') %}
    {% set temps = states
      | selectattr('domain', 'in', domains)
${inclusions_string}
      | selectattr('entity_id', 'in', area_entities_list)
${exclusions_string}
      | reject('none')
      | rejectattr('state', 'eq', 'unavailable')
      | map(attribute='state')
      | map('float')
      | list %}
    {% if temps | length > 0 %}
      {% set average_temp = temps | sum / temps | length %}
      {{ average_temp | round(1) }}
    {% else %}
      Unavailable
    {% endif %}
  `;

  const path = `${base_path}${file_name}`;

  const payload = {
    "template": [
      {
        "sensor": [
          {
            "name": `Average ${metric_title_case} ${area_name}`,
            "unit_of_measurement": unit_of_measurement,
            "state": stateTemplate
          }
        ]
      }
    ]
  };

  return { path, payload };
}

module.exports = generateAverageAreaSensor;