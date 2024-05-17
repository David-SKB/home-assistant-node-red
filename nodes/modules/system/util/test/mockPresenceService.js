const PresenceService = require('../../domain/services/PresenceService');

// Mock the PresenceService class
jest.mock('../../domain/services/PresenceService');
// jest.mock('../../../domain/services/PresenceService', () => ({
//   //setPresence: jest.fn(),
//   //presence: 'mocked_presence_status'
// }));

// Store the original implementation of PresenceService constructor
const originalPresenceService = PresenceService;

/**
 * Utility function to mock the behavior of PresenceService methods
 */
const mockPresenceService = {
  /**
   * Sets up mock data for presence service
   * @param {Object} presenceData - Mock data for presence service
   */
  setup: () => {
    jest.mock('../../domain/services/PresenceService', () => this);
    
    // Trigger the loadPresence method
    PresenceService.loadPresence();
  },

  /**
   * Resets the mock of PresenceService class
   */
  resetMocks: () => {
    // Restore the original implementation of PresenceService constructor
    PresenceService = originalPresenceService;
  }
};

module.exports = mockPresenceService;
