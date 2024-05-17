const mockEntities = require('../../../../util/test/mockEntities');
const OccupancyEvent = require('../../../../domain/models/OccupancyEvent');

describe('OccupancyEvent', () => {

  const mock_entities = [
    { entity_id: 'sensor123', area_id: 'Living Room' },
    { entity_id: 'sensor456', area_id: 'Bedroom' }
  ];

  afterAll(() => {
    // Reset all mocks after all tests
    mockEntities.resetMocks();
  });

  beforeAll(() => {
    // load mock entities before test cases
    mockEntities.setup(mock_entities);
  });

  it('should create an occupancy event with required parameters', () => {
    const entity_id = 'sensor1';
    const area_id = 'Living Room';
    const timestamp = new Date().toISOString();
    const event = new OccupancyEvent(entity_id, area_id, timestamp);

    expect(event.entity_id).toBe(entity_id);
    expect(event.area_id).toBe(area_id);
    expect(event.timestamp).toStrictEqual(new Date(timestamp));
    expect(event.timestamp).toBeInstanceOf(Date);
    expect(event.state).toBe(true);
  });

  it('should create an occupancy event with additional attributes', () => {
    const entity_id = 'sensor1';
    const area_id = 'Living Room';
    const timestamp = new Date();
    const customAttributes = { intensity: 'high', duration: '30s' };
    const event = new OccupancyEvent(entity_id, area_id, timestamp, 'off', customAttributes);

    expect(event.entity_id).toBe(entity_id);
    expect(event.area_id).toBe(area_id);
    expect(event.timestamp).toBe(timestamp);
    expect(event.state).toBe(false);
    expect(event.intensity).toBe('high');
    expect(event.duration).toBe('30s');
  });

  it('should create an occupancy event with state passed as attribute object', () => {
    const entity_id = 'sensor1';
    const area_id = 'Living Room';
    const timestamp = new Date();
    const customAttributes = { state: false, intensity: 'low' };
    const event = new OccupancyEvent(entity_id, area_id, timestamp, customAttributes);

    expect(event.entity_id).toBe(entity_id);
    expect(event.area_id).toBe(area_id);
    expect(event.timestamp).toBe(timestamp);
    expect(event.state).toBe(false);
    expect(event.intensity).toBe('low');
  });

  it('should create an occupancy event with default state if state is not provided separately', () => {
    const entity_id = 'sensor1';
    const area_id = 'Living Room';
    const timestamp = new Date();
    const customAttributes = { intensity: 'low' };
    const event = new OccupancyEvent(entity_id, area_id, timestamp, customAttributes);

    expect(event.entity_id).toBe(entity_id);
    expect(event.area_id).toBe(area_id);
    expect(event.timestamp).toBe(timestamp);
    expect(event.state).toBe(true);
    expect(event.intensity).toBe('low');
  });

  it('should create a new OccupancyEvent instance from event_data object', () => {
    const event_data = {
      entity_id: 'sensor456',
      last_updated: new Date().toISOString(),
      state: 'on'
    };
    
    const occupancyEvent = new OccupancyEvent(event_data);

    // Ensure occupancyEvent is created with the correct properties
    expect(occupancyEvent.entity_id).toBe(event_data.entity_id);
    expect(occupancyEvent.timestamp).toStrictEqual(new Date(event_data.last_updated));
    expect(occupancyEvent.state).toBe(true); // State should be converted to boolean
  });

});
