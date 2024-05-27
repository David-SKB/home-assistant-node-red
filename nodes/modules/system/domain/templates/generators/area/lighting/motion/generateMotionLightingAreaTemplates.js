const { Areas } = require('../../../../../models');
const MotionlightingModeInputSelect = require('../../../../../models/template/area/lighting/motion/MotionlightingModeInputSelect');
const MotionlightingTimeoutInputDatetime = require('../../../../../models/template/area/lighting/motion/MotionlightingTimeoutInputDatetime');
const MotionlightingTargetInputText = require('../../../../../models/template/area/lighting/motion/MotionlightingTargetInputText');
const MotionlightingHybridTargetInputText = require('../../../../../models/template/area/lighting/motion/MotionlightingHybridTargetInputText');
const MotionlightingTargetTemplateSelect = require('../../../../../models/template/area/lighting/motion/MotionlightingTargetTemplateSelect');
const MotionlightingHybridTargetTemplateSelect = require('../../../../../models/template/area/lighting/motion/MotionlightingHybridTargetTemplateSelect');

function generateMotionLightingAreaTemplates(areas = Areas.getAreas(), {
  directory_path = "/config/.storage/templates/area/lighting/motion/",
}) {

  areas = (Array.isArray(areas)) ? areas : [areas]

  let templates = [];

  areas.forEach(function (area) {

    const base_path = `${directory_path}${area_id}/`

    const area_id = area.id;
    const area_name = area.name;

    templates = [ ...templates,

      new MotionlightingModeInputSelect(area_id, { base_path, area_name }).generate(),
      new MotionlightingTimeoutInputDatetime(area_id, { base_path, area_name }).generate(),
      new MotionlightingTargetInputText(area_id, { base_path, area_name }).generate(),
      new MotionlightingHybridTargetInputText(area_id, { base_path, area_name }).generate(),
      new MotionlightingTargetTemplateSelect(area_id, { base_path, area_name }).generate(),
      new MotionlightingHybridTargetTemplateSelect(area_id, { base_path, area_name }).generate()

    ];

  });

  return templates;
}

module.exports = generateMotionLightingAreaTemplates;