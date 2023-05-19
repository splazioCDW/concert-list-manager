//CRUD = create read updat delete

//import module
const mongodb = require('mongodb')

//object from mongodb, where we need to initize the connection, AKA the MongoClient
//gives access to function to connect to db to perform 4 basic core operations
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectID

//destructuring ^
//shorthand for grabbing things from mongodb
const {MongoClient, ObjectID } = require('mongodb')

//generate out own id's
//used to show how you can generate your own id part 1 of 2
const id = new ObjectID()
console.log('id: ' + id)
console.log('timestamp: ' + id.getTimestamp())

//define connection url and the database to connect to
//issues using localhost, so use full IP 127.0.0.1 instead
const connectionURL ='mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

//can now connect to the server
//connect takes  arguments: connection url, options object, and callback function with an error or a client
MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database!')
    }
    //console.log('Connected correctly!')

    //insert a document
    //reference to database to manipulate, mongodb automatically creates the db
    const db = client.db(databaseName)

    //insert doument into a collection 
    //insertOne is ascyncronous
    // db.collection('users').insertOne({
    //     name: 'Sarah',
    //     age: 27
    // })
 
    //rewrite to include callback function
    // db.collection('users').insertOne({
    //     //used to show how you can generate your own id part 2 of 2
    //     _id: id,
    //     name: 'Vikram',
    //     age: 26
    // }, (error, result) => { //result contains operation data and unique id
    //     if (error) {
    //         return console.log('Unable to insert user.')
    //     }
    //     console.log(result.ops)
    // })

    //insert in bulk
    // db.collection('users').insertMany([
    //     {
    //         name: 'Jen',
    //         age: 27
    //     }, {
    //         name: 'Gunther',
    //         age: 28
    //     }
    //  ], (error, result) => { 
    //     if (error) {
    //         return console.log('Unable to insert user.')
    //     }
    //     console.log(result.ops)
    // })

    // Goal: Insert 3 tasks into a new tasks collection //
    // 1. Use insertMany to insert the documents //	- description (string), completed (boolean)
    // 2. Setup the callback to handle error or print ops // 3. Run the script
    // 4. Refresh the database in Robo 3t and view data in tasks collection

    // db.collection('tasks').insertMany([
    //     {
    //         description: 'Clean the house',
    //         completed: true
    //     }, {
    //         description: 'Renew inspection',
    //         completed: false
    //     }, {
    //         description: 'Pot plants',
    //         completed: false
    //     }
    //  ], (error, result) => { 
    //     if (error) {
    //         return console.log('Unable to insert tasks.')
    //     }
    //     console.log(result.ops)
    // })


})