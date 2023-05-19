//mongoose requires npm install
const mongoose = require('mongoose')

// const Task = mongoose.model('Task', {
//     description: {
//         type: String,
//         required: true,
//         trim: true,

//     },
//     completed: {
//         type: Boolean,
//         default: false
//     },
//     owner: {
//         type: mongoose.Schema.Types.ObjectId,
//         required: true,
//         //reference for another model to use
//         ref: 'User'
//     }
// })

// module.exports = Task

//Ch 13 - Working with timestamps
// Goal: Refactor task model to add timestamps //
// 1. Explicitly create schema 
// 2. Setup timestamps
// 3. Create tasks from Postman to test work

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true,

    },
    completed: {
        type: Boolean,
        default: false
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

const Task = mongoose.model('Task', taskSchema)

module.exports = Task