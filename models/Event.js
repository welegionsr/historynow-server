const mongoose = require('mongoose');
const { Era } = require('./Era');

const eventSchema = mongoose.Schema({
    typeOfEvent: {type: Number, default: 1},
    country: {type: String, default: 'Not stated'},
    city: {type: String, default: 'Not stated'},
    price: {type: Number, min: 1, required: true},
    dateInTime: {type: String, default: 'not stated'},
    date: {type: Date, default: new Date(Date.now())},
    title: {type: String, required: true},
    description: {type: String, default: 'no details were stated'},
    eraName: {type: String, required: true, validate: {
        async validator(eraName) {
            const eras = await Era.find().exec();
            return eras.find(era => era.eraName === eraName);
        },
        message: props => `${props.value} is NOT a valid era or it doesn't exist on out system!`
    }},
    imageUrl: {type: String, required: true}
});

const Event = mongoose.model('event', eventSchema);
module.exports = {
    Event
}