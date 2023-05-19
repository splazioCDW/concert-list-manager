//CRUD = create read updat delete

const {MongoClient, ObjectID } = require('mongodb')

const connectionURL ='mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

// MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {
MongoClient.connect(connectionURL, {useUnifiedTopology: true}, (error, client) => {

    if (error) {
        
        return console.log('Unable to connect to database!')
    }
    
    const db = client.db(databaseName)

    //delete
    // db.collection('users').deleteMany({ 
    //     age: 27
    // }).then((result) => { 
    //     console.log(result)
    // }).catch( (error) => { 
    //     console.log(error)
    // })

    // Goal: Use deleteOne to remove a task //
    // 1. Grab the description for the task you want to remove 
    // 2. Setup the call [tfith the query
    // 3. Use promise methods to setup the success/error handlers 
    // 4. Test your work!

    // db.collection('tasks').deleteOne({ 
    //     description: "Clean the house" 
    // }).then((result) => { 
    //     console.log(result)
    // }).catch((error) => { 
    //     console.log(error)
    // })
    
    
    
    

    //update
    // db. collection('users').updateOne({
    //     _id: new ObjectID("64540c599541d0aaf87315cb")
    // }, {
    //     // $set: {
    //     // name: 'Mike'
    //     // }

    //     //increment
    //     $inc: {
    //         age: 1
    //     }
    // }).then((result) => { 
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })
    
    //
    // Goal: Use updateMany to complete all tasks
    //
    // 1. Check the documentation for updateMany
    // 2. Setup the call with the query and the updates
    // 3. Use promise methods to setup the success/error handlers
    // 4. Test your work!

    // db.collection('tasks').updateMany({ 
    //     completed: false
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }).then((result) => {
    //     console.log(result.modifiedCount) 
    // }).catch((error) => { 
    //     console.log(error)
    // })            

    //find
    // db.collection('users').findOne({name: 'Jen'}, (error, user) => {
    //for ObjectID the id needs to be wraped by the function since it is not a string and it is binary date
    // db.collection('users').findOne({_id: new ObjectID("64540c599541d0aaf87315cb")}, (error, user) => {
    //     if (error) {
    //         return console.log('Unable to fetch user.')
    //     }

    //     console.log(user)
    // })

    // db.collection('users').find({ age: 27 }).toArray((error, users) => {
    //     console.log(users)
    // })

    // db.collection('users').find({ age: 27 }).count((error, count) => {
    //     console.log(count)
    // })

    // Goal: Use find and findOne with tasks //
    // 1. Use findOne to fetch the last task by its id (print doc to console)
    // 2. Use find to fetch all tasks that are not completed (print docs to console) 
    // 3. Test your work!

    // db.collection('tasks').findOne( { _id: new ObjectID("6454068112577c024c3edcf2") }, (error, task) => {
    //     console.log(task)
    // })

    // db.collection('tasks').find({ completed: false}).toArray((error, tasks) => {
    //     console.log(tasks)
    // })
})