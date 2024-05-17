const fs = require('fs');
const Entities = require('../../domain/models/Entities');

// Mock fs.readFileSync
jest.mock('fs');

/**
 * Utility function to mock the behavior of Entities methods
 */
const mockEntities = {
  /**
   * Sets up mock data for entities and triggers the loadEntityRegistry method
   * @param {Array} entities - Mock data for entities
   */
  setup: (entities) => {
    jest.mock('../../domain/models/Entities', () => this);
    // Mock the readFileSync method to return the provided entities data
    fs.readFileSync.mockReturnValue(JSON.stringify({ data: { entities } }));

    // Trigger the loadEntityRegistry method
    Entities.loadEntityRegistry();
  },

  /**
   * Resets all mocked methods of Entities to their original implementations
   */
  resetMocks: () => {
    // Restore the original implementation of readFileSync
    fs.readFileSync.mockRestore();
  }
  
};

module.exports = mockEntities;