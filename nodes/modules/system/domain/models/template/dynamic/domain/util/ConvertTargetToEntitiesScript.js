const Domains = require("../../../../Domains");
const DomainTemplate = require("../DomainTemplate");

class ConvertTargetToEntitiesScript extends DomainTemplate {

  constructor({

    path,
    ...options

  } = {}) {

    super({

      // Defaults
      base_path: "/config/.storage/templates/domain/util/",
      file_name: `convert_target_to_entities_script.yaml`,

      // Optional Overrides
      path,
      ...options
    });

    this.template = this.build();

    // Override iterator based generation 
    this.writeAllToFileSync = this.writeToFileSync;
    this.generateAll = () => [this.generate()];

  }

  build = () => 

`
script:
  convert_target_to_entities:
    alias: "Convert Target to Entities"
    description: >
      Converts target selector output to a list of entity_ids, resolving areas,
      devices, and labels.
    fields:
      target:
        selector:
          target: null
        name: Target
        description: The target selector output to be converted.
        required: true
      domains:
        selector:
          select:
            multiple: true
            options:
${this.generateDomainList()}
        name: Domains
        required: false
    sequence:
      - variables:
          resolved_entities: >
            {% if target is defined %}
              {% set ns = namespace(entities=[], filtered_entities=[]) %}

              {# Resolve entity_id directly #}
              {% if target.entity_id is defined and target.entity_id is not none %}
                {% set entity_list = target.entity_id 
                  if target.entity_id is iterable 
                  and target.entity_id is not string 
                  else [target.entity_id] 
                %}
                {% set ns.entities = ns.entities + entity_list %}
              {% endif %}

              {# Resolve area_id to entities #}
              {% if target.area_id is defined and target.area_id is not none %}
                {% set area_list = target.area_id 
                  if target.area_id is iterable 
                  and target.area_id is not string 
                  else [target.area_id] 
                %}
                {% for area in area_list %}
                  {% set area_entities = area_entities(area) %}
                  {% set ns.entities = ns.entities + area_entities %}
                {% endfor %}
              {% endif %}

              {# Resolve device_id to entities #}
              {% if target.device_id is defined and target.device_id is not none %}
                {% set device_list = target.device_id 
                  if target.device_id is iterable 
                  and target.device_id is not string 
                  else [target.device_id] 
                %}
                {% for device in device_list %}
                  {% set device_entities = device_entities(device) %}
                  {% set ns.entities = ns.entities + device_entities %}
                {% endfor %}
              {% endif %}

              {# Resolve label_id to entities #}
              {% if target.label_id is defined and target.label_id is not none %}
                {% set label_list = target.label_id 
                  if target.label_id is iterable 
                  and target.label_id is not string 
                  else [target.label_id] 
                %}
                {% for label in label_list %}
                  {% set label_entities = label_entities(label) %}
                  {% set ns.entities = ns.entities + label_entities %}
                {% endfor %}
              {% endif %}

              {# Deduplicate entities #}
              {% set filtered_entities = ns.entities | unique | list %}

              {# Apply domain filtering if domains are provided #}
              {% if domains is defined and domains | length > 0 %}
                {% set ns.entities = [] %}
                {% for domain in domains %}
                  {% set domain_entities = filtered_entities | select('match', domain ~ "\\.") | list %}
                  {% set ns.filtered_entities = ns.filtered_entities + domain_entities %}
                {% endfor %}
              {% else %}
                {% set ns.filtered_entities = ns.entities %}
              {% endif %}

              {{ ns.filtered_entities }}
            {% else %}
              []
            {% endif %}
          response_data:
            resolved_entities: "{{ resolved_entities }}"
      - stop: End
        response_variable: response_data
    mode: parallel
`;

generateDomainList = () => Domains.getDomains().map(domain => 

`              - ${domain}`

).join('\n');

}

module.exports = ConvertTargetToEntitiesScript;