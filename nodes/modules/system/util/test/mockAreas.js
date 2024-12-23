const fs = require('fs');
const Areas = require('../../domain/models/Areas');

// Mock fs.readFileSync
jest.mock('fs');

/**
 * Utility function to mock the behavior of Areas methods
 */
const mockAreas = {
  /**
   * Sets up mock data for areas and triggers the loadAreaRegistry method
   * @param {Array} areas - Mock data for entities
   */
  setup: (areas) => {
    jest.mock('../../domain/models/Areas', () => this);
    // Mock the readFileSync method to return the provided area data
    fs.readFileSync.mockReturnValue(JSON.stringify(areas));

    // Trigger the loadAreaRegistry method
    Areas.loadAreaRegistry();
  },

  /**
   * Resets all mocked methods of Areas to their original implementations
   */
  resetMocks: () => {
    // Restore the original implementation of readFileSync
    fs.readFileSync.mockRestore();
  }
  
};

module.exports = mockAreas;