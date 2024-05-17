const mockAreas = require('../../../../../util/test/mockAreas');
const mockEntities = require('../../../../../util/test/mockEntities');
const OccupancyEvent = require('../../../../../domain/models/OccupancyEvent');
const binarySensorOccupancyEventAdapter = require('../../../../../adapters/events/occupancy/binarySensorOccupancyEventAdapter');
const OccupancyService = require('../../../../../domain/services/OccupancyService');

const areas = [
  { aliases: [], name: "Area 1", id: "area1", picture: null },
  { aliases: [], name: "Area 2", id: "area2", picture: null }
];

const entities = [
  { entity_id: 'binary_sensor.area1_motion', area_id: 'area1' },
  { entity_id: 'binary_sensor.area2_motion', area_id: null },
];

const test_event_data = {
  new_state: {
    entity_id: 'binary_sensor.area1_motion',
    state: 'on',
    last_updated: Date.now(),
    attributes: {
      friendly_name: 'Area 1 Motion'
    }
  }
};  

describe('binarySensorOccupancyEventAdapter', () => {

  beforeEach(() => {
    // Initialize areas before each test case
    mockAreas.setup(areas);
    mockEntities.setup(entities);

    // Reset OccupancyService state before each test case
    OccupancyService.initialize();
  });

  afterEach(() => {
    // Reset areas after each test case
    mockAreas.resetMocks();
    mockEntities.resetMocks();
  });

  it('should create a OccupancyEvent object and return with the correct state', () => {
    const event_data = JSON.parse(JSON.stringify(test_event_data));

    let occupancyEvent = binarySensorOccupancyEventAdapter(event_data);
    expect(occupancyEvent).toBeInstanceOf(Object);
    expect(occupancyEvent.entity_id).toBe(event_data.new_state.entity_id);
    expect(occupancyEvent.timestamp).toBe(event_data.new_state.last_updated);
    expect(occupancyEvent.area_id).toBeDefined();
    expect(occupancyEvent.state).toBe(event_data.new_state.state); // State should be converted to boolean
    event_data.new_state.state = 'off';
    expect(occupancyEvent).toBeInstanceOf(Object);
    occupancyEvent = binarySensorOccupancyEventAdapter(event_data);
    expect(occupancyEvent.entity_id).toBe(event_data.new_state.entity_id);
    expect(occupancyEvent.timestamp).toBe(event_data.new_state.last_updated);
    expect(occupancyEvent.area_id).toBeDefined();
    expect(occupancyEvent.state).toBe(event_data.new_state.state); // State should be converted to boolean
  });

  it('should throw an error if event data is missing', () => {
    expect(() => binarySensorOccupancyEventAdapter()).toThrow(/Missing Binary Sensor Event Data/i);
  });

  it('should throw an error if entity ID is missing', () => {
    const event_data = JSON.parse(JSON.stringify(test_event_data));

    event_data.new_state.entity_id = undefined;
    expect(() => binarySensorOccupancyEventAdapter(event_data)).toThrow(/Missing entity ID/i);
  });

  it('should throw an error if area ID is missing from entity registry', () => {
    const event_data = JSON.parse(JSON.stringify(test_event_data));

    event_data.new_state.entity_id = "binary_sensor.area2_motion";
    expect(() => binarySensorOccupancyEventAdapter(event_data)).toThrow('Entity area not set');
  });

  it.skip('should throw an error if OccupancyEvent object is missing', () => {
    expect(() => binarySensorOccupancyEventAdapter(test_event_data)).toThrow(/Missing OccupancyEvent object/i);
  });

  it.skip('should default to occupied (true) if state is missing in new state data', () => {
    const event_data = JSON.parse(JSON.stringify(test_event_data));
    event_data.new_state.state = undefined;
    const result = binarySensorOccupancyEventAdapter(event_data)
    expect(result.state).toBe(true);
  });

  it('should return OccupancyEvent object using the set processing function', () => {
    const event_data = JSON.parse(JSON.stringify(test_event_data));
    const EventProcessor = new OccupancyEvent();
    EventProcessor.setEventProcessingFunction(binarySensorOccupancyEventAdapter);
    const occupancyEvent = EventProcessor.processEvent(event_data);
    expect(occupancyEvent).toBeInstanceOf(OccupancyEvent);
    expect(occupancyEvent.entity_id).toBe(event_data.new_state.entity_id);
    expect(occupancyEvent.area_id).toBe('area1');
    expect(occupancyEvent.timestamp).toStrictEqual(new Date(event_data.new_state.last_updated));
    expect(occupancyEvent.state).toBe(true); // State should be converted to boolean
  });

});