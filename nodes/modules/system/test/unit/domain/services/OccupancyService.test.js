const { mockAreas, mockEntities } = require('../../../../util/test');
const getRandomIndex = require('../../../../util/test/getRandomIndex');

const OccupancyService = require('../../../../domain/services/OccupancyService');
const { WaitTimerManager, TimeoutConverter } = require('../../../../domain/models');

// Enable fake timers
jest.useFakeTimers();

describe('OccupancyService', () => {

  const areas = [
    { aliases: [], name: "Area 1", id: "area1", picture: null },
    { aliases: [], name: "Area 2", id: "area2", picture: null }
  ];

  const entities = [
    { entity_id: 'binary_sensor.area1_motion', area_id: 'area1' },
    { entity_id: 'binary_sensor.area2_motion', area_id: 'area2' },
  ];

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

  // Test suite for the setOccupancy method
  describe('setOccupancy', () => {

    it('should update the occupancy status for a given area', () => {
      const area_id = getRandomIndex(areas).id;
      const state = true;

      // Update occupancy status for the area
      OccupancyService.setOccupancy(area_id, state);

      // Assert that the occupancy status has been updated
      expect(OccupancyService.areas[area_id].state).toBe(state);

      // Assert that the last occupied area_id has been updated
      expect(OccupancyService.area_id).toBe(area_id);
    });

    it('should throw an error if the area does not exist', () => {
      const area_id = 'BOGUS';
      expect(() => OccupancyService.setOccupancy(area_id, true)).toThrow(`Area ${area_id} does not exist`);
    });

    // Add more test cases as needed

  });

  // Test suite for the _setOccupancy method
  describe('_setOccupancy', () => {

    it('should set the occupancy state for a given area', () => {
      const area_id = getRandomIndex(areas).id;

      // Set occupancy state for the area to true (no state and timestamp)
      OccupancyService._setOccupancy(area_id);

      // Assert that the occupancy state has been set
      expect(OccupancyService.areas[area_id].state).toBe(true);

      const timestamp = Date.now();

      // Set occupancy state for the area to false (with state and timestamp)
      OccupancyService._setOccupancy(area_id, false, timestamp);

      // Assert that the occupancy state has been set
      expect(OccupancyService.areas[area_id].state).toBe(false);
      expect(OccupancyService.areas[area_id].last_occupied).toStrictEqual(new Date(timestamp));
      expect(OccupancyService.areas[area_id].last_updated).toStrictEqual(new Date(timestamp));
    });

    // Add more test cases as needed

  });

  // Test suite for the isOccupied method
  describe('isOccupied', () => {

    it('should return true if the area is occupied', () => {
      const area_id = getRandomIndex(areas).id;
      const state = true;

      // Set occupancy state for the area
      OccupancyService.setOccupancy(area_id, state);

      // Assert that the area is considered occupied
      expect(OccupancyService.areas[area_id].state).toBe(state);
    });

    // Add more test cases as needed

  });

  // Test suite for the getMode method
  describe('getMode', () => {
    it('should return the correct occupancy mode', () => {
      const mode = 'AUTOMATIC';

      // Manually Set the occupancy mode
      OccupancyService.mode = mode;

      // Get the occupancy mode
      const occupancy_mode = OccupancyService.getMode();

      // Assert that the occupancy mode has been retrieved
      expect(occupancy_mode).toBe(mode);
    });

  });

  // Test suite for the setMode method
  describe('setMode', () => {

    it('should set the provided occupancy mode', () => {
      const mode = 'AUTOMATIC';

      // Set the occupancy mode
      OccupancyService.setMode(mode);

      // Assert that the occupancy mode has been set
      expect(OccupancyService.mode).toBe(mode);
    });
    
  });

  // Test suite for waitForTimeout method
  describe('waitForTimeout', () => {

    it('should create a wait timer for the specified area with the provided timeout', () => {
      const area_id = getRandomIndex(areas).id;
      const timeout = '500 milliseconds'; // Timeout in seconds
    
      OccupancyService.setTimeout(timeout, area_id);
    
      // Call the waitForTimeout method
      OccupancyService.waitForTimeout(area_id);
    
      // Calculate timeout in milliseconds
      const timeoutInMilliseconds = TimeoutConverter.convertTimeoutString(timeout);
    
      // Get the timer object from WaitTimerManager
      const timerId = `OccupancyService_${area_id}`;
      const timer = WaitTimerManager.timers[timerId];
    
      // Check if the wait timer was created
      expect(timer).toBeDefined();

      // Assert that the wait timer was created with the correct timeout
      expect(timer["ref"]).toEqual(expect.any(Function));
      expect(OccupancyService.timeout).toBe(timeoutInMilliseconds)
    });
    
    it('should execute the callback function when the timer expires', () => {
      const area_id = getRandomIndex(areas).id;
      const timeout = '500 milliseconds'; // Timeout in seconds
    
      // Mock the _setOccupancy method
      const _setOccupancyMock = jest.spyOn(OccupancyService, '_setOccupancy');
    
      OccupancyService.setTimeout(timeout, area_id);
    
      // Call the waitForTimeout method
      OccupancyService.waitForTimeout(area_id);

      // Calculate timeout in milliseconds
      const timeoutInMilliseconds = TimeoutConverter.convertTimeoutString(timeout);
    
      // Fast-forward time by 500 milliseconds
      jest.advanceTimersByTime(timeoutInMilliseconds);
    
      // Check if the _setOccupancy method was called
      expect(_setOccupancyMock).toHaveBeenCalledWith(area_id, false);
    
      // Restore the original _setOccupancy method
      _setOccupancyMock.mockRestore();
    });

    it('should not execute the callback function before the timer expires', () => {
      const area_id = getRandomIndex(areas).id;
      const timeout = '500 milliseconds'; // Timeout in milliseconds
    
      // Mock the _setOccupancy method
      const _setOccupancyMock = jest.spyOn(OccupancyService, '_setOccupancy');
    
      OccupancyService.setTimeout(timeout, area_id);
    
      // Call the waitForTimeout method
      OccupancyService.waitForTimeout(area_id);
    
      // Calculate timeout in milliseconds
      const timeoutInMilliseconds = TimeoutConverter.convertTimeoutString(timeout);
    
      // Fast-forward time by less than the timeout duration
      jest.advanceTimersByTime(timeoutInMilliseconds - 1);
    
      // Check if the _setOccupancy method was not called before timeout
      expect(_setOccupancyMock).not.toHaveBeenCalled();
    
      // Fast-forward time by the remaining time until the timeout
      jest.advanceTimersByTime(1);
    
      // Check if the _setOccupancy method was called after timeout
      expect(_setOccupancyMock).toHaveBeenCalledWith(area_id, false);
    
      // Restore the original _setOccupancy method
      _setOccupancyMock.mockRestore();
    });
    

    it('should not create a wait timer if no timeout is provided', () => {
      const area_id = getRandomIndex(areas).id;

      // Call the waitForTimeout method without providing a timeout
      OccupancyService.waitForTimeout(area_id);

      // Check if the wait timer was not created
      const timerId = `OccupancyService_${area_id}`;
      const timer = WaitTimerManager.timers[timerId];

      // Assert that the wait timer was not created
      expect(timer).toBeUndefined();
    });

  });

  describe('getTimeout', () => {

    it('should return the timeout for a specific area if set', () => {
      // Test with string value

      let area_id = 'area1';
      let timeout = '30 seconds';
      let expectedTimeout = 30000;
  
      // Set timeout for the area
      OccupancyService.setTimeout(expectedTimeout, area_id);
  
      // Call getTimeout method for the area
      let result = OccupancyService.getTimeout(area_id);
  
      // Assert that the timeout matches the expected value
      expect(result).toBe(expectedTimeout);

      // Test with integer value

      area_id = 'area2';
      timeout = 30000;
  
      // Set timeout for the area
      OccupancyService.setTimeout(expectedTimeout, area_id);
  
      // Call getTimeout method for the area
      result = OccupancyService.getTimeout(area_id);
  
      // Assert that the timeout matches the expected value
      expect(result).toBe(expectedTimeout);
    });
  
    it('should return the global timeout if no timeout is set for the area', () => {
      const entity = getRandomIndex(entities);


      const globalTimeout = 60000;
  
      // Set global timeout
      OccupancyService.setTimeout(globalTimeout);
  
      // Call getTimeout method without specifying an area
      const timeout = OccupancyService.getTimeout(entity.area_id);
  
      // Assert that the timeout matches the global timeout
      expect(timeout).toBe(globalTimeout);
    });
  
    it('should return null if neither area nor global timeout is set', () => {
      // Call getTimeout method without setting any timeouts
      const timeout = OccupancyService.getTimeout();
  
      // Assert that the timeout is undefined
      expect(timeout).toBeUndefined();
    });

  });

});