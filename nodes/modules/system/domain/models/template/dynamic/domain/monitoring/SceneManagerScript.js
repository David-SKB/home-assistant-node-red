const Domains = require("../../../../Domains");
const DomainTemplate = require("../DomainTemplate");

class SceneManagerScript extends DomainTemplate {

  constructor({

    path,
    ...options

  } = {}) {

    super({

      // Defaults
      base_path: "/config/.storage/templates/domain/monitoring/",
      file_name: `scene_manager_script.yaml`,

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
  scene_manager:
    alias: "Scene Manager"
    description: "Script to manage scenes dynamically."
    fields:
      action:
        selector:
          select:
            multiple: false
            options:
              - save
              - restore
        name: Action
        required: true
      scene_id:
        selector:
          text: null
        name: Scene ID
        required: true
      snapshot_entities:
        selector:
          target: null
        name: Snapshot Entities
        required: false
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
          resolved_action: "{{ action | lower }}"
          resolved_scene_id: "{{ scene_id }}"
      - choose:
          - conditions:
              - condition: template
                value_template: "{{ resolved_action == 'save' }}"
            sequence:
              - service: script.convert_target_to_entities
                data:
                  target: "{{ snapshot_entities }}"
                response_variable: resolved_snapshot
              - variables:
                  snapshot_entities: >
                    {{ resolved_snapshot.resolved_entities | default([]) }}
              - choose:
                  - conditions:
                      - condition: template
                        value_template: "{{ snapshot_entities | length == 0 }}"
                    sequence:
                      - service: persistent_notification.create
                        data:
                          message: "No entities were resolved for snapshot."
                          title: "Scene Manager Error"
              - service: scene.create
                data:
                  scene_id: "{{ resolved_scene_id }}"
                  snapshot_entities: "{{ snapshot_entities }}"
          - conditions:
              - condition: template
                value_template: "{{ resolved_action == 'restore' }}"
            sequence:
              - service: scene.turn_on
                target:
                  entity_id: "scene.{{ resolved_scene_id }}"
      - choose:
          - conditions:
              - condition: template
                value_template: "{{ resolved_action not in ['save', 'restore'] }}"
            sequence:
              - service: persistent_notification.create
                data:
                  message: "Invalid action '{{ resolved_action }}'. Use 'save' or 'restore'."
                  title: "Scene Manager Error"
`;

generateDomainList = () => Domains.getDomains().map(domain => 

`              - ${domain}`

).join('\n');

}

module.exports = SceneManagerScript;