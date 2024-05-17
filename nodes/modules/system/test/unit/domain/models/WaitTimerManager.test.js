const WaitTimerManager = require('../../../../domain/models/WaitTimerManager');

// Enable fake timers
jest.useFakeTimers();

describe('WaitTimerManager', () => {
  beforeEach(() => {
    // Clear all timers before each test
    WaitTimerManager.timers = {};
  });

  describe('createWaitTimer', () => {
    it('should create a wait timer with the provided ID, callback, and timeout', () => {
      const id = 'test_timer';
      const callback = jest.fn();
      const timeout = 1000;

      WaitTimerManager.createWaitTimer(id, callback, timeout);

      // Check if the timer is created
      expect(WaitTimerManager.timers[id]).toBeDefined();

      // Fast-forward time to trigger the callback
      jest.advanceTimersByTime(timeout);

      // Check if the callback is called
      expect(callback).toHaveBeenCalled();

      // Check if the timer is cleared after callback execution
      expect(WaitTimerManager.timers[id]).toBeUndefined();
    });

    it('should throw an error if ID is not provided', () => {
      const callback = jest.fn();
      const timeout = 1000;

      expect(() => {
        WaitTimerManager.createWaitTimer(null, callback, timeout);
      }).toThrow('Invalid ID: null');
    });

    it('should throw an error if callback is not provided', () => {
      const id = 'test_timer';
      const timeout = 1000;

      expect(() => {
        WaitTimerManager.createWaitTimer(id, null, timeout);
      }).toThrow('Callback is not provided');
    });

    it('should throw an error if timeout is not provided', () => {
      const id = 'test_timer';
      const callback = jest.fn();

      expect(() => {
        WaitTimerManager.createWaitTimer(id, callback, null);
      }).toThrow('Invalid timeout: null');
    });

    it('should throw an error if timeout is negative', () => {
      const id = 'test_timer';
      const callback = jest.fn();
      const timeout = -1000;

      expect(() => {
        WaitTimerManager.createWaitTimer(id, callback, timeout);
      }).toThrow('Invalid timeout: -1000');
    });
  });

  describe('clearWaitTimer', () => {
    it('should clear the wait timer with the provided ID', () => {
      const id = 'test_timer';
      const timeout = 1000;

      // Create a wait timer
      WaitTimerManager.createWaitTimer(id, jest.fn(), timeout);

      // Check if the timer is created
      expect(WaitTimerManager.timers[id]).toBeDefined();

      // Clear the timer
      WaitTimerManager.clearWaitTimer(id);

      // Check if the timer is cleared
      expect(WaitTimerManager.timers[id]).toBeUndefined();
    });

    it('should do nothing if the wait timer with the provided ID does not exist', () => {
      const id = 'non_existent_timer';

      // Clear a non-existent timer
      WaitTimerManager.clearWaitTimer(id);

      // Check if no error occurs
      expect(WaitTimerManager.timers[id]).toBeUndefined();
    });

    it('should clear the wait timer if it is currently running', () => {
      const id = 'test_timer';
      const timeout = 1000;

      // Create a wait timer
      WaitTimerManager.createWaitTimer(id, jest.fn(), timeout);

      // Check if the timer is created
      expect(WaitTimerManager.timers[id]).toBeDefined();

      // Fast-forward time to trigger the callback
      jest.advanceTimersByTime(timeout / 2);

      // Clear the timer while it's running
      WaitTimerManager.clearWaitTimer(id);

      // Check if the timer is cleared
      expect(WaitTimerManager.timers[id]).toBeUndefined();
    });

    it('should handle clearing timers in different orders', () => {
      const id1 = 'timer1';
      const id2 = 'timer2';
      const timeout = 1000;

      // Create two wait timers
      WaitTimerManager.createWaitTimer(id1, jest.fn(), timeout);
      WaitTimerManager.createWaitTimer(id2, jest.fn(), timeout);

      // Clear the timers in reverse order
      WaitTimerManager.clearWaitTimer(id2);
      WaitTimerManager.clearWaitTimer(id1);

      // Check if both timers are cleared
      expect(WaitTimerManager.timers[id1]).toBeUndefined();
      expect(WaitTimerManager.timers[id2]).toBeUndefined();
    });
  });
});
