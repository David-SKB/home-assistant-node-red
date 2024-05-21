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

module.exports = ContextMonitor;