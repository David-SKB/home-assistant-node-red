const fs = require('fs');
const Domains = require('../../domain/models/Domains');

// Mock fs.readFileSync
jest.mock('fs');

/**
 * Utility function to mock the behavior of Domains methods
 */
const mockDomains = {
  /**
   * Sets up mock data for domains and triggers the loadDomainRegistry method
   * @param {Array} domains - Mock data for domains
   */
  setup: (domains) => {
    jest.mock('../../domain/models/Domains', () => this);
    // Mock the readFileSync method to return the provided domain data
    fs.readFileSync.mockReturnValue(JSON.stringify(domains));

    // Trigger the loadDomainRegistry method
    Domains.loadDomainRegistry();
  },

  /**
   * Resets all mocked methods of Domains to their original implementations
   */
  resetMocks: () => {
    // Restore the original implementation of readFileSync
    fs.readFileSync.mockRestore();
  }
  
};

module.exports = mockDomains;