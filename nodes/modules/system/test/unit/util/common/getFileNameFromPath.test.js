const getFileNameFromPath = require('../../../../util/common/getFileNameFromPath');

describe('getFileNameFromPath', () => {
  it('should return the file name for a path with forward slashes', () => {
    const filePath = 'path/to/file.txt';
    const expectedFileName = 'file.txt';
    expect(getFileNameFromPath(filePath)).toBe(expectedFileName);
  });

  it('should return the file name for a path with backward slashes', () => {
    const filePath = 'path\\to\\file.txt';
    const expectedFileName = 'file.txt';
    expect(getFileNameFromPath(filePath)).toBe(expectedFileName);
  });

  it('should return the file name for a path with mixed slashes', () => {
    const filePath = 'path/to\\file.txt';
    const expectedFileName = 'file.txt';
    expect(getFileNameFromPath(filePath)).toBe(expectedFileName);
  });

  it('should return the file name for a path with no directory', () => {
    const filePath = 'file.txt';
    const expectedFileName = 'file.txt';
    expect(getFileNameFromPath(filePath)).toBe(expectedFileName);
  });

  it('should return an empty string for an empty path', () => {
    const filePath = '';
    const expectedFileName = '';
    expect(getFileNameFromPath(filePath)).toBe(expectedFileName);
  });
});