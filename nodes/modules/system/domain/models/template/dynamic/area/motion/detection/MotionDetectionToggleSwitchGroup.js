const Areas = require("../../../../../Areas");
const AreaTemplate = require("../../AreaTemplate");

class MotionDetectionToggleSwitchGroup extends AreaTemplate {

  constructor(area_id, { ...options } = {}) {

    super(area_id, { 

      // Defaults
      base_path: `/config/.storage/templates/area/motion/detection/`,
      file_name: `motion_detection_toggle_switch_group.yaml`,

      // Optional
      ...options 

    });

    this.template = this.build();

    // Override iterator based generation 
    this.writeAllToFileSync = this.writeToFileSync;
    this.generateAll = () => [this.generate()];

  }

  build = () => 

`switch:
  - platform: group
    name: "Motion Detection Toggle"
    unique_id: "motion_detection_toggle"
    all: true
    entities:
${this.generateEntities()}`;

  generateEntities = () => Areas.getAreaRegistry().map(area  => 

`      - switch.motion_detection_toggle_${area.id}`

  ).join('\n');

}

module.exports = MotionDetectionToggleSwitchGroup;