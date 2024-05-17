const fs = require('fs');
const Areas = require('../../../../domain/models/Areas');

jest.mock('fs');

describe('Areas', () => {
  const testAreaId = 'area1';
  const testArea = {
    id: testAreaId,
    other_property: 'other_value',
  };

  beforeAll(() => {
    // Mock the readFileSync method
    fs.readFileSync.mockReturnValue(JSON.stringify({
      data: {
          areas: [testArea] // Assuming testArea is the mock area data
      }
    }));
  });

  afterAll(() => {
    // Restore the original implementation after all tests are done
    jest.restoreAllMocks();
  });

  describe('loadAreaRegistry', () => {
    it('should load the area registry', () => {
      Areas.loadAreaRegistry();
      expect(Areas.areas[testAreaId]).toEqual(testArea);
    });
  });

  describe('getArea', () => {
    it('should return the area with the specified ID', () => {
      const result = Areas.getArea(testAreaId);
      expect(result).toEqual(testArea);
    });

    it('should return undefined for non-existent area ID', () => {
      const result = Areas.getArea('non_existent_area_id');
      expect(result).toBeUndefined();
    });
  });
});
