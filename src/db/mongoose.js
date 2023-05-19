//require npm install
const mongoose = require('mongoose')
//const validator = require('validator')

//provide the database name with the url "task-manager-api" and then ad options
// mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
mongoose.connect(process.env.MONGODB_URL, {    
    //useNewUrlParser: true,
    //useCreateIndex: true - depricated
    useUnifiedTopology: true
})

//
// Goal: Add a password field to User //
// 1. Setup the field as a required string 
// 2. Ensure the length is greater than 6 
// 3. Trim the password
// 4. Ensure that password doesn't contain "password" // 5. Test your work!



// //define user model
// const User = mongoose.model('User', {
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     email: {
//         type: String, 
//         required: true, 
//         trim: true,
//         lowercase: true,
//         validate(value) {
//             if (!validator.isEmail(value)) {
//                 throw new Error('Email is invalid')
//             }
//         }
//     },
//     password: {
//         type: String,
//         required: true,
//         minlength: 7,
//         trim: true,
//         validate(value) {
//             if (value.toLowerCase().includes('password')) {
//                 throw new Error('Password cannot contain "password".')
//             }
//         }
//     },     
//     age: {
//         type: Number,
//         default: 0,
//         validate(value) {
//             if (value < 0) {
//                 throw new Error('Age must be a positive number')
//             }
//         }
//     }
// })


//instance of user model
// const me = new User({
//     name: '  Mike',
//     email: 'mike@gmail.com',
//     password: 'buBBLE123',
//     age: 25
// })

// //need to save the user model to the database
// //so we use methods on the instance
// //save method returns a promise
// me.save().then(() => {
//     console.log(me)
// }).catch((error) => {
//     console.log('Error: ', error)
// })

// Goal: Create a model for tasks //
// 1. Define the model with description and completed fields 
// 2. Create a new instance of the model 
// 3. Save the model to the database 
// 4. Test your workl|

//
// Goal: Add validation and sanitization to task //
// 1. Trim the description and make it required 
// 2. Make completed optional and default it to false 
// 3. Test your work with and without errors]



// const Task = mongoose.model('Task', {
//     description: {
//         type: String,
//         required: true,
//         trim: true,

//     },
//     completed: {
//         type: Boolean,
//         default: false
//     }
// })

// const task = new Task({
//     description: 'Learn the Mongoose library',
//     completed: false
// })

// task.save().then(() => {
//     console.log(task)
// }).catch((error) => {
//     console.log(error)
// })
