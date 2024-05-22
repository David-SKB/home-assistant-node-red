const jsYaml = require('js-yaml');

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

  const inclusions_string = inclusions.map(inclusion => `
{% set ${inclusion}_states = all_states
  | selectattr('entity_id', 'contains', '${inclusion}')
  | map(attribute='state')
  | map('float')
  | list %}
{% set combined_states = combined_states + ${inclusion}_states %}`).join('\n');
  
  const exclusions_string = exclusions.map(exclusion => `
  | rejectattr('entity_id', 'contains', '${exclusion}')`).join('\n');

  const stateTemplate = `
{% set domains = ${JSON.stringify(domains)} %}
{% set combined_states = [] %}
{% set all_states = states
  | selectattr('domain', 'in', domains)
  | selectattr('entity_id', 'in', area_entities('${area_id}'))
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

  const path = `${base_path}${file_name}`;

  let payload = {
    "template": [
      {
        "sensor": [
          {
            "name": `Average ${metric_title_case} ${area_name}`,
            "unit_of_measurement": unit_of_measurement,
            "state": stateTemplate.trim()
          }
        ]
      }
    ]
  };

  // Convert the payload to YAML and adjust the format
  let yamlContent = jsYaml.dump(payload);
  payload = yamlContent.replace(/\|-/g, '>-').replace(/(state: \>-\n)\s*\n/, '$1');

  return { path, payload };
}

module.exports = generateAverageAreaSensor;
