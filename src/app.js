//copied from index 

//express is a web application framework for Node.js
const express = require('express')

//ensures the mongoose file runs and connects to the database
require('./db/mongoose')

//added for the user and task routers
const userRouter = require('./routers/user')
const concertRouter = require('./routers/concert')
//const taskRouter = require('./routers/task')

const app = express()
//automatically parse incoming json to an object to access in request handlers
app.use(express.json())

//register the user and task routers to be used with the express application
app.use(userRouter)
app.use(concertRouter)
//app.use(taskRouter)

module.exports = app