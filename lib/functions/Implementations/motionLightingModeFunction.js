// Motion Lighting Mode Function
// Returns the zone entity id(s) for lights to turn on/off
//

// area_motion_lighting_mode > input_select.motion_lighting_mode_area
// area_motion_lighting_zone > template_select.motion_lighting_target_area
// area_motion_timeout > input_datetime.motion_lighting_timeout_area
//
// Mode specific globals/helper entities
// area_hybrid_lighting_zone_1 > template_select.motion_lighting_target_area
// area_hybrid_lighting_zone_2 > template_select.motion_lighting_hybrid_target_area

const system = context.global[env.get("MODULE_ID")];
const utils = system.util.common;
const TimeoutConverter = system.domain.models.TimeoutConverter;

// Required globals/helper entities
const MOTION_LIGHTING_MODE_HELPER = (area_id) => `input_select.motion_lighting_mode_${area_id}`;
const MOTION_LIGHTING_TARGET_AREA_HELPER = (area_id) => `input_text.motion_lighting_target_${area_id}`;
const MOTION_LIGHTING_TIMEOUT_HELPER = (area_id) => `input_number.motion_lighting_timeout_${area_id}`;

// Mode specific globals/helper entities
const MOTION_LIGHTING_HYBRID_TARGET_AREA_1_HELPER = MOTION_LIGHTING_TARGET_AREA_HELPER;
const MOTION_LIGHTING_HYBRID_TARGET_AREA_2_HELPER = (area_id) => `input_text.motion_lighting_hybrid_target_${area_id}`;
//
//
// Function Variables
const area                        = msg.area;
const motion                      = msg.motion;
const motionLightingMode          = global.get(`homeassistant.homeAssistant.states['${MOTION_LIGHTING_MODE_HELPER(area)}']`).state;
const motionLightingTimeout       = global.get(`homeassistant.homeAssistant.states['${MOTION_LIGHTING_TIMEOUT_HELPER(area)}']`);
const motionLightingTimeoutState  = motionLightingTimeout.state;
const motionLightingTimeoutUnit   = motionLightingTimeout.attributes.unit_of_measurement;

//
newMsg      = getZone(area, motionLightingMode);
newMsg.mode = motionLightingMode;
node.warn("motion: "+ motion);
node.warn("motionLightingMode: "+ motionLightingMode);
//
if (motion == "off"){
    newMsg.delay = TimeoutConverter.convertToMilliseconds(motionLightingTimeoutState, motionLightingTimeoutUnit);
    node.warn("newMsg:");
    node.warn(newMsg);
    return [null, newMsg];
}
//node.warn("newMsg:");
newMsg.reset = true;
//node.warn(newMsg);
return [newMsg, null];
//
//END//
//
function getZone (area, mode){
    // Mode Switch
    switch(mode) {
      case "TOGGLE":
        //
        return motionZoneToggle(area);
      case "DIM":
        //
        return motionZoneToggle(area);
      case "HYBRID":
        //
        return motionZoneHybrid(area);
      default:
        // Not developed yet? Default to TOGGLE
        return motionZoneToggle(area);
    }
}
//
// TOGGLE Lighting Function
//
function motionZoneToggle (area){
  var motionLightingZone = utils.stripCharacter(global.get(`homeassistant.homeAssistant.states['${MOTION_LIGHTING_TARGET_AREA_HELPER(area)}']`).state);
  //
  node.warn("motionLightingZone: "+ motionLightingZone);
    node.warn(motionLightingZone);
  //
  newMsg        = { payload : motionLightingZone };
  newMsg.area   = area;
  newMsg.mode   = motionLightingMode;
  return newMsg;
}
//
// HYBRID Lighting Function
//
function motionZoneHybrid (area){
  var hybridLightingZone1 = utils.stripCharacter(global.get(`homeassistant.homeAssistant.states['${MOTION_LIGHTING_HYBRID_TARGET_AREA_1_HELPER(area)}']`).state);
  var hybridLightingZone2 = utils.stripCharacter(global.get(`homeassistant.homeAssistant.states['${MOTION_LIGHTING_HYBRID_TARGET_AREA_2_HELPER(area)}']`).state);
  //
  node.warn("hybridLightingZone1: "+ hybridLightingZone1);
  node.warn("hybridLightingZone2: "+ hybridLightingZone2);
  var payload = hybridLightingZone1 +','+ hybridLightingZone2;
  node.warn("payload: "+ payload);
  //
  newMsg            = { payload1 : hybridLightingZone1 };
  newMsg.payload2   = hybridLightingZone2;
  newMsg.area       = area;
  return newMsg;
}

// function cleanString(str) {
//     return str.replace(/^"+|"+$/g, '');
// }