const getState = require('../../../../util/common/getState');

describe('getState', () => {
  const states = {
    'light.living_room': 'on',
    'switch.bedroom': 'off',
    'sensor.temperature': 25.5
  };

  it('should throw an error if states object is not provided', () => {
    expect(() => getState('light.living_room')).toThrow('States object not provided');
  });

  it('should throw an error for an invalid entity ID', () => {
    expect(() => getState('invalid_entity_id', states)).toThrow('Invalid entity ID: invalid_entity_id');
  });

  it('should return the state for a valid entity ID', () => {
    expect(getState('light.living_room', states)).toBe('on');
    expect(getState('switch.bedroom', states)).toBe('off');
    expect(getState('sensor.temperature', states)).toBe(25.5);
  });
});
