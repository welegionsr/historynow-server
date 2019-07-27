const mongoose = require('mongoose');

const eraSchema = mongoose.Schema({
    name: {type: String, required: true}
});

const Era = mongoose.model('era', eraSchema);
module.exports = {
    Era
}