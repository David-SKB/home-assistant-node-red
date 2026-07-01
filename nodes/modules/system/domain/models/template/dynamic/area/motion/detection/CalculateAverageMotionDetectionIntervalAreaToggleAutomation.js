const AreaTemplate = require("../../AreaTemplate");

class CalculateAverageMotionDetectionIntervalAreaToggleAutomation extends AreaTemplate {

  constructor(area_id, {

    area_name = area_id,
    path,
    ...options

  } = {}) {

    super(area_id, { 

      // Defaults
      base_path: `/config/.storage/templates/area/motion/detection/${area_id}/`,
      file_name: `calculate_average_motion_detection_interval_${area_id}_toggle_automation.yaml`,

      // Optional
      area_name,
      path,
      ...options 

    });

    this.template = this.build(area_id, { area_name });

  }

  build = (area_id = this.area_id, { area_name = this.area_name }) => 

`automation:
  - id: calculate_average_motion_detection_interval_${area_id}_toggle
    alias: "Calculate Average Motion Detection Interval ${area_name} Toggle"
    trigger:
      - platform: state
        entity_id: input_select.motion_lighting_mode_${area_id}
    condition:
      - condition: template
        value_template: >
          {{ trigger.to_state.state in ['AUTO', 'TOGGLE', 'DIM', 'HYBRID'] }}
    action:
      - choose:
          - conditions:
              - condition: state
                entity_id: input_select.motion_lighting_mode_${area_id}
                state: "AUTO"
            sequence:
              - service: automation.turn_on
                target:
                  entity_id: automation.calculate_average_motion_detection_interval_${area_id}
          - conditions:
              - condition: state
                entity_id: input_select.motion_lighting_mode_${area_id}
                state: "TOGGLE"
            sequence:
              - service: automation.turn_off
                target:
                  entity_id: automation.calculate_average_motion_detection_interval_${area_id}
          - conditions:
              - condition: state
                entity_id: input_select.motion_lighting_mode_${area_id}
                state: "DIM"
            sequence:
              - service: automation.turn_off
                target:
                  entity_id: automation.calculate_average_motion_detection_interval_${area_id}
          - conditions:
              - condition: state
                entity_id: input_select.motion_lighting_mode_${area_id}
                state: "HYBRID"
            sequence:
              - service: automation.turn_off
                target:
                  entity_id: automation.calculate_average_motion_detection_interval_${area_id}`;

}

module.exports = CalculateAverageMotionDetectionIntervalAreaToggleAutomation;