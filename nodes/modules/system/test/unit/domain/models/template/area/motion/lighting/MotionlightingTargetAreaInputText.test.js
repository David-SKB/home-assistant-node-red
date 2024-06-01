const fs = require('fs');
const path = require('path');
const { mockAreas, mockEntities, normalizeMultilineString } = require('../../../../../../../../util/test');

const MotionLightingTargetAreaInputText = require('../../../../../../../../domain/models/template/area/motion/lighting/MotionLightingTargetAreaInputText');

describe('MotionLightingTargetAreaInputText', () => {

  const areas = [
    { aliases: [], name: "Area 1", id: "area1", picture: null },
    { aliases: [], name: "Area 2", id: "area2", picture: null },
    { aliases: [], name: "Area 3", id: "area3", picture: null }
  ];

  const base_path = (area_id) => `/config/.storage/templates/area/motion/lighting/${area_id}/`;
  const file_name = (area_id) => `motion_lighting_target_${area_id}_input_text.yaml`;

  beforeEach(() => {
    mockAreas.setup(areas);
    mockEntities.setup([]);
  });

  afterEach(() => {
    mockAreas.resetMocks();
    mockEntities.resetMocks();
  });

  it('should set default values correctly', () => {
    const area_id = areas[0].id;

    const template = new MotionLightingTargetAreaInputText(area_id);

    expect(template.area_name).toBe(area_id);
    expect(template.base_path).toBe(base_path(area_id));
    expect(template.file_name).toBe(file_name(area_id));
    expect(template.path).toBe(path.join(base_path(area_id), file_name(area_id)));

  });

  it('should override default values correctly', () => {
    const area_id = areas[0].id;
    const custom_base_path = '/custom/path/';
    const custom_file_name = 'custom.yaml';
    const custom_path = '/custom/full/path/custom.yaml';

    const template = new MotionLightingTargetAreaInputText(area_id, {
      base_path: custom_base_path,
      file_name: custom_file_name,
      path: custom_path,
      area_name: 'Custom Area'
    });

    expect(template.base_path).toBe(custom_base_path);
    expect(template.file_name).toBe(custom_file_name);
    expect(template.path).toBe(custom_path);
    expect(template.area_name).toBe('Custom Area');
  });

  it('should generate the expected input_text template', () => {
    const area_id = areas[0].id;
    const area_name = areas[0].name;

    const expected = fs.readFileSync(path.join(__dirname, 
      `../../../../../templates/mocks/${file_name(area_id)}`), 
      'utf8'
    );

    const generated_template = new MotionLightingTargetAreaInputText(area_id, {area_name}).generate().payload;

    expect(normalizeMultilineString(generated_template)).toBe(normalizeMultilineString(expected));
  });

});