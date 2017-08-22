var mongoose = require('mongoose');

var graph = mongoose.Schema({
    name: { //name of the graph
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        required: true
    },
    description: {
        type: String,
        required: true
    },
    nodes: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
        required: true
    },
    edges: [{
        type: mongoose.Schema.Types.Mixed,
        default: [],
        required: true
    }],
    components: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
        required: true,
        default: {}
    },
    type: {
        type: mongoose.Schema.Types.Mixed
    },
    graph: {
        type: mongoose.Schema.Types.Mixed
    }
});

module.exports = mongoose.model('graph', graph);