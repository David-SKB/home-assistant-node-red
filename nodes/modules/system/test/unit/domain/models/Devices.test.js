const fs = require('fs');
const Devices = require('../../../../domain/models/Devices');

jest.mock('fs');

describe('Devices', () => {
  const testDeviceId = 'device1';
  const testDevice = {
    id: testDeviceId,
    other_property: 'other_value',
  };
  const testDevice2 = {
    id: 'device2',
    other_property: 'other_value',
  };

  beforeAll(() => {
    // Mock the readFileSync method
    fs.readFileSync.mockReturnValue(JSON.stringify({
      data: {
        devices: [testDevice, testDevice2] // Assuming testDevice is the mock device data
      }
    }));
  });

  afterAll(() => {
    // Restore the original implementation after all tests are done
    jest.restoreAllMocks();
  });

  describe('loadDeviceRegistry', () => {
    it('should load the device registry', () => {
      Devices.loadDeviceRegistry();
      expect(Devices.devices[testDeviceId]).toEqual(testDevice);
    });
  });

  describe('getDevice', () => {
    it('should return the device with the specified ID', () => {
      const result = Devices.getDevice(testDeviceId);
      expect(result).toEqual(testDevice);
    });

    it('should return undefined for non-existent device ID', () => {
      const result = Devices.getDevice('non_existent_device_id');
      expect(result).toBeUndefined();
    });
  });
});
