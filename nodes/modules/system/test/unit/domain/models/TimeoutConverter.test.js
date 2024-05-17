const TimeoutConverter = require('../../../../domain/models/TimeoutConverter');

describe('TimeoutConverter', () => {
  describe('convertTimeoutString', () => {
    it('should convert timeout string with numeric value and recognized unit', () => {
      expect(TimeoutConverter.convertTimeoutString('10 seconds')).toBe(10000);
      expect(TimeoutConverter.convertTimeoutString('500 milliseconds')).toBe(500);

    });

    it('should convert timeout string with integer value', () => {
      expect(TimeoutConverter.convertTimeoutString(10000)).toBe(10000);
    });

    it('should default to minutes if unit is not recognized', () => {
      TimeoutConverter.DEFAULT_UNIT = 'M';
      expect(TimeoutConverter.convertTimeoutString('5 unknown')).toBe(300000);
    });

    it('should default to string value if no unit provided', () => {
      expect(TimeoutConverter.convertTimeoutString('10')).toBe(10);
    });

    it('should return 0 if no value provided', () => {
      expect(TimeoutConverter.convertTimeoutString('')).toBe(0);
    });

    it('should return 0 if invalid value provided', () => {
      expect(TimeoutConverter.convertTimeoutString('invalid')).toBe(0);
    });
  });

  describe('getValue', () => {
    it('should return integer value if provided', () => {
      expect(TimeoutConverter.getValue('10')).toBe(10);
    });

    it('should return mapped value if string value provided', () => {
      expect(TimeoutConverter.getValue('low')).toBe(15);
    });

    it('should return 0 if value is invalid', () => {
      expect(TimeoutConverter.getValue('invalid')).toBe(0);
    });
  });

  describe('getUnit', () => {
    it('should return recognized unit if provided', () => {
      expect(TimeoutConverter.getUnit('minute')).toBe('M');
    });

    it('should return empty string if unit is not recognized', () => {
      expect(TimeoutConverter.getUnit('unknown')).toBe('');
    });

    it('should return empty string if no unit provided', () => {
      expect(TimeoutConverter.getUnit('')).toBe('');
    });
  });

  describe('convertToMilliseconds', () => {
    it('should convert value to milliseconds using recognized unit', () => {
      expect(TimeoutConverter.convertToMilliseconds(5, 'M')).toBe(300000);
    });

    it('should default to minutes if unit is not recognized', () => {
      TimeoutConverter.DEFAULT_UNIT = 'M';
      expect(TimeoutConverter.convertToMilliseconds(5, 'unknown')).toBe(300000);
    });

    it('should default to minutes if no unit provided', () => {
      TimeoutConverter.DEFAULT_UNIT = 'M';
      expect(TimeoutConverter.convertToMilliseconds(5, '')).toBe(300000);
    });
  });
});
