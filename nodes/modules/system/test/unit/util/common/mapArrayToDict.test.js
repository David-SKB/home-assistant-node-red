const mapArrayToDict = require('../../../../util/common/mapArrayToDict');

describe('mapArrayToDict', () => {
  it('should return an empty object for an empty array', () => {
    const result = mapArrayToDict([], 'id');
    expect(result).toEqual({});
  });

  it('should return a dictionary with correct key-value pairs', () => {
    const array = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' }
    ];

    const result = mapArrayToDict(array, 'id');
    expect(result).toEqual({
      1: { id: 1, name: 'Alice' },
      2: { id: 2, name: 'Bob' },
      3: { id: 3, name: 'Charlie' }
    });
  });

  it('should handle arrays with duplicate keys by overwriting', () => {
    const array = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 1, name: 'Charlie' } // Duplicate key
    ];

    const result = mapArrayToDict(array, 'id');
    expect(result).toEqual({
      1: { id: 1, name: 'Charlie' }, // Overwritten
      2: { id: 2, name: 'Bob' }
    });
  });

  it('should handle keys that do not exist in every object', () => {
    const array = [
      { id: 1, name: 'Alice' },
      { name: 'Bob' }, // No 'id' key
      { id: 3, name: 'Charlie' }
    ];

    const result = mapArrayToDict(array, 'id');
    expect(result).toEqual({
      1: { id: 1, name: 'Alice' },
      3: { id: 3, name: 'Charlie' }
    });
  });
});
