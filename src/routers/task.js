const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

//replace 'app' with 'router' for splitting the index file

router.get('/test', (req, res) => {
    res.send('From a new task file')
})

//create task
// app.post('/tasks', (req, res) => { 
//     const task = new Task(req.body)

//     task.save().then(() => { 
//         res.status(201).send(task)
//     }).catch((e) => {
//         res.status (400).send(e)    
//     })
// })

//refactor with async/await
// router.post('/tasks', async (req, res) => { 
router.post('/tasks', auth, async (req, res) => { 
    // const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e){
        res.status (400).send(e) 
    }
})

    
  //ch 11 - Resource Reading Endpoints: Part II
// Goal: Setup the task reading endpoints //
// 1. Create an endpoint for fetching all tasks
// 2. Create an ednpoint for fetching a task by its id
// 3. Setup new requests in Postman and test your work

//get all tasks
// app.get('/tasks', (req, res) => { 
//     Task.find({}).then((tasks) => { 
//         res.send(tasks)
//     }).catch((e) => {
//         res.status(500).send()
//     })
// })

//
// Goal: Refactor GET /tasks //
// 1. Add authentication
// 2. Return tasks only for the authenticated user 
// 3. Test your work!

//chapter 13 - Paginating Data
// Goal: Setup support for skip //
// 1. Setup "skip" option
//	- Parse query value to integer
// 2. Fire off some requests to test it's working
//	- Fetch the 1st page of 2 and then the 3rd page of 2
//	- Fetch the 1st page of 3 and then the 2nd page of 3j



//sends back an array of data - must limit what the user gets back
// GET /tasks?completed=true
// GET /tasks?completed=false
//pagination
// GET /tasks?limit=10&skip=0 //first page of 10
// GET /tasks?limit=10&skip=10 //second page of 10
// GET /task?sortBy=createdAt_asc   //sort by time created in ascending order
// GET /task?sortBy=createdAt:desc  //sort by time created in descending order, _ or : works the same
//refactor with async/await
// router.get('/tasks', async (req, res) => { 
router.get('/tasks', auth, async (req, res) => { 
    
    // try {
    //     // const tasks = await Task.find({}) 
    //     // const tasks = await Task.find({ owner: req.user._id })
    //     // res.send(tasks)
    //     //alternative
    //     await req.user.populate('tasks')
    //     res.send(req.user.tasks)

    const match = {}
    const sort = {}

    if (req.query.completed) {
        //if the completed query is true, then match.complete is true, otherwise it is false
        // cannot use: match.completed = req.query.completed , because it is a string, the value need to be changed to a boolean
        match.completed = req.query.completed === 'true'
        //console.log('match: ', match.completed)
    }

    if (req.query.sortBy) {
        //split the value
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
        

    try {
        await req.user.populate({
            path: 'tasks',
            match: match,
            //for pagination
            // options: {
            //     limit:2
            // }
            //get limit from the user
            options: {
                limit: parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort 
                // {
                //     // //descending
                //     // createdAt: -1
                //     //ascending
                //     // createdAt: 1
                // }
            }
        })
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
})
      
//get a task by id
// app.get('/tasks/:id', (req, res) => { 
//     const _id = req.params.id
    
//     Task.findById(_id).then((task) => { 
//         if (! task) {
//             return res.status(404).send()
//         }
        
//         res.send(task)
//     }).catch((e) => {
//         res.status(500).send()
//     })
// })

//refactor with async/await
// router.get('/tasks/:id', async (req, res) => { 
router.get('/tasks/:id', auth, async (req, res) => { 
    const _id = req.params.id
    
    try {
        // const task = await Task.findById(_id)
        const task = await Task.findOne({ _id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }
        
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})
    
    

// Goal: Setup the task creation endpoint //
// 1. Create a separate file for the task model (load it into index.js) 
// 2. Create the task creation endpoint (handle success and error)
// 3. Test the endpoint from postman with good and bad dataj

//Ch 11 - Resource Updating Endpoints: Part II
// Goal: Allow for task updates //
// 1. Setup the route handler 
// 2. Send error if unknown updates 
// 3. Attempt to update the task 
//	- Handle task not found
//	- Handle validation errors
//	- Handle success
// 4. Test your work!]

// ch 12 - Securely Storing Passwords: Part II
// Goal: Change how tasks are updated //
// 1. Find the task
// 2. Alter the task properties
// 3. Save the task
// 4. Test your work by updating a task from Postmarj



//update existing task resources
// router.patch('/tasks/:id', async (req, res) => {
router.patch('/tasks/:id', auth, async (req, res) => {

    //validate that the field is an option to update
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid task updates!'})
    }
    
    //update a user by the id
    //take updates in the https rquest : requ.body
    //then setup options
    try {
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators:true})
        // const task = await Task.findById(req.params.id)
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id})

        //moved from below await task.save(), so that it doesn't try to update a task that does not exist
        if (!task) {
            return res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(400).send()
    }
})

//
// Goal: Allow for removal of tasks //
// 1. Setup the endpoint handler
// 2.	Attempt to delete	the	task by id
//	-	Handle	success
//	-	Handle	task not	found
//	-	Handle	error
// 3. Test your work

//
// Goal: Refactor DELETE /tasks/:id //
// 1. Add authentication
// 2. Find the task by _id/owner (findOneAndDelete) 
// 3. Test your work!



//delete task by id in https request
// router.delete('/tasks/:id', async (req, res) => {
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        // const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        
        if (!task) {
            return res.status(404).send({ error: 'No task found!'})
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router