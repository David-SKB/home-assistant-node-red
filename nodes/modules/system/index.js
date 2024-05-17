const domain = require('./domain');
const adapters = require('./adapters');
const ports = require('./ports');
const util = require('./util');

var system = {
    domain,
    adapters,
    ports,
    util
};

module.exports = system;