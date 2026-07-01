const fs = require('fs');
const mockDomains = require('../../../../util/test/mockDomains');
const Domains = require('../../../../domain/models/Domains');


jest.mock('fs');

describe('Domains', () => {

  const domains = [
    'light',
    'switch',
    'button'
  ];
  beforeEach(() => {
    // Mock the readFileSync method
    mockDomains.setup(domains);
  });

  afterEach(() => {
    // Restore the original implementation after all tests are done
    mockDomains.resetMocks();
  });

  describe('loadDomainRegistry', () => {

    it('should load the domains registry', () => {
      Domains.loadDomainRegistry();
      expect(Domains.domains).toEqual(domains);
    });

  });

  describe('isDomain', () => {

    it('should return true if the domain exists', () => {
      const domain = domains[0];
      const result = Domains.isDomain(domain);
      expect(result).toEqual(true);
    });

    it('should return false if the domain does not exist', () => {
      const result = Domains.isDomain('non_existent_domain');
      expect(result).toEqual(false);
    });

  });

  describe('getDomains', () => {

    it('should return the list of domains', () => {
      const result = Domains.getDomains();
      const expected = domains;
      expect(result).toEqual(expected);
    });

    it('should return an empty list if the domain registry is empty', () => {
      mockDomains.resetMocks();
      mockDomains.setup([]);
      const result = Domains.getDomains();
      expect(result).toEqual([]);
    });

  });

});
