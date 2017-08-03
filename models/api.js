var mongoose = require('mongoose');

var schema = mongoose.Schema({
    name: { //name of the api
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
    route: { //route of the api /a/bc/def
        type: String,
        required: true
    },
    components: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
        required: true
    },type: {
        type: String,
        default: "API",
        required: true
    },
    graphId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'graph'
    },
    requestType: {
        type: String,
        required: true,
        default: 'POST'
    }
});

module.exports = mongoose.model('api', schema);