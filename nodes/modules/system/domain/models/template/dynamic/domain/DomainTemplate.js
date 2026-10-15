const Template = require('../../Template');
const Domains = require('../../../Domains');

class DomainTemplate extends Template {

  constructor({
    domain,
    path,
    ...options

  } = {}) {

    super({

      // Required
      domain,

      // Defaults
      base_path: `/config/.storage/templates/domain/${domain}`,
      file_name: `${domain}_template.yaml`,
      iterable: Domains.getDomains(),
      
      // Optional
      path,
      ...options
      
    });

  }

}

module.exports = DomainTemplate;