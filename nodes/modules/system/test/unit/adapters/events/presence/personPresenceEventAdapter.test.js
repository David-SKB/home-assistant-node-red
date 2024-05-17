const mockEntities = require('../../../../../util/test/mockEntities');
const personPresenceEventAdapter = require('../../../../../adapters/events/presence/personPresenceEventAdapter');
const PresenceService = require('../../../../../domain/services/PresenceService');
const PresenceEvent = require('../../../../../domain/models/PresenceEvent');

const test_entities = [
  { entity_id: 'person.user123', area_id: 'Living Room' },
  { entity_id: 'person.user456', area_id: 'Bedroom' }
];

describe('personPresenceEventAdapter', () => {

  const test_event_data = {
      entity_id: 'user123',
      new_state: { state: 'Home', entity_id: 'user123', }
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

  it('should return a PresenceEvent object and returnwith the correct state', () => {
    const event_data = JSON.parse(JSON.stringify(test_event_data));
    let presenceEvent = personPresenceEventAdapter(event_data);
    expect(presenceEvent).toBeInstanceOf(Object);
    expect(presenceEvent.user).toBe(event_data.entity_id);
    expect(presenceEvent.state).toBe(event_data.new_state.state);
    event_data.new_state.state = 'Not Home';
    presenceEvent = personPresenceEventAdapter(event_data);
    expect(presenceEvent).toBeInstanceOf(Object);
    expect(presenceEvent.user).toBe(event_data.new_state.entity_id);
    expect(presenceEvent.state).toBe(event_data.new_state.state);

  });

  it.skip('should throw an error if PresenceEvent object is missing', () => {
    expect(() => personPresenceEventAdapter(test_event_data)).toThrow('Missing PresenceEvent Object');
  });

  it('should throw an error if event data is missing', () => {
    expect(() => personPresenceEventAdapter()).toThrow('Missing Person Event Data');
  });

  it('should throw an error if user is missing in event data', () => {
    const event_data = JSON.parse(JSON.stringify(test_event_data));
    event_data.new_state.entity_id = undefined;
    expect(() => personPresenceEventAdapter(event_data)).toThrow('Missing user');
  });

  it('should throw an error if state is missing in new state data', () => {
    const event_data = JSON.parse(JSON.stringify(test_event_data));
    expect(PresenceService.isPresent(event_data.entity_id)).toBe(null);
    event_data.new_state.state = undefined;
    expect(() => personPresenceEventAdapter(event_data)).toThrow('Missing state');
    event_data.entity_id.new_state = undefined;
    expect(() => personPresenceEventAdapter(event_data)).toThrow('Missing state');
    expect(PresenceService.isPresent(event_data.entity_id)).toBe(null);
  });
});