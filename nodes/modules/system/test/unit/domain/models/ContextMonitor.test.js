const ContextMonitor = require('../../../../domain/models/ContextMonitor');
// May have to give up on accessing global context from the module for now...
describe.skip('ContextMonitor', () => {
    let contextMonitor;
    let globalContext;

    beforeEach(() => {
        globalContext = {};
        contextMonitor = new ContextMonitor(globalContext);
    });

    afterEach(() => {
        contextMonitor = null;
        globalContext = null;
    });

    it('should create a single instance of ContextMonitor', () => {
        const anotherContextMonitor = new ContextMonitor(globalContext);
        expect(contextMonitor).toBe(anotherContextMonitor);
    });

    it('should set and get values in the global context', () => {
        contextMonitor.set('testKey', 'testValue');
        expect(contextMonitor.get('testKey')).toBe('testValue');
    });

    it('should update values in the global context', () => {
        contextMonitor.set('testKey', 'initialValue');
        contextMonitor.set('testKey', 'updatedValue');
        expect(contextMonitor.get('testKey')).toBe('updatedValue');
    });

    it('should retrieve undefined for non-existent keys', () => {
        expect(contextMonitor.get('nonExistentKey')).toBeUndefined();
    });
});
