const Entity = require('../../../../domain/models/Entity');

describe('Entity', () => {
  // Define shared test data
  const test_entity_data_1 = {
    aliases: ['alias1', 'alias2'],
    area_id: 'test_area',
    capabilities: { feature1: true, feature2: false },
    entity_id: 'switch.test_switch',
    name: 'Test Switch Entity'
  };

  describe('constructor', () => {
    it('should create an Entity object with the provided data', () => {
      const entity = new Entity(test_entity_data_1);
      expect(entity).toBeInstanceOf(Entity);
      expect(entity.aliases).toEqual(test_entity_data_1.aliases);
      expect(entity.entity_id).toEqual(test_entity_data_1.entity_id);
      expect(entity.area_id).toEqual(test_entity_data_1.area_id);
      expect(entity.capabilities).toEqual(test_entity_data_1.capabilities);
      expect(entity.name).toEqual(test_entity_data_1.name);
    });
  });

  describe('getters and setters', () => {
    let entity;

    beforeEach(() => {
      entity = new Entity(test_entity_data_1);
    });

    it('should return the correct value for entity_id', () => {
      expect(entity.entity_id).toEqual(test_entity_data_1.entity_id);
    });

    it('should return the correct value for _unit_of_measurement', () => {
      expect(entity.area_id).toEqual(test_entity_data_1.area_id);
    });

    it('should return the correct value for capabilities', () => {
      expect(entity.capabilities).toEqual(test_entity_data_1.capabilities);
    });

    it('should return the correct value for has_entity_name', () => {
        expect(entity.has_entity_name).toEqual(test_entity_data_1.name != null);
        entity.name = null;
        expect(entity.has_entity_name).toEqual(false);
        entity.name = "Test Entity Name";
        expect(entity.has_entity_name).toEqual(true);
    });

  });
});
