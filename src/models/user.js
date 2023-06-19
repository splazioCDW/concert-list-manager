//require npm install
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//const Task = require('./task')
const Concert = require('./concert')

//use middleware to run code just before or after functions: save is the function. 
//create schema to use middleware functionality to hash passwords 
const userSchema = new mongoose.Schema({
    name: {
    type: String,
    required: true,
    trim: true
    },
    email: {
        type: String, 
        unique: true,
        required: true, 
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 9,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password".')
            }
        }
    },     
    age: {
        type: Number,
        default: 18,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number')
            }
            if (value < 18) {
                throw new Error('You must be 18 years or older to use this application.')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    //need to store image files up on server(on database) instead of on the file system
    avatar: { 
        type: Buffer
    }
//second argument for options object
}, {
    timestamps: true
})

//setup a virtual property which is a relationship between two entities
//instead of storing in a database. Tells mongoose who is what and how they are related
userSchema.virtual('concert', {
    ref: 'Concert',
    localField: '_id',
    foreignField: 'owner'
})


//add method to only return info for public aka remove the pw from display
//manual version
// userSchema.methods.getPublicProfile = function () {
//automated version
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    //sign needs payload to uniquely id the user, which is the object, and a secret: 'thisismynewcourse' 
    // const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse')
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    
    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

//only can with the separate schema instead of an object
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    // console.log('model user: ', user)
    // console.log('inside user models findByCredentials')
    if (!user) {
        throw new Error('Unable to find user and login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

//hash the plain text password before saving
//use a method on userSchema to setup the middleware
//use standard function instead of arrow function because 'this' binding will be used
userSchema.pre('save', async function (next) {
    //assign a variable to be less confusing
    const user = this
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    //must call next() at the end of the function, so it doesn't hang forever and wont save the user. 
    next()
})

//define user model and add schema
const User = mongoose.model('User', userSchema)

module.exports = User