const fs = require('fs');
//const mockNode = require('../../../nodes/modules/system/util/test/mockNode');
//const { global } = require('../../../../node-red/__mocks__/global');
//const occupancyUpdater = fs.readFileSync('./occupancyUpdater');
const mockFunction = require('../../../nodes/modules/system/util/test/mockFunction');
//const node = {};
describe('Occupancy State Updater', () => {
  beforeEach(() => {
    // Clear mocked values before each test
    jest.clearAllMocks();
    //mockNode(node);
    //global.set('homeassistant.homeAssistant.states', {test_state: {state: true}});
  });

  it.skip('should handle missing event data', () => {
    console.log(process.cwd());
    console.log(`mockGlobal: ${global}`);
    console.log(global);
    // Create the mock function node for the occupancyUpdater file
    const occupancyUpdater = mockFunction(`${process.cwd()}\\lib\\functions\\Implementations\\occupancyUpdater.js`);
    // Call the execute method with context, environment, and message objects
    const result = occupancyUpdater.execute(null, null, { payload: null }, global);
    // Assert the result
    expect(result).toBeNull();
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('[WARN]'));
  });

  it.skip('should update occupancy for a valid event', () => {
    // Set up input
    const msg = { payload: { entity_id: 'some_entity_id' } };
    // Mock Entities.getEntity to return a valid area_id
    global.set('homeassistant.homeAssistant.states', { some_entity_id: { area_id: 'some_area_id' } });
    // Create the mock function node for the occupancyUpdater file
    const occupancyUpdater = mockFunction('./occupancyUpdater');
    // Call the execute method with context, environment, and message objects
    occupancyUpdater.execute(null, null, msg);
    // Assert the result
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('[SEND]'));
  });

  it.skip('should handle errors gracefully', () => {
    // Set up input
    const msg = { payload: { entity_id: 'some_invalid_entity_id' } };
    // Mock Entities.getEntity to throw an error
    global.set('homeassistant.homeAssistant.states', { some_invalid_entity_id: { area_id: 'some_area_id' } });
    // Create the mock function node for the occupancyUpdater file
    const occupancyUpdater = mockFunction('./occupancyUpdater');
    // Call the execute method with context, environment, and message objects
    occupancyUpdater.execute(null, null, msg);
    // Assert the result
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('[WARN]'));
  });

  // Add more test cases as needed
});
