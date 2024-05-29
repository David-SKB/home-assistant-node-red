const fs = require('fs');
const jsYaml = require('js-yaml');
const path = require('path');
const { mockAreas, mockEntities } = require('../../../../../../util/test');
// const generateMotionLightingAreaTemplates = require('../../../../../../domain/templates/generators/area/generateMotionLightingAreaTemplates.js');
// const MotionlightingTargetInputText = require('../../../../../../domain/models/template/motion_lighting/MotionlightingTargetInputText');

describe('generateMotionLightingAreaTemplates', () => {

  const areas = [
    { aliases: [], name: "Area 1", id: "area1", picture: null },
    { aliases: [], name: "Area 2", id: "area2", picture: null },
    { aliases: [], name: "Area 3", id: "area3", picture: null }
  ];

  const normalizeMultilineString = (str) => str.replace(/\s+/g, ' ').trim();

  beforeEach(() => {
    mockAreas.setup(areas);
    mockEntities.setup([]);
  });

  afterEach(() => {
    mockAreas.resetMocks();
    mockEntities.resetMocks();
  });

  it.skip('should generate the expected template for motion lighting mode', () => {
    const area_id = areas[0].id;
    const default_base_path = `/config/.storage/packages/dynamic/motion_lighting/${area_id}/`;

    const templates = generateMotionLightingAreaTemplates(area_id, {
      base_path: default_base_path,
      area_name: areas[0].name
    });

    const expected = fs.readFileSync(path.join(__dirname, '../../mocks/motion_lighting_mode_area1_input_select.yaml'), 'utf8');
    
    const mode_template = templates.find(template => template.path.includes('motion_lighting_mode'));
    const generated_template = mode_template.payload;

    expect(path.normalize(mode_template.path)).toBe(path.normalize(`${default_base_path}motion_lighting_mode_${area_id}_input_select.yaml`));
    expect(normalizeMultilineString(generated_template)).toStrictEqual(normalizeMultilineString(expected));
  });

  it.skip('should generate the expected template for motion lighting timeout', () => {
    const area_id = areas[0].id;
    const default_base_path = `/config/.storage/packages/dynamic/motion_lighting/${area_id}/`;

    const templates = generateMotionLightingAreaTemplates(area_id, {
      base_path: default_base_path,
      area_name: areas[0].name
    });

    const expected = fs.readFileSync(path.join(__dirname, '../../mocks/motion_lighting_timeout_area1_input_datetime.yaml'), 'utf8');

    const timeout_template = templates.find(template => template.path.includes('motion_lighting_timeout'));
    const generated_template = timeout_template.payload;

    expect(timeout_template.path).toBe(path.normalize(`${default_base_path}motion_lighting_timeout_${area_id}_input_datetime.yaml`));
    expect(normalizeMultilineString(generated_template)).toStrictEqual(normalizeMultilineString(expected));
  });

  it.skip('should generate the expected template for motion lighting target text', () => {
    const area_id = areas[0].id;
    const default_base_path = `/config/.storage/packages/dynamic/motion_lighting/${area_id}/`;

    const templates = generateMotionLightingAreaTemplates(area_id, {
      base_path: default_base_path,
      area_name: areas[0].name
    });

    const expected = fs.readFileSync(path.join(__dirname, '../../mocks/motion_lighting_target_area1_input_text.yaml'), 'utf8');

    const target_template = templates.find(template => template.path.includes('motion_lighting_target'));
    const generated_template = target_template.payload;

    // ad-hoc Test for new Template subclass 
    const input_text_template = new MotionlightingTargetInputText(area_id, {
    base_path: default_base_path, 
    area_name: areas[0].name,
    file_name: `motion_lighting_target_${area_id}_input_text.yaml`
    }).generate();

    console.log(`TTemplate: ${JSON.stringify(input_text_template)}`);

    expect(target_template.path).toBe(path.normalize(`${default_base_path}motion_lighting_target_${area_id}_input_text.yaml`));
    expect(normalizeMultilineString(input_text_template.payload)).toStrictEqual(normalizeMultilineString(expected));
  });

  it.skip('should generate the expected template for motion lighting hybrid target text', () => {
    const area_id = areas[0].id;
    const default_base_path = `/config/.storage/packages/dynamic/motion_lighting/${area_id}/`;

    const templates = generateMotionLightingAreaTemplates(area_id, {
      base_path: default_base_path,
      area_name: areas[0].name
    });

    const expected = fs.readFileSync(path.join(__dirname, '../../mocks/motion_lighting_hybrid_target_area1_input_text.yaml'), 'utf8');

    const hybrid_template = templates.find(template => template.path.includes('motion_lighting_hybrid_target'));
    const generated_template = hybrid_template.payload;

    expect(hybrid_template.path).toBe(path.normalize(`${default_base_path}motion_lighting_hybrid_target_${area_id}_input_text.yaml`));
    expect(normalizeMultilineString(generated_template)).toStrictEqual(normalizeMultilineString(expected));
  });


  it.skip('should generate the expected template for motion lighting target select', () => {
    const area_id = areas[0].id;
    const default_base_path = `/config/.storage/packages/dynamic/motion_lighting/${area_id}/`;

    const templates = generateMotionLightingAreaTemplates(area_id, {
      base_path: default_base_path,
      area_name: areas[0].name
    });

    const expected = fs.readFileSync(path.join(__dirname, '../../mocks/motion_lighting_target_area1_template_select.yaml'), 'utf8');

    const select_template = templates.find(template => template.path.includes('motion_lighting_target') && template.path.includes('template_select'));
    const generated_template = select_template.payload;

    expect(select_template.path).toBe(path.normalize(`${default_base_path}motion_lighting_target_${area_id}_template_select.yaml`));
    expect(normalizeMultilineString(generated_template)).toStrictEqual(normalizeMultilineString(expected));
  });

  it.skip('should generate the expected template for motion lighting hybrid target select', () => {
    const area_id = areas[0].id;
    const default_base_path = `/config/.storage/packages/dynamic/motion_lighting/${area_id}/`;

    const templates = generateMotionLightingAreaTemplates(area_id, {
      base_path: default_base_path,
      area_name: areas[0].name
    });

    const expected = fs.readFileSync(path.join(__dirname, '../../mocks/motion_lighting_hybrid_target_area1_template_select.yaml'), 'utf8');

    const hybrid_select_template = templates.find(template => template.path.includes('motion_lighting_hybrid_target') && template.path.includes('template_select'));
    const generated_template = hybrid_select_template.payload;

    expect(hybrid_select_template.path).toBe(path.normalize(`${default_base_path}motion_lighting_hybrid_target_${area_id}_template_select.yaml`));
    expect(normalizeMultilineString(generated_template)).toStrictEqual(normalizeMultilineString(expected));
  });

});
