const mockEntities = require('../../../../util/test/mockEntities');
const PresenceEvent = require('../../../../domain/models/PresenceEvent');

describe('PresenceEvent', () => {

  const mock_entities = [
    { entity_id: 'person.john', state: 'home' },
    { entity_id: 'person.mary', state: 'not_home' },
    { entity_id: 'person.wick', state: 'unknown' }
  ];

  beforeAll(() => {
    // load mock entities before test cases
    mockEntities.setup(mock_entities);
  });

  afterAll(() => {
    // Reset all mocks after all tests
    mockEntities.resetMocks();
  });

  it('should create a presence event with required parameters', () => {
    const user_id = 'person.john';

    let state = true;
    let timestamp = Date.now();
    let event = new PresenceEvent(user_id, state, timestamp);

    expect(event.state).toBe(state);
    expect(event.user_id).toBe(user_id);
    expect(event.timestamp).toBe(timestamp);

    state = false;
    timestamp = Date.now();
    event = new PresenceEvent(user_id, state, timestamp);

    expect(event.state).toBe(state);
    expect(event.user_id).toBe(user_id);
    expect(event.timestamp).toBe(timestamp);

    state = "Home";
    timestamp = Date.now();
    event = new PresenceEvent(user_id, state, timestamp);

    // State should be converted to boolean
    expect(event.state).toBe(true);
    expect(event.user_id).toBe(user_id);
    expect(event.timestamp).toBe(timestamp);

    state = "not_home";
    timestamp = Date.now();
    event = new PresenceEvent(user_id, state, timestamp);

    // State should be converted to boolean
    expect(event.state).toBe(false);
    expect(event.user_id).toBe(user_id);
    expect(event.timestamp).toBe(timestamp);
  });

  it('should create a presence event with default state if state is not provided', () => {
    const user_id = 'person.mary';
    const timestamp = Date.now();
    const customAttributes = { location: 'home' };
    const event = new PresenceEvent(user_id, undefined, timestamp);

    expect(event.user_id).toBe(user_id);
    expect(event.state).toBe(true);
    expect(event.timestamp).toBe(timestamp);
  });

  it('should create a presence event with default timestamp if not provided', () => {
    const user_id = 'person.mary';
    const timestamp = Date.now();
    const event = new PresenceEvent(user_id, true);

    expect(event.user_id).toBe(user_id);
    expect(event.state).toBe(true);
    expect(event.timestamp).toBeGreaterThanOrEqual(timestamp - 10); // 10ms before
    expect(event.timestamp).toBeLessThanOrEqual(timestamp + 10); // 10ms after
  });

  it('should create a presence event with default state if state is not found or passed correctly', () => {
    const user_id = 'person.mary';
    const timestamp = Date.now();
    const customAttributes = { location: 'home' };
    const event = new PresenceEvent(user_id, customAttributes, timestamp);

    expect(event.user_id).toBe(user_id);
    expect(event.state).toBe(true);
    expect(event.timestamp).toBe(timestamp);
  });

  it('should create a new PresenceEvent instance from event_data object', () => {
    let event_data = {
      entity_id: 'person.mary',
      last_updated: Date.now(),
      state: 'home'
    };
    
    let presenceEvent = new PresenceEvent(event_data);

    expect(presenceEvent.user_id).toBe(event_data.entity_id);
    expect(presenceEvent.timestamp).toBeGreaterThanOrEqual(event_data.last_updated - 10); // 10ms before
    expect(presenceEvent.timestamp).toBeLessThanOrEqual(event_data.last_updated + 10); // 10ms after
    // State should be converted to boolean
    expect(presenceEvent.state).toBe(true); 

    event_data.state = 'not_home';
    event_data.last_updated = Date.now();
    presenceEvent = new PresenceEvent(event_data);

    expect(presenceEvent.user_id).toBe(event_data.entity_id);
    expect(presenceEvent.timestamp).toBeGreaterThanOrEqual(event_data.last_updated - 10); // 10ms before
    expect(presenceEvent.timestamp).toBeLessThanOrEqual(event_data.last_updated + 10); // 10ms after
    // State should be converted to boolean
    expect(presenceEvent.state).toBe(false);

    event_data.state = true;
    event_data.last_updated = Date.now();
    presenceEvent = new PresenceEvent(event_data);

    expect(presenceEvent.user_id).toBe(event_data.entity_id);
    expect(presenceEvent.timestamp).toBeGreaterThanOrEqual(event_data.last_updated - 10); // 10ms before
    expect(presenceEvent.timestamp).toBeLessThanOrEqual(event_data.last_updated + 10); // 10ms after
    expect(presenceEvent.state).toBe(event_data.state);

    event_data.state = false;
    event_data.last_updated = Date.now();
    presenceEvent = new PresenceEvent(event_data);

    expect(presenceEvent.user_id).toBe(event_data.entity_id);
    expect(presenceEvent.timestamp).toBeGreaterThanOrEqual(event_data.last_updated - 10); // 10ms before
    expect(presenceEvent.timestamp).toBeLessThanOrEqual(event_data.last_updated + 10); // 10ms after
    expect(presenceEvent.state).toBe(event_data.state);
  });

  it('should create a presence event with state defaulted to false if the state is not recognised', () => {
    const user_id = 'person.wick';
    const timestamp = Date.now();
    const event = new PresenceEvent(user_id, 'unknown', timestamp);
    expect(event.user_id).toBe(user_id);
    expect(event.state).toBe(false);
    expect(event.timestamp).toBe(timestamp);
  });

});
