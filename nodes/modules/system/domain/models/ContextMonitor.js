class ContextMonitor {
    constructor(global_context) {
        if (!ContextMonitor.instance) {
            this.global_context = global_context;
            ContextMonitor.instance = this;
        }
        return ContextMonitor.instance;
    }

    static initialize(global_context) {
        return ContextMonitor.instance || new ContextMonitor(global_context);
    }

    set(key, value) {
        this.global_context.set(key, value);
    }

    get(key) {
        return this.global_context.get(key);
    }
}

// // Example usage:
// const global_context = {}; // Your global context object
// const ContextMonitor = ContextMonitor.initialize(global_context);

// // Set a value in the global context
// ContextMonitor.set('exampleKey', 'exampleValue');

// // Get a value from the global context
// const value = ContextMonitor.get('exampleKey');
// console.log(value); // Output: 'exampleValue'


module.exports = ContextMonitor;