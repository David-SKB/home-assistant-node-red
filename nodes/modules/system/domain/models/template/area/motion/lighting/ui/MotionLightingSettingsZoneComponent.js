const Areas = require("../../../../../Areas");
const AreaTemplate = require("../../../AreaTemplate");


class MotionLightingSettingsZoneComponent extends AreaTemplate {

  constructor(area_id, { 

    area_name = area_id, 
    path, 
    ...options 

  } = {}) {

    super(area_id, {

      // Required
      area_name,

      // Defaults
      base_path: "/config/.storage/templates/area/motion/lighting/ui/",
      file_name: `motion_lighting_settings_zone_component.yaml`,

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

`square: true
type: grid
cards:
  - type: conditional
    conditions:
      - condition: state
        entity: input_boolean.motion_lighting_settings_toggle_ui
        state: 'on'
    card:
      square: true
      type: grid
      cards:
${this.generateAreaCards()}
      columns: 1
columns: 1`;

  generateAreaCards = () => Areas.getAreaRegistry().map(area  => 

`        - type: conditional
          conditions:
            - condition: state
              entity: input_text.motion_lighting_settings_area_ui_state
              state: ${area.name}
          card:
            type: entities
            entities:
              - entity: select.motion_lighting_settings_area_ui
              - entity: input_select.motion_lighting_mode_${area.id}
              - entity: select.motion_lighting_target_${area.id}
              - entity: select.motion_lighting_hybrid_target_${area.id}
              - entity: input_number.motion_lighting_timeout_${area.id}
                secondary_info: none
                name: Timeout
            title: Motion Lighting - ${area.name}
            show_header_toggle: true`

  ).join('\n');

}

module.exports = MotionLightingSettingsZoneComponent;