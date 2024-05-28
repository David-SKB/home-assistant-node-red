const {mockAreas, mockEntities} = require('../../util/test');
const getRandomIndex = require('../../util/test/getRandomIndex');

const OccupancyService = require('../../domain/services/OccupancyService');
const { TimeoutConverter, OccupancyEvent, WaitTimerManager } = require('../../domain/models');

// Enable fake timers
jest.useFakeTimers();

describe('OccupancyService', () => {

  const areas = [
    { aliases: [], name: "Area 1", id: "area1", picture: null },
    { aliases: [], name: "Area 2", id: "area2", picture: null },
    { aliases: [], name: "Area 3", id: "area3", picture: null },
    { aliases: [], name: "Area 4", id: "area4", picture: null },
    { aliases: [], name: "Area 5", id: "area5", picture: null }
  ];

  const entities = [
    { entity_id: 'binary_sensor.area1_motion', area_id: 'area1' },
    { entity_id: 'binary_sensor.area2_motion', area_id: 'area2' },
    { entity_id: 'binary_sensor.area3_motion', area_id: 'area3' },
    { entity_id: 'binary_sensor.area4_motion', area_id: 'area4' },
    { entity_id: 'binary_sensor.area5_motion', area_id: 'area5' },
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

  describe('Occupancy status is updated via a OccupancyService object', () => {

    it('should set the area to unoccupied when the timer expires', () => {
      const area_id = getRandomIndex(areas).id;
      const timeout = '500 milliseconds';
      const timeoutInMilliseconds = TimeoutConverter.convertTimeoutString(timeout);

      // Mock the _setOccupancy method
      const _setOccupancyMock = jest.spyOn(OccupancyService, '_setOccupancy');

      // Mock the waitForTimeout method
      const waitForTimeoutMock = jest.spyOn(OccupancyService, 'waitForTimeout');

      // Set the timeout for the area
      OccupancyService.setTimeout(timeout, area_id);

      /** OCCUPIED **/ 

      const occupied_timestamp = Date.now();

      // Update occupancy status for the area
      OccupancyService.setOccupancy(area_id, true, occupied_timestamp);

      // Check if the _setOccupancy method was called
      expect(_setOccupancyMock).toHaveBeenCalledWith(area_id, true, occupied_timestamp);

      // Check if the waitForTimeout method was not called
      expect(waitForTimeoutMock).not.toHaveBeenCalled();

      // Assert that the occupancy status has been updated
      expect(OccupancyService.areas[area_id].state).toBe(true);

      // Assert that the last occupied area_id has been updated
      expect(OccupancyService.area_id).toBe(area_id);

      /** UNOCCUPIED **/

      // Wait a second before updating occupancy status for the area again
      jest.advanceTimersByTime(1000);
      const unoccupied_timestamp = Date.now();

      // Update occupancy status for the area
      OccupancyService.setOccupancy(area_id, false, unoccupied_timestamp);

      // Check if the waitForTimeout method was called
      expect(waitForTimeoutMock).toHaveBeenCalledWith(area_id, timeoutInMilliseconds);

      // Fast-forward time by timeout
      jest.advanceTimersByTime(timeoutInMilliseconds);
    
      // Check if the _setOccupancy method was called
      expect(_setOccupancyMock).toHaveBeenCalledWith(area_id, false);

      // Check that the waitForTimeout method was not called again
      expect(waitForTimeoutMock).toHaveBeenCalledTimes(1);

      // Check if the area is unoccupied after timeout
      expect(OccupancyService.areas[area_id].state).toBe(false);
      
      // Check if the last_occupied timestamp has been updated
      const last_updated_timestamp = unoccupied_timestamp + timeoutInMilliseconds;
      expect(OccupancyService.areas[area_id].last_occupied).toStrictEqual(new Date(last_updated_timestamp));
      expect(OccupancyService.last_occupied).toStrictEqual(new Date(last_updated_timestamp));

      // Restore mocks
      _setOccupancyMock.mockRestore();
      waitForTimeoutMock.mockRestore();
    });

    it('should throw an error if the area does not exist', () => {
      const entity = JSON.parse(JSON.stringify(getRandomIndex(entities)));
      entity.area_id = 'BOGUS';
      const occupancyEvent = new OccupancyEvent(entity.entity_id, entity.area_id, Date.now(), 'on');
      expect(() => OccupancyService.setOccupancy(occupancyEvent)).toThrow(`Area ${entity.area_id} does not exist`);
    });
    // Unable to test due to timer callback not executing within the correct context for some reason...
    it.skip('should set the occupancy for multiple areas and timeout after the set value', () => {

      const entity_1 = entities[0];
      const entity_2 = entities[1];

      const timeout = '20 seconds';
      const timeoutInMilliseconds = TimeoutConverter.convertTimeoutString(timeout);

      // Mock the _setOccupancy method
      const _setOccupancyMock = jest.spyOn(OccupancyService, '_setOccupancy');

      // Mock the waitForTimeout method
      const waitForTimeoutMock = jest.spyOn(OccupancyService, 'waitForTimeout');

      const event_data = [
        {
          entity_id: entities[0].entity_id,
          area_id: entities[0].area_id,
          last_updated: new Date().toISOString(),
          state: 'on'
        },
        {
          entity_id: entities[1].entity_id,
          area_id: entities[1].area_id,
          last_updated: new Date().toISOString(),
          state: 'on'
        }
      ];

      // Set the global/area timeout
      OccupancyService.setTimeout(timeout);
      OccupancyService.setTimeout(timeout, areas[0].id);

      // Assert that the timeout has been set
      expect(OccupancyService.timeout).toBe(timeoutInMilliseconds);
      expect(OccupancyService.areas[areas[0].id].timeout).toBe(timeoutInMilliseconds);
      expect(OccupancyService.areas[areas[1].id].timeout).toBeUndefined();

      // Update occupancy status for the first area
      OccupancyService.setOccupancy(new OccupancyEvent(event_data[0]));

      // Wait 5 seconds before updating occupancy status again
      jest.advanceTimersByTime(500);

      // Update occupancy status for the second area
      OccupancyService.setOccupancy(new OccupancyEvent(event_data[1]));

      // Wait 10 seconds before updating occupancy status again
      jest.advanceTimersByTime(1000);

      event_data[0].state = 'off';

      // Update occupancy status for the first area
      OccupancyService.setOccupancy(new OccupancyEvent(event_data[0]));

      // Wait 5 seconds before updating occupancy status again
      jest.advanceTimersByTime(500);

      event_data[1].state = 'off';

      // Update occupancy status for the second area
      OccupancyService.setOccupancy(new OccupancyEvent(event_data[1]));

      // Assert that the occupancy status has been updated
      expect(OccupancyService.areas[event_data[0].area_id].state).toBe(true);
      expect(OccupancyService.areas[event_data[1].area_id].state).toBe(true);

      // Wait 20 seconds before checking occupancy status
      jest.advanceTimersByTime(2000);

      // Assert that the occupancy status has been updated
      expect(OccupancyService.areas[event_data[0].area_id].state).toBe(false);
      expect(OccupancyService.areas[event_data[1].area_id].state).toBe(false);

      // Assert that the last occupied area_id has been updated
      expect(OccupancyService.area_id).toBe(event_data[1].area_id);

      // Restore mocks
      _setOccupancyMock.mockRestore();
      waitForTimeoutMock.mockRestore();
    });

    // Add more test cases as needed

  });

});