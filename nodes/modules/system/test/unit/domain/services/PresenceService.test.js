const mockEntities = require('../../../../util/test/mockEntities');
const getRandomIndex = require('../../../../util/test/getRandomIndex');
const PresenceService = require('../../../../domain/services/PresenceService');

describe('PresenceService', () => {

  const entities = [
    { entity_id: 'person.user_1', name: 'User 1' },
    { entity_id: 'person.user_2', name: 'User 2' }
  ];

  beforeEach(() => {

    // load mock entities before each test case
    mockEntities.setup(entities);
    
    // Reset PresenceService state before each test case
    PresenceService.initialize();

  });

  afterEach(() => {
    // Reset mock entities after each test case
    mockEntities.resetMocks();
  });

  // Test suite for the getUsers method
  describe('getUsers', () => {

    it('should return an object containing user presence information', () => {
      const users = PresenceService.getUsers();

      // Assert that users is an object
      expect(typeof users).toBe('object');

      // Assert that users object contains keys with 'person.' prefix omitted
      entities.forEach(entity => {
        if (entity.entity_id.startsWith('person.')) {
          expect(Object.keys(users)).toContain(entity.entity_id.replace('person.', ''));
        }
      });

      // Assert that each user has the expected structure
      Object.keys(users).forEach(user_id => {
        expect(users[user_id]).toEqual({
          id: user_id,
          state: null,
          last_updated: null,
          last_present: null
        });
      });
    });
    
  });
 
  // Test suite for the setPresence method 1
  describe('setPresence', () => {
  
    afterEach(() => {
      // Reset mock entities after test cases
      mockEntities.resetMocks();
    });

    beforeEach(() => {
      // load mock entities before test cases
      mockEntities.setup(entities);
      // Reset PresenceService state before each test case
      PresenceService.initialize();
    });

    it('should update the present state for a given user', () => {
      const user = getRandomIndex(entities).entity_id.split('.')[1];

      let state = false;

      PresenceService.setPresence(user, state);
      expect(PresenceService.users[user].state).toBe(state);

    });

    it('should update the user and system presence data', () => {
      const user = getRandomIndex(entities).entity_id.split('.')[1];
      const state = true;

      const empty_user_presence_object = {
        state:null, 
        last_updated:null, 
        last_present:null,
        id:user
      };

      // Assert that global presence has not been updated yet
      expect(PresenceService.state).toEqual(null);
      expect(PresenceService.last_updated).toEqual(null);
      expect(PresenceService.last_present).toEqual(null);
      expect(PresenceService.user_id).toEqual(null);

      // Assert that the user present object has not been updated yet
      expect(PresenceService.users[user]).toEqual(empty_user_presence_object);

      // Call setPresence method
      PresenceService.setPresence(user, state);

      // Assert that the system present object has been updated
      expect(PresenceService.state).toEqual(state);
      expect(PresenceService.last_updated).not.toEqual(null);
      expect(PresenceService.last_present).not.toEqual(null);
      expect(PresenceService.user_id).toEqual(user);

      // Assert that the presence state has been updated for the user
      //expect(PresenceService.users[user]).not.toEqual(empty_user_present_object);

    });

    it('should set the presence state for the user with last present time', () => {
      const user = getRandomIndex(entities).entity_id.split('.')[1];
      const state = true;
      const last_present = Date.now();

      // Set user presence state with last present time
      PresenceService.setPresence(user, state, last_present);

      // Assert that the user presence state and last present time are correctly set
      expect(PresenceService.users[user].state).toBe(state);
      expect(PresenceService.users[user].last_present).toBe(last_present);
    });

    it('should set present state for the system without additional paramters', () => {

      const user = getRandomIndex(entities).entity_id.split('.')[1];
      // Set system presence state
      PresenceService.setPresence(user);

      // Assert that the system presence state is correctly set
      expect(PresenceService.state).toBe(true);

    });

    it('should set parameters for the system present object', () => {
      const user = getRandomIndex(entities).entity_id.split('.')[1];
      for (const state of [true, false]) {
        const last_updated = Date.now();
  
        // Set system presence state
        PresenceService.setPresence(user, state, last_updated);
  
        // Assert that the system presence state is correctly set
        expect(PresenceService.state).toBe(state);

        // Set system presence state with last present time
        PresenceService.setPresence(user, state, last_updated);
    
        // Assert that the system presence state is correctly set
        expect(PresenceService.state).toBe(state);
        expect(PresenceService.last_updated).toBe(last_updated);
        expect(PresenceService.last_present).toBe(last_updated);
      }
    });

  });

  // Test suite for the userPresent method
  describe('isPresent', () => {

    afterEach(() => {
      // Reset mock entities after test cases
      mockEntities.resetMocks();
    });

    beforeEach(() => {
      // load mock entities before test cases
      mockEntities.setup(entities);
      // Reset PresenceService state before each test case
      PresenceService.initialize();
    });

    it('should return true if the user is present', () => {
      const user = getRandomIndex(entities).entity_id.split('.')[1];
      const state = true;
      
      // Update presence status for the user
      PresenceService.setPresence(user, state);
  
      // Assert that userPresent returns true
      expect(PresenceService.isPresent(user)).toBe(true);
    });
  
    it('should return false if the user is not present', () => {
      const user = 'user_1';
      const state = false;
  
      // Update presence status for the user
      PresenceService.setPresence(user, state);
  
      // Assert that userPresent returns false
      expect(PresenceService.isPresent(user)).toBe(false);
    });
  
    it('should throw an error if user does not exist', () => {
      const user = 'non_existent_user';
  
      // Assert that userPresent throws an error when user does not exist
      expect(() => PresenceService.isPresent(user)).toThrow(`User [${user}] does not exist`);
    });

  });



    // Test suite for the isPresent method
  describe('isPresent', () => {

    afterEach(() => {
      // Reset mock entities after test cases
      mockEntities.resetMocks();
    });

    beforeEach(() => {
      // load mock entities before test cases
      mockEntities.setup(entities);
      // Reset PresenceService state before each test case
      PresenceService.initialize();
    });

    it('should return false if no users are present', () => {
      // Update presence status for all users to not present
      const state = false;
      Object.keys(PresenceService.users).forEach(user => {
        PresenceService.setPresence(user, state);
      });
  
      // Assert that isPresent returns false
      expect(PresenceService.isPresent()).toBe(state);
    });
  
    it('should return true if at least one user is present', () => {
      // Update presence status for one user to be present
      const user = getRandomIndex(entities).entity_id.split('.')[1];
      const state = true;
      PresenceService.setPresence(user, state);
  
      // Assert that isPresent returns true
      expect(PresenceService.isPresent()).toBe(state);
    });
  
    // Add more test cases as needed
  });

  // Test suite for the validateUser method
  describe('validateUser', () => {

    afterEach(() => {
      // Reset mock entities after test cases
      mockEntities.resetMocks();
    });

    beforeEach(() => {
      // load mock entities before test cases
      mockEntities.setup(entities);
      // Reset PresenceService state before each test case
      PresenceService.initialize();
    });

    it('should throw an error if user_id is missing', () => {
      const user_id = null;
  
      // Assert that validateUser throws an error when user_id is missing
      expect(() => PresenceService.validateUser(user_id)).toThrowError(`Missing user_id: [${user_id}]`);
    });
  
    it('should throw an error if user does not exist', () => {
      const user_id = 'non_existent_user';
  
      // Assert that validateUser throws an error when user does not exist
      expect(() => PresenceService.validateUser(user_id)).toThrowError(`User [${user_id}] does not exist`);
    });
  
    it('should return user_id if user exists', () => {
      const entity_id = getRandomIndex(entities).entity_id;
      const user_id = entity_id.split('.')[1];

      // Assert that validateUser returns user_id when user_id is specified
      expect(PresenceService.validateUser(user_id)).toBe(user_id);

      // Assert that validateUser returns user_id when entity_id is specified
      expect(PresenceService.validateUser(entity_id)).toBe(user_id);
    });

    // Add more test cases as needed
  });

  // Test suite for the getPresence method
  describe('getPresence', () => {

    afterEach(() => {
      // Reset mock entities after test cases
      mockEntities.resetMocks();
    });

    beforeEach(() => {
      // load mock entities before test cases
      mockEntities.setup(entities);
      // Reset PresenceService state before each test case
      PresenceService.initialize();
    });

    it('should return the presence object for the specified user', () => {
      const user_id = 'user_1';
  
      // Assert that getPresence returns the presence object for the specified user
      expect(PresenceService.getPresence(user_id)).toEqual(PresenceService.users[user_id]);

    });
  
    it('should return the presence object for the system if user_id is not specified', () => {

      const expected_properties = {
        state: null,
        last_updated: null,
        last_present: null,
        user_id: null
      };
      
      // Assert that getPresence returns the presence object for the system
      expect(PresenceService.getPresence()).toEqual(expected_properties);
    });
  
    // Add more test cases as needed
  });

  // Test suite for the isPresent m ethod
  describe('isPresent', () => {

    afterEach(() => {
      // Reset mock entities after test cases
      mockEntities.resetMocks();
    });

    beforeEach(() => {
      // load mock entities before test cases
      mockEntities.setup(entities);
      // Reset PresenceService state before each test case
      PresenceService.initialize();
    });

    it('should return true if the user is present', () => {
      const user = getRandomIndex(entities).entity_id;
      const state = true;
      
      // Update presence status for the user
      PresenceService.setPresence(user, state);
  
      // Assert that isPresent returns true
      expect(PresenceService.isPresent(user)).toBe(true);
    });
  
    it('should return false if the user is not present', () => {
      const user = getRandomIndex(entities).entity_id;
      const state = false;
  
      // Update presence status for the user
      PresenceService.setPresence(user, state);

      // Assert that isPresent returns false
      expect(PresenceService.isPresent(user)).toBe(false);
    });
  
    it('should return true if the system is present', () => {
      const state = true;
      const user = getRandomIndex(entities).entity_id.split('.')[1];
  
      // Set system presence state
      PresenceService.setPresence(user, state);
  
      // Assert that isPresent returns true
      expect(PresenceService.isPresent()).toBe(state);
    });
  
    it('should return false if the system is not present', () => {
      const state = false;

      const user = getRandomIndex(entities).entity_id.split('.')[1];
  
      // Set system presence state
      PresenceService.setPresence(user, state);
  
      // Assert that isPresent returns false
      expect(PresenceService.isPresent()).toBe(state);
    });
  
    // Add more test cases as needed
  });

});
