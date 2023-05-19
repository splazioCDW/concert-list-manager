//express is a web application framework for Node.js
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//ensures the mongoose file runs and connects to the database
require('./db/mongoose')

//added for the user and task routers
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
//used for heroku
// const port = process.env.PORT || 3000
//const port = 3000

//ch 15 
const port = process.env.PORT

// //start of ch 14 - Adding Support for File Uploads
// const multer = require('multer')
// const upload = multer({
//     //images is the name of the folder where all of the images should be uploaded
//     dest: 'images',
//     limits: {
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb) {
//         // if(!file.originalname.endsWith('.pdf')) {
//         //     return cb(new Error('Please upload a PDF file.'))
//         // }
//         if(!file.originalname.match(/\.(doc|docx)$/)) {
//             return cb(new Error('Please upload a Word document.'))
//         }
        
//         cb(undefined, true)
//         // cb(new Error('File must be a PDF'))
//         // cb(undefined, true)
//         // cb(undefined, false)
//     }
// })

// //endpoint for the client to upload, 'upload' is a name for the file
// //multer middleware: upload.singe('upload')
// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send()  
// }, 
// //added middleware to not display html file and only error message
// (error, req, res, next) => {
//     res.status(400).send({ error: error.message })
// })


//automatically parse incoming json to an object to access in request handlers
app.use(express.json())

//moved middlware to folder "middleware" in src folder
//register middleware
//next is only specific for middleware 
//will be used for user authentication
// app.use((req, res, next) => {
//     // console.log(req.method, req.path)
//     // next()
//     if (req.method === 'GET') {
//         res.send('GET requests are disabled')
//     } else {
//         next()
//     }
// })

//
// Goal: Setup middleware for maintenance mode //
// 1. Register a new middleware function
// 2. Send back a maintenance message with a 503 status code
// 3. Try your requests from the server and confirm status/message shows

//middleware for maintenance mode
//disable every single request
// app.use((req, res, next) => {
//     res.status(503).send('The site is currently being maintenanced/ Check back soon.')
// })

//register the user and task routers to be used with the express application
app.use(userRouter)
app.use(taskRouter)

//
// Without middleware: new request -> run route handler
//
// With middleware: new request -> do something -> run route handler



app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
//moved to top
//const bcrypt = require('bcryptjs')

//hashing example, not reversable
// const myFunction = async () => {
//     const password = 'Red12345!'
//     //8 passes to hash the password
//     const hashedPassword = await bcrypt.hash(password, 8)

//     //used to see if the hashed password matches the password in the database
//     const isMatch = await bcrypt.compare('Red12345!', hashedPassword)
//     console.log('is Match: ', isMatch)
// }

//moved to the top
//const jwt = require('jsonwebtoken')

// const myFunction = async () => {
//     //for sign the first arguement is a unique key, like the id, and the second is secret key
//     //the third argument which is an object
//     const token = jwt.sign({ _id: 'abc123'}, 'thisismynewcourse', {expiresIn: '7 days'})
//     console.log('token: ', token)

//     const data = jwt.verify(token, 'thisismynewcourse')
//     console.log('data: ', data)    
// }

// myFunction()
// const Task = require('./models/task')
// const User = require('./models/user')

// const main = async () => {
//     // const task = await Task.findById('6463bceb097ccb0d29cbdaae')
//     // //allows to populate data from a relationship to the entire profile
//     // // execPopulate has been depricated
//     // // await task.populate('owner').execPopulate()
//     // //use to get the whole object instead of just the owner id
//     // await task.populate('owner')
//     // // console.log(task)
//     // console.log(task.owner)

//     const user = await User.findById('6463b93e86c2b1b1890b4d5a')
//     await user.populate('tasks')
//     console.log('tasks: ', user.tasks)

// }

// main()