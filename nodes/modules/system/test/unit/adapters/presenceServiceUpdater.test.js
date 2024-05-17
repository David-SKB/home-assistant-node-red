 const mockEntities = require('../../../util/test/mockEntities');
 const PresenceService = require('../../../domain/services/PresenceService');

// const personPresenceEventAdapter = require('../../../../../adapters/events/presence/personPresenceEventAdapter');
// const PresenceEvent = require('../../../../../domain/models/PresenceEvent');

const test_entities = [
  { entity_id: 'person.user123', area_id: 'Living Room' },
  { entity_id: 'person.user456', area_id: 'Bedroom' }
];

describe('personPresenceEventAdapter', () => {

  const test_event_data = {
      entity_id: 'user123',
      new_state: { state: 'Home' }
    };  

  beforeEach(() => {
    // Initialize areas before each test case
    mockEntities.setup(test_entities);

    // Reset OccupancyService state before each test case
    PresenceService.initialize();
  });

  afterEach(() => {
    // Reset areas after each test case
    mockEntities.resetMocks();
  });

  it.skip('should create a PresenceEvent object and return', () => {
    const event_data = {...test_event_data};
    const user = event_data.entity_id;
    // Check if PresenceEvent object is created
    const presenceEvent = personPresenceEventAdapter(event_data, PresenceEvent);
    expect(presenceEvent).toBeInstanceOf(PresenceEvent);
    personPresenceEventAdapter(event_data, PresenceEvent);
    expect(PresenceService.isPresent(event_data.entity_id)).toBe(true);
    // Check if user is set to absent
    event_data.new_state.state = 'Not Home';
    personPresenceEventAdapter(event_data, PresenceEvent);
    expect(PresenceService.isPresent(event_data.entity_id)).toBe(false);
  });

  it.skip('should throw an error if PresenceEvent object is missing', () => {
    expect(() => personPresenceEventAdapter(event_data)).toThrow('Missing PresenceEvent Object');
  });

  it.skip('should throw an error if event data is missing', () => {
    expect(() => personPresenceEventAdapter()).toThrow('Missing Person Event Data');
  });

  it.skip('should throw an error if user is missing in event data', () => {
    const event_data = {...test_event_data};
    event_data.entity_id = undefined;
    expect(() => personPresenceEventAdapter(event_data, PresenceEvent)).toThrow('Missing user');
  });

  it.skip('should throw an error if state is missing in new state data', () => {
    const event_data = {...test_event_data};
    expect(PresenceService.isPresent(event_data.entity_id)).toBe(null);
    event_data.new_state.state = undefined;
    expect(() => personPresenceEventAdapter(event_data, PresenceEvent)).toThrow('Missing state');
    event_data.entity_id.new_state = undefined;
    expect(() => personPresenceEventAdapter(event_data, PresenceEvent)).toThrow('Missing state');
    expect(PresenceService.isPresent(event_data.entity_id)).toBe(null);
  });
});