const Template = require('../../Template');
const Areas = require('../../../Areas');

class AreaTemplate extends Template {

  constructor(area_id, {

    area_name = area_id,
    path,
    ...options

  } = {}) {

    super({

      // Required
      area_id,

      // Defaults
      base_path: `/config/.storage/templates/area/${area_id}`,
      file_name: `${area_id}_template.yaml`,
      iterable: Areas.getAreaRegistry().map(area => (
        [ area.id, { area_name: area.name } ]
      )),
      
      // Optional
      area_name,
      path,
      ...options
      
    });

  }

}

module.exports = AreaTemplate;