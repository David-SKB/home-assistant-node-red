const exists = require('../../../../util/common/exists');

describe('exists', () => {
  it('should return false for an empty string', () => {
    expect(exists('')).toBe(false);
  });

  it('should return false for null', () => {
    expect(exists(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    let undefinedValue;
    expect(exists(undefinedValue)).toBe(false);
  });

  it('should return false for an empty object', () => {
    expect(exists({})).toBe(false);
  });

  it('should return true for non-empty strings', () => {
    expect(exists('hello')).toBe(true);
  });

  it('should return true for non-null values', () => {
    expect(exists(42)).toBe(true);
  });

  it('should return true for non-undefined values', () => {
    let definedValue = 'defined';
    expect(exists(definedValue)).toBe(true);
  });

  it('should return true for non-empty objects', () => {
    const obj = { key: 'value' };
    expect(exists(obj)).toBe(true);
  });

  it('should return true for all boolean values', () => {
    let booleanValue = false;
    expect(exists(booleanValue)).toBe(true);
    booleanValue = false;
    expect(exists(booleanValue)).toBe(true);
  });
});