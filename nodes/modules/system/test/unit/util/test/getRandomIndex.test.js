const getRandomIndex = require('../../../../util/test/getRandomIndex');

describe('getRandomIndex', () => {
  it('should return a random index within the bounds of the array length', () => {
    const array = [1, 2, 3, 4, 5];
    const numberOfTests = 100; // Number of times to test

    for (let i = 0; i < numberOfTests; i++) {
      const index = getRandomIndex(array);
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThanOrEqual(array.length);
      expect(array.includes(index)).toBe(true); // Ensure the index is in the array
    }
  });

  it('should throw an error if the input is not a non-empty array', () => {
    expect(() => getRandomIndex()).toThrow();
    expect(() => getRandomIndex(123)).toThrow();
    expect(() => getRandomIndex([])).toThrow();
    expect(() => getRandomIndex({})).toThrow();
    expect(() => getRandomIndex('string')).toThrow();
  });
});
