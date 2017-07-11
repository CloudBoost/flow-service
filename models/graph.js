var mongoose = require('mongoose'); 

var graph = mongoose.Schema({
    graph           : Object,
    type            : Object,
    description     : String,
    created_on      : Date,
    components		: []
});

module.exports = mongoose.model('graph',graph);