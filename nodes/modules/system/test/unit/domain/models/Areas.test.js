const fs = require('fs');
const mockAreas = require('../../../../util/test/mockAreas');
const Areas = require('../../../../domain/models/Areas');
const { mapArrayToDict } = require('../../../../util/common');


jest.mock('fs');

describe('Areas', () => {

  const areas = [
    { aliases: [], name: "Area 1", id: "area1", picture: null },
    { aliases: [], name: "Area 2", id: "area2", picture: null },
    { aliases: [], name: "Area 3", id: "area3", picture: null }
  ];
  beforeEach(() => {
    // Mock the readFileSync method
    mockAreas.setup(areas);
  });

  afterEach(() => {
    // Restore the original implementation after all tests are done
    mockAreas.resetMocks();
  });

  describe('loadAreaRegistry', () => {

    it('should load the area registry', () => {
      const area = areas[0];
      Areas.loadAreaRegistry();
      expect(Areas.areas[area.id]).toEqual(area);
    });

  });

  describe('getArea', () => {

    it('should return the area with the specified ID', () => {
      const area = areas[0];
      const result = Areas.getArea(area.id);
      expect(result).toEqual(area);
    });

    it('should return undefined for non-existent area ID', () => {
      const result = Areas.getArea('non_existent_area_id');
      expect(result).toBeUndefined();
    });

  });

  describe('getAreas', () => {

    it('should return the list of areas', () => {
      const result = Areas.getAreas();
      const expected = mapArrayToDict(areas, "id");
      expect(result).toEqual(expected);
    });

    it('should return an empty object if the area registry is empty', () => {
      mockAreas.resetMocks();
      mockAreas.setup([]);
      const result = Areas.getAreas();
      expect(result).toEqual({});
    });

  });

  describe('getAreaRegistry', () => {

    it('should return the area registry', () => {
      const result = Areas.getAreaRegistry();
      const expected = areas;
      expect(result).toEqual(expected);
    });

    it('should return an empty array if the area registry is empty', () => {
      mockAreas.resetMocks();
      mockAreas.setup([]);
      const result = Areas.getAreaRegistry();
      expect(result).toEqual([]);
    });

  });

});
