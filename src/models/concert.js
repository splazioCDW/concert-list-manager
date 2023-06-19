//mongoose requires npm install
const mongoose = require('mongoose')

const concertSchema = new mongoose.Schema({
    concert: {
        type: String,
        required: true,
        trim: true,

    },
    venue: {
        type: String,
        required: true,
        trim: true,
    },
    date: {
        type: Date, 
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        //reference for another model to use
        ref: 'User'
    }
}, {
    timestamps: true
})

const Concert = mongoose.model('Concert', concertSchema)

module.exports = Concert