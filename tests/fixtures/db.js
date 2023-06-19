//used to create a token to authenticate userOne
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

//create id for authentication
const userOneId = new mongoose.Types.ObjectId()
const userTwoId = new mongoose.Types.ObjectId()

//creating a test user
//will save to database in beforeEach()
//added _id and token so we can test an authenticated user
const userOne = {
    _id: userOneId,
    name: 'Mike',
    email: 'mike@example.com',
    password: '56what!',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

const userTwo = {
    _id: userTwoId,
    name: 'Mary',
    email: 'Mary@example.com',
    password: '56what!',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}

//creating tasks
const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First task', 
    completed: false, 
    owner: userOneId  //must use userOneId, userOne._Id doesn't work
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second task', 
    completed: false, 
    owner: userOneId  
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Third task', 
    completed: false, 
    owner: userTwo._id  
}

//setup db and save users and tasks to the db
const setupDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()

}
// const setupDatabase = async () => {
//     await User.deleteMany()
//     await new User(userOne).save()
// }

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
}