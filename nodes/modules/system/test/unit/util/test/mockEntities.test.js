const fs = require('fs');
const Entities = require('../../../../domain/models/Entities');
const mockEntities = require('../../../../util/test/mockEntities');

// Mock fs.readFileSync
jest.mock('fs');

// Create a spy on the loadEntityRegistry method of Entities
jest.spyOn(Entities, 'loadEntityRegistry');

describe('mockEntities', () => {

  afterEach(() => {
    // Reset all mocks after each test
    mockEntities.resetMocks();
  });

  it('should set up mock data for entities and trigger loadEntityRegistry', () => {
    // Define mock entity data
    const entitiesData = [
      { entity_id: 'test_entity1', other_property: 'mock_value1' },
      { entity_id: 'test_entity2', other_property: 'mock_value2' }
    ];

    // Set up mock data and trigger loadEntityRegistry
    mockEntities.setup(entitiesData);

    // Check if readFileSync is called with the correct parameters
    expect(fs.readFileSync).toHaveBeenCalledWith('/config/.storage/core.entity_registry', 'utf8');

    // Check if loadEntityRegistry is triggered
    expect(Entities.loadEntityRegistry).toHaveBeenCalled();
  });

  // should check if entity data is loaded
  it('should load entity data', () => {
    // Define mock entity data
    const entitiesData = [
      { entity_id: 'test_entity1', other_property: 'mock_value1' },
      { entity_id: 'test_entity2', other_property: 'mock_value2' }
    ];

    // Set up mock data and trigger loadEntityRegistry
    mockEntities.setup(entitiesData);

    // Check if readFileSync is called with the correct parameters
    expect(fs.readFileSync).toHaveBeenCalledWith('/config/.storage/core.entity_registry', 'utf8');

    // Check if loadEntityRegistry is triggered
    expect(Entities.loadEntityRegistry).toHaveBeenCalled();

    const expected = { 
    "test_entity1": { "entity_id": "test_entity1", "other_property": "mock_value1" }, 
    "test_entity2": { "entity_id": "test_entity2", "other_property": "mock_value2" } 
    }

    // Check if entity data is loaded
    expect(Entities.getEntities()).toEqual(expected);
  });

  it('should reset all mocked methods of Entities', () => {
    // Define mock entity data
    const entitiesData = [
      { entity_id: 'test_entity1', other_property: 'mock_value1' },
      { entity_id: 'test_entity2', other_property: 'mock_value2' }
    ];

    // Set up mock data and trigger loadEntityRegistry
    mockEntities.setup(entitiesData);

    expect(fs.readFileSync).toHaveBeenCalledTimes(1);

    // Reset mocks
    mockEntities.resetMocks();

    // Check if readFileSync mock is restored
    expect(fs.readFileSync).toHaveBeenCalledTimes(0);
  });
});