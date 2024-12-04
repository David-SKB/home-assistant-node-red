const AreaTemplate = require("../../AreaTemplate");

class CalculateAverageMotionDetectionIntervalAreaAutomation extends AreaTemplate {

  constructor(area_id, {

    area_name = area_id,
    path,
    ...options

  } = {}) {

    super(area_id, { 

      // Defaults
      base_path: `/config/.storage/templates/area/motion/detection/${area_id}/`,
      file_name: `calculate_average_motion_detection_interval_${area_id}_automation.yaml`,

      // Optional
      area_name,
      path,
      ...options 

    });

    this.template = this.build(area_id, { area_name });

  }

  build = (area_id = this.area_id, { area_name = this.area_name }) => 

`automation:
  - id: calculate_average_motion_detection_interval_${area_id}
    alias: "Calculate Average Motion Detection Interval ${area_name}"
    trigger:
      - platform: state
        entity_id: binary_sensor.motion_detectors_${area_id}
        to: "on"
      - platform: state
        entity_id: binary_sensor.motion_detectors_${area_id}
        to: "off"
    action:
      - service: rest_command.fetch_motion_history
        data:
          timestamp: "{{ (now() - timedelta(minutes=state_attr('sensor.motion_lighting_auto_context_window_${area_id}', 'minutes'))).isoformat() }}"
          entity_id: "binary_sensor.motion_detectors_${area_id}"
        response_variable: motion_history
      - variables:
          motion_history_content: "{{ motion_history.content[0] if motion_history_content is not none else [] }}"
          motion_states: >
            {% set raw_states = motion_history_content %}
            {% set on_states = raw_states
              | selectattr('state', 'eq', 'on')
              | list %}
            {% set motion_times = on_states 
              | map(attribute='last_changed') 
              | map('as_datetime') 
              | map('as_timestamp')
              | list %}
            {{ motion_times }}
          intervals: >
            {% set ns = namespace(intervals=[]) %}
            {% for i in range(1, motion_states | length) %}
              {% set prev = motion_states[i-1] %}
              {% set curr = motion_states[i] %}
              {% set ns.intervals = ns.intervals + [(curr | float) - (prev | float)] %}
            {% endfor %}
            {{ ns.intervals }}
          motion_durations: >
            {% set raw_states = motion_history_content %}
            {% set ns = namespace(motion_durations=[]) %}
            {% for i in range(1, raw_states | length) %}
              {% set current_state = raw_states[i] %}
              {% set prev_state = raw_states[i-1] %}
              {% if current_state.state == 'off' and prev_state.state == 'on' %}
                {% set duration = (current_state.last_changed | as_datetime) - (prev_state.last_changed | as_datetime) %}
                {% set ns.motion_durations = ns.motion_durations + [duration.total_seconds()] %}
              {% endif %}
            {% endfor %}
            {{ ns.motion_durations }}
          avg_interval: >
            {{ (intervals | sum / intervals | length) | round(2) if intervals | length > 0 else 0 }}
          min_timeout: >
            {% set min_timeout_helper = state_attr('sensor.motion_lighting_auto_minimum_timeout_${area_id}', 'seconds') | float | default(0) %}
            {% set min_timeout_value = min_timeout_helper if min_timeout_helper > 0 else state_attr('sensor.occupancy_timeout', 'seconds') | float | default(300) %}
            {% if intervals | length > 0 %}
              {% set current_min = intervals | min | float %}
              {{ [current_min, min_timeout_value] | min }}
            {% else %}
              {{ min_timeout_value }}
            {% endif %}
          max_timeout: >
            {{ state_attr('sensor.occupancy_timeout', 'seconds') | float }}
          avg_duration: >
            {% if motion_durations | length > 0 %}
              {{ (motion_durations | sum) / motion_durations | length | round(2) }}
            {% else %}
              0
            {% endif %}
          context_window: >
            {% set avg_duration = state_attr('sensor.average_motion_detection_duration_${area_id}', 'seconds') | float(0) %}
            {% set avg_interval = state_attr('sensor.average_motion_detection_interval_${area_id}', 'seconds') | float(0) %}
            {% set min_window = 300 %}
            {% set max_window = 3600 %}
            {% set window_range = (max_window - min_window) %}
            {% set normalized_duration = (avg_duration / window_range) if window_range > 0 else 0 %}
            {% set normalized_duration = normalized_duration if normalized_duration < 1 else 1 %}
            {% set scaled_addition = normalized_duration * window_range %}
            {% set final_window = min_window + scaled_addition %}
            {{ final_window if final_window < max_window else max_window }}
      - service: input_number.set_value
        data:
          entity_id: input_number.average_motion_detection_interval_${area_id}
          value: "{{ avg_interval }}"
      - service: input_number.set_value
        data:
          entity_id: input_number.motion_lighting_auto_minimum_timeout_${area_id}
          value: "{{ min_timeout }}"
      - service: input_number.set_value
        data:
          entity_id: input_number.motion_lighting_auto_maximum_timeout_${area_id}
          value: "{{ max_timeout }}"
      - service: input_number.set_value
        data:
          entity_id: input_number.average_motion_detection_duration_${area_id}
          value: "{{ avg_duration }}"
      - service: input_number.set_value
        data:
          entity_id: input_number.motion_lighting_auto_context_window_${area_id}
          value: "{{ context_window }}"`;

}

module.exports = CalculateAverageMotionDetectionIntervalAreaAutomation;