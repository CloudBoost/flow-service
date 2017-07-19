var exports = module.exports = {};

exports.graphService = require('./graph')();
exports.componentService = require('./component')();
exports.nodeService = require('./node')();
exports.edgeService = require('./edge')();
exports.packageService = require('./package')();
exports.apiService = require('./api')();