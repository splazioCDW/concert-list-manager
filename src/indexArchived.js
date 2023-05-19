//express is a web application framework for Node.js
const express = require('express')

//ensures the mongoose file runs and connects to the database
require('./db/mongoose')

//no longer used in this file. Moved to routers
// //import file models user and task
// const User = require('./models/user')
// const Task = require('./models/task')

//added for the user and task routers
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

//
// Goal: Create task router //
// 1. Create new file the creates/exports new router 
// 2. Move all the task routes over 
// 3. Load in an use that router with the express app 
// 4. Test your work



const app = express()
//used for heroku
// const port = process.env.PORT || 3000
const port = 3000

//automatically parse incoming json to an object to access in request handlers
app.use(express.json())

// //the router will be put into a separate file
// //create a router to break up the index file by user, task, etc. since the file is getting long
// const router = new express.Router()
// router.get('/test', (req, res) => {
//     res.send('This is from my other router in index')
// })

// //register the router with the express application to use
// app.use(router)

//register the user and task routers to be used with the express application
app.use(userRouter)
app.use(taskRouter)

//moved user to routers > user.js
// //create a user with post
// // app.post('/users', (req, res) => { 
// //     console.log(req.body)
// //     res.send('testing !')
// // })

// //will refactor with async/await
// // app.post('/users', (req, res) => { 
// //     const user = new User(req.body)
    
// //     user.save().then(() => { 
// //         res.status(201).send(user)
// //     }).catch((e) => {
// //         res.status(400).send(e)
// //     })
// // })

// //refactor with async/await
// app.post('/users', async(req, res) => { 
//     const user = new User(req.body)
   
//     try{
//         await user.save()
//         //only will run if the promise is fulfilled
//         res.status(201).send(user)
//     } catch(e) {
//         res.status(400).send(e)
//     }
// })

// //get all users
// // app.get('/users', (req, res) => { 
// //     User.find({}).then((users) => { 
// //         res.send(users)
// //     }).catch((e) => {
// //         res.status(500).send()
// //     })
// // })

// //refactor with async/await
// app.get('/users', async (req, res) => { 
//     try {
//         const users = await User.find({})
//         res.send(users)
//     } catch (e){
//         res.status(500).send()
//     }
// })

// //get one user
// // app.get('/users/:id', (req, res) => { 
// //     const _id = req.params.id

// //     User.findById(_id).then((user) => { 
// //         if (!user) {
// //             return res.status(404).send()
// //         }
    
// //         res. send(user)
// //     }).catch((e) => {
// //         res.status(500).send()
// //     })
// // })

// //refactor with async/await
// app.get('/users/:id', async (req, res) => { 
//     const _id = req.params.id

//     try {
//         const user = await User.findById(_id)
//         if (!user) {
//             return res.status(404).send()
//         }

//         res. send(user)
//     } catch(e) {
//         res.status(500).send()
//     }  
// })

// //used to update existing user resources

// app.patch('/users/:id', async (req, res) => {
//     //validate that the field is an option to update
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['name', 'email', 'password', 'age']
//     const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

//     if (!isValidOperation) {
//         return res.status(400).send({ error: 'Invalid user updates!'})
//     }
    
//     //update a user by the id
//     //take updates in the https rquest : requ.body
//     //then setup options
//     try {
//         const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators:true})
//         if (!user) {
//             return res.status(404).send()
//         }
//         res.send(user)
//     } catch (e) {
//         res.status(400).send()
//     }
// })

// //delete user by id in https request
// app.delete('/users/:id', async (req, res) => {
//     try {
//         const user = await User.findByIdAndDelete(req.params.id)

//         if (!user) {
//             return res.status(404).send({ error: 'No user found!'})
//         }

//         res.send(user)
//     } catch (e) {
//         res.status(500).send()
//     }
// })
    
//Ch 11 Integrating Async/Await
// Goal: Refactor task routes to use await/await //
// 1. Refactor task routes to use await/await 
// 2. Test all routes in Postman



// //create task
// // app.post('/tasks', (req, res) => { 
// //     const task = new Task(req.body)

// //     task.save().then(() => { 
// //         res.status(201).send(task)
// //     }).catch((e) => {
// //         res.status (400).send(e)    
// //     })
// // })

// //refactor with async/await
// app.post('/tasks', async (req, res) => { 
//     const task = new Task(req.body)

//     try {
//         await task.save()
//         res.status(201).send(task)
//     } catch (e){
//         res.status (400).send(e) 
//     }
// })

    
//   //ch 11 - Resource Reading Endpoints: Part II
// // Goal: Setup the task reading endpoints //
// // 1. Create an endpoint for fetching all tasks
// // 2. Create an ednpoint for fetching a task by its id
// // 3. Setup new requests in Postman and test your work

// //get all tasks
// // app.get('/tasks', (req, res) => { 
// //     Task.find({}).then((tasks) => { 
// //         res.send(tasks)
// //     }).catch((e) => {
// //         res.status(500).send()
// //     })
// // })

// //refactor with async/await
// app.get('/tasks', async (req, res) => { 
    
//     try {
//         const tasks = await Task.find({}) 
//         res.send(tasks)
//     } catch (e) {
//         res.status(500).send()
//     }
// })
      
// //get a task by id
// // app.get('/tasks/:id', (req, res) => { 
// //     const _id = req.params.id
    
// //     Task.findById(_id).then((task) => { 
// //         if (! task) {
// //             return res.status(404).send()
// //         }
        
// //         res.send(task)
// //     }).catch((e) => {
// //         res.status(500).send()
// //     })
// // })

// //refactor with async/await
// app.get('/tasks/:id', async (req, res) => { 
//     const _id = req.params.id
    
//     try {
//         const task = await Task.findById(_id)
//         if (!task) {
//             return res.status(404).send()
//         }
        
//         res.send(task)
//     } catch (e) {
//         res.status(500).send()
//     }
// })
    
    

// // Goal: Setup the task creation endpoint //
// // 1. Create a separate file for the task model (load it into index.js) 
// // 2. Create the task creation endpoint (handle success and error)
// // 3. Test the endpoint from postman with good and bad dataj

// //Ch 11 - Resource Updating Endpoints: Part II
// // Goal: Allow for task updates //
// // 1. Setup the route handler 
// // 2. Send error if unknown updates 
// // 3. Attempt to update the task 
// //	- Handle task not found
// //	- Handle validation errors
// //	- Handle success
// // 4. Test your work!]


// //update existing task resources
// app.patch('/tasks/:id', async (req, res) => {
//     //validate that the field is an option to update
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['description', 'completed']
//     const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

//     if (!isValidOperation) {
//         return res.status(400).send({ error: 'Invalid task updates!'})
//     }
    
//     //update a user by the id
//     //take updates in the https rquest : requ.body
//     //then setup options
//     try {
//         const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators:true})
//         if (!task) {
//             return res.status(404).send()
//         }
//         res.send(task)
//     } catch (e) {
//         res.status(400).send()
//     }
// })

// //
// // Goal: Allow for removal of tasks //
// // 1. Setup the endpoint handler
// // 2.	Attempt to delete	the	task by id
// //	-	Handle	success
// //	-	Handle	task not	found
// //	-	Handle	error
// // 3. Test your work

// //delete task by id in https request
// app.delete('/tasks/:id', async (req, res) => {
//     try {
//         const task = await Task.findByIdAndDelete(req.params.id)
        
//         if (!task) {
//             return res.status(404).send({ error: 'No task found!'})
//         }

//         res.send(task)
//     } catch (e) {
//         res.status(500).send()
//     }
// })

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
