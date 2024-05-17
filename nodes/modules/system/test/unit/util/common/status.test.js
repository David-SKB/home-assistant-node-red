const status = require('../../../../util/common/status');

const default_properties = {shape: 'dot', fill: 'green'};

describe('status', () => {
  it('should return a status object with default properties when only message is provided', () => {
    const message = 'Test message';
    const result = status(message);
    expect(result).toEqual({
      payload: {
        ...default_properties,
        text: message
      }
    });
  });

  it('should return a status object with custom properties when both message and properties are provided', () => {
    const message = 'Test message';
    const custom_properties = { fill: 'red', shape: 'ring' };
    const result = status(message, custom_properties);
    expect(result).toEqual({
      payload: {
        ...custom_properties,
        text: message
      }
    });
  });

  it('should override default properties with custom properties', () => {
    const message = 'Test message';
    const custom_properties = { fill: 'blue' };
    const result = status(message, custom_properties);
    expect(result).toEqual({
      payload: {
        fill: 'blue',
        shape: 'dot',
        text: message
      }
    });
  });

  it('should return a status object with additional properties when provided', () => {
    const message = 'Test message';
    const additional_properties = { timestamp: Date.now() };
    const result = status(message, additional_properties);
    expect(result).toEqual({
      payload: {
        ...additional_properties,
        ...default_properties,
        text: message
      }
    });
  });
});
