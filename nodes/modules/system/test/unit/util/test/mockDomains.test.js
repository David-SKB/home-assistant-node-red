const fs = require('fs');
const Domains = require('../../../../domain/models/Domains');
const mockDomains = require('../../../../util/test/mockDomains');

// Mock fs.readFileSync
jest.mock('fs');

// Create a spy on the loadDomainRegistry method of Domains
jest.spyOn(Domains, 'loadDomainRegistry');

describe('mockDomains', () => {

  afterEach(() => {
    // Reset all mocks after each test
    mockDomains.resetMocks();
  });

  it('should set up mock data for domains and trigger loadDomainRegistry', () => {
    // Define mock domain data
    const domainsData = [
      'light',
      'switch',
      'button'
    ];

    // Set up mock data and trigger loadDomainRegistry
    mockDomains.setup(domainsData);

    // Check if readFileSync is called with the correct parameters
    expect(fs.readFileSync).toHaveBeenCalledWith('/config/.storage/core.domain_registry', 'utf8');

    // Check if loadDomainRegistry is triggered
    expect(Domains.loadDomainRegistry).toHaveBeenCalled();
  });

  // should check if domain data is loaded
  it('should load domain data', () => {
    // Define mock domain data
    const domainsData = [
      'light',
      'switch',
      'button'
    ];
    // Set up mock data and trigger loadDomainRegistry
    mockDomains.setup(domainsData);

    // Check if readFileSync is called with the correct parameters
    expect(fs.readFileSync).toHaveBeenCalledWith('/config/.storage/core.domain_registry', 'utf8');

    // Check if loadDomainRegistry is triggered
    expect(Domains.loadDomainRegistry).toHaveBeenCalled();

    const expected = [
      'light',
      'switch',
      'button'
    ];

    // Check if domain data is loaded
    expect(Domains.getDomains()).toEqual(expected);
  });

  it('should reset all mocked methods of Domains', () => {
    // Define mock domain data
    const domainsData = [
      'light',
      'switch',
      'button'
    ];

    // Set up mock data and trigger loadDomainRegistry
    mockDomains.setup(domainsData);

    expect(fs.readFileSync).toHaveBeenCalledTimes(1);

    // Reset mocks
    mockDomains.resetMocks();

    // Check if readFileSync mock is restored
    expect(fs.readFileSync).toHaveBeenCalledTimes(0);
  });
});