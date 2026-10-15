const fs = require('fs');
const Areas = require('../../../../domain/models/Areas');
const mockAreas = require('../../../../util/test/mockAreas');

// Mock fs.readFileSync
jest.mock('fs');

// Create a spy on the loadAreaRegistry method of Areas
jest.spyOn(Areas, 'loadAreaRegistry');

describe('mockAreas', () => {

  afterEach(() => {
    // Reset all mocks after each test
    mockAreas.resetMocks();
  });

  it('should set up mock data for areas and trigger loadAreaRegistry', () => {
    // Define mock area data
    const areasData = [
      { area_id: 'test_area1', other_property: 'mock_value1' },
      { area_id: 'test_area2', other_property: 'mock_value2' }
    ];

    // Set up mock data and trigger loadAreaRegistry
    mockAreas.setup(areasData);

    // Check if readFileSync is called with the correct parameters
    expect(fs.readFileSync).toHaveBeenCalledWith('/config/.storage/core.area_registry', 'utf8');

    // Check if loadAreaRegistry is triggered
    expect(Areas.loadAreaRegistry).toHaveBeenCalled();
  });

  // should check if area data is loaded
  it('should load area data', () => {
    // Define mock area data
    const areasData = [
      { aliases: [], name: "Area 1", id: "area1", picture: null },
      { aliases: [], name: "Area 2", id: "area2", picture: null },
      { aliases: [], name: "Area 3", id: "area3", picture: null }
    ];

    // Set up mock data and trigger loadAreaRegistry
    mockAreas.setup(areasData);

    // Check if readFileSync is called with the correct parameters
    expect(fs.readFileSync).toHaveBeenCalledWith('/config/.storage/core.area_registry', 'utf8');

    // Check if loadAreaRegistry is triggered
    expect(Areas.loadAreaRegistry).toHaveBeenCalled();

    const expected = { 
    "area1": { "aliases": [], "name": "Area 1", "id": "area1", "picture": null }, 
    "area2": { "aliases": [], "name": "Area 2", "id": "area2", "picture": null },
    "area3": { "aliases": [], "name": "Area 3", "id": "area3", "picture": null },
    }

    // Check if area data is loaded
    expect(Areas.getAreas()).toEqual(expected);
  });

  it('should reset all mocked methods of Areas', () => {
    // Define mock area data
    const areasData = [
      { aliases: [], name: "Area 1", id: "area1", picture: null },
      { aliases: [], name: "Area 2", id: "area2", picture: null },
      { aliases: [], name: "Area 3", id: "area3", picture: null }
    ];

    // Set up mock data and trigger loadAreaRegistry
    mockAreas.setup(areasData);

    expect(fs.readFileSync).toHaveBeenCalledTimes(1);

    // Reset mocks
    mockAreas.resetMocks();

    // Check if readFileSync mock is restored
    expect(fs.readFileSync).toHaveBeenCalledTimes(0);
  });
});