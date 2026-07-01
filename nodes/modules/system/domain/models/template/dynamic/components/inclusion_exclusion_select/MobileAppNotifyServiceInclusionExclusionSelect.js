const InclusionExclusionSelectTemplate = require("../../../components/ui/config/inclusion_exclusion_select/InclusionExclusionSelectTemplate");

class MobileAppNotifyServiceInclusionExclusionSelect extends InclusionExclusionSelectTemplate {
  constructor({ base_path, ...options } = {}) {
    super({

      // Defaults
      name: 'Mobile App Notify Service',
      unique_id: 'mobile_app_notify_service',
      select_mode: 'EXCLUSION',
      options_template: 

`
{% set notify_service_users = state_attr('sensor.mobile_app_notifiers', 'notify_services_users') %}
{% set excluded_users = state_attr('select.user_notify_service_exclusions', 'options') %}
{% set exclusions_list = state_attr('select.mobile_app_notify_service_exclusions', 'options') %}

{% if notify_service_users is not none and excluded_users is not none and exclusions_list is not none %}
  {{
    notify_service_users
    | rejectattr('service', 'in', exclusions_list)
    | rejectattr('user_friendly_name', 'in', excluded_users)
    | map(attribute='service')
    | list
  }}
{% else %}
  []
{% endif %}
`,

      // Optional Overrides
      base_path,
      ...options
    });
  }
}

module.exports = MobileAppNotifyServiceInclusionExclusionSelect;
