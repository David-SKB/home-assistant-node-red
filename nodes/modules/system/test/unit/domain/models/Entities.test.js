const fs = require('fs');
const mockEntities = require('../../../../util/test/mockEntities');
const Entities = require('../../../../domain/models/Entities');
const getRandomIndex = require('../../../../util/test/getRandomIndex');
jest.mock('fs');

describe('Entities', () => {

  const entities = [
    {
      entity_id: 'light.living_room',
      other_property: 'other_value',
    },
    {
      entity_id: 'light.bedroom_desk',
      other_property: 'other_value',
    },
    {
      entity_id: 'light.main',
      other_property: 'other_value',
      test_property: 'shortest entity ID'
    }
  ];

  beforeAll(() => {
    // Mock the readFileSync method
    mockEntities.setup(entities);
  });

  afterAll(() => {
    // Restore the original implementation after all tests are done
    mockEntities.resetMocks();
  });
  
  describe('loadEntityRegistry', () => {
    it('should load the entity registry', () => {
      const test_entity = getRandomIndex(entities);
      Entities.loadEntityRegistry();
      expect(Entities.entities[test_entity.entity_id]).toEqual(test_entity);
    });
  });

  describe('getEntity', () => {
    it('should return the entity with the specified entity ID', () => {
      const test_entity = getRandomIndex(entities);
      const result = Entities.getEntity(test_entity.entity_id);
      expect(result).toEqual(test_entity);
    });

    it('should return undefined for non-existent entity ID', () => {
      const result = Entities.getEntity('non_existent_entity_id');
      expect(result).toBeUndefined();
    });
  });

  describe('stripDomain', () => {
    it('should strip the domain from the entity ID', () => {
      const test_entity = getRandomIndex(entities);
      const result = Entities.stripDomain(test_entity.entity_id);
      expect(result).toBe(test_entity.entity_id.split('.')[1]);
    });

    it('should return the entity ID as is if it does not contain a domain', () => {
      const result = Entities.stripDomain('living_room');
      expect(result).toBe('living_room');
    });

    it('should throw an error if entity_id is not a string', () => {
      const entity_id = true;
      expect(() => Entities.stripDomain(entity_id)).toThrow(`Invalid entity_id: [${entity_id}]`);
    });
  });

  describe('getDomain', () => {
    it('should return the domain from the entity ID', () => {
      const result = Entities.getDomain(getRandomIndex(entities).entity_id);
      expect(result).toBe('light');
    });

    it('should return the entity ID as is if it does not contain a domain', () => {
      const result = Entities.getDomain('living_room');
      expect(result).toBe('living_room');
    });
  });

  describe('getEntitiesByAttributes', () => {
    it('should return entities matching the specified attributes', () => {
      const test_entity = getRandomIndex(entities);
      const attributes = [
        { key: 'other_property', value: 'other_value' }
      ];
      const result = Entities.getEntitiesByAttributes(test_entity.entity_id, attributes);
      expect(result).toEqual([test_entity]);
    });

    it('should return entities matching the entity domain', () => {
      const domain = Entities.getDomain(getRandomIndex(entities).entity_id);
      const result = Entities.getEntitiesByAttributes(domain);
      expect(result).toEqual(entities);
    });

    it('should return entities matching the stripped entity id', () => {
      const test_entity = getRandomIndex(entities);
      const stripped_entity_id = Entities.stripDomain(test_entity.entity_id);
      const result = Entities.getEntitiesByAttributes(stripped_entity_id);
      expect(result).toEqual([test_entity]);
    });
  
    it('should return an empty array if no entities match the specified attributes', () => {
      const attributes = [
        { key: 'other_property', value: 'non_matching_value' }
      ];
      const result = Entities.getEntitiesByAttributes(getRandomIndex(entities).entity_id, attributes);
      expect(result).toEqual([]);
    });
  });
  
  describe('getEntityByAttributes', () => {
    it('should return the closest match of an entity based on specified attributes', () => {
      const test_entity = getRandomIndex(entities);
      const attributes = [
        { key: 'other_property', value: 'other_value' }
      ];
      const result = Entities.getEntityByAttributes(test_entity.entity_id, attributes);
      expect(result).toEqual(test_entity);
    });

    it('should return the matching entity with the closest (shortest) id', () => {
      expect(Entities.getEntityByAttributes("light")).toEqual(entities[2]);
    });
  
    it('should return null if no entities match the specified attributes', () => {
      const attributes = [
        { key: 'other_property', value: 'non_matching_value' }
      ];
      const result = Entities.getEntityByAttributes(getRandomIndex(entities).entity_id, attributes);
      expect(result).toBeNull();
    });
  });
});