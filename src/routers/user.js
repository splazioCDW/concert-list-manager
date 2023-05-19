//require npm install
const express = require('express')
//used to upload files
const multer = require('multer')
const sharp = require('sharp')

const router = new express.Router()

const User = require('../models/user')
const auth = require('../middleware/auth')
const Task = require('../models/task')
const { sendWelcomeEmail, sendCancellationEmail } = require('../emails/account')

//replace 'app' with 'router' for splitting the index file

router.get('/test', (req, res) => {
    res.send('From a new user file')
})

//create a user with post
// app.post('/users', (req, res) => { 
//     console.log(req.body)
//     res.send('testing !')
// })

//will refactor with async/await
// app.post('/users', (req, res) => { 
//     const user = new User(req.body)
    
//     user.save().then(() => { 
//         res.status(201).send(user)
//     }).catch((e) => {
//         res.status(400).send(e)
//     })
// })

//refactor with async/await
router.post('/users', async(req, res) => {  
    const user = new User(req.body)
   
    try{
        await user.save()
        //can use async/await on sendWelcomeEmail, but don't need to
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        //only will run if the promise is fulfilled
        res.status(201).send({user, token})
    } catch(e) {
        res.status(400).send(e)
    }
})

//ch 12 Generating authentic Tokens
// Goal: Have signup send back auth token //
// 1. Generate a token for the saved user // 2. Send back both the token and the user
// 3. Create a new user from Postman and confirm the token is there





//route to verify user and password
//creating function findByCredentials instead of built-in, located in user model
router.post('/users/login', async (req, res) => {
    // console.log('start of user-login')
    try {
        // console.log('email: ', req.body.email)
        // console.log('password: ', req.body.password)
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        // res.send({ user, token })
        //refactor to show only public data aka not show pw or personal info
        //manual version
        // res.send({ user: user.getPublicProfile(), token })
        //automated verson with toJSON in user models
        res.send({ user: user, token })
    } catch (e) {
        res.status(400).send()
    }
    // console.log('end of user-login')
})

//logout of user with specific token, not all locations
//removing a token from token array
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

//
// Goal: Create a way to logout of all sessions //
// 1. Setup POST /users/logoutAll
// 2. Create the router handler to wipe the tokens array //	- Send 200 or 500
// 3. Test your work
//	- Login a few times and logout of all. Check database

//logout out all sessions
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})


//get all users
// app.get('/users', (req, res) => { 
//     User.find({}).then((users) => { 
//         res.send(users)
//     }).catch((e) => {
//         res.status(500).send()
//     })
// })

//refactor with async/await
//added middleware - 'auth'
// router.get('/users', auth, async (req, res) => { 
//     try {
//         const users = await User.find({})
//         res.send(users)
//     } catch (e){
//         res.status(500).send()
//     }
// })

router.get('/users/me', auth, async (req, res) => { 
    res.send(req.user)
})

//get one user
// app.get('/users/:id', (req, res) => { 
//     const _id = req.params.id

//     User.findById(_id).then((user) => { 
//         if (!user) {
//             return res.status(404).send()
//         }
    
//         res. send(user)
//     }).catch((e) => {
//         res.status(500).send()
//     })
// })

//refactor with async/await
// router.get('/users/:id', async (req, res) => { 
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

// Goal: Refactor the update profile routej^
//
// 1. Update the URL to /users/me
// 2. Add the authentication middleware into the mix
// 3. Use the existing user document instead of fetching via param id
// 4. Test your work in Postman!

//used to update existing user resources
// router.patch('/users/:id', async (req, res) => {
//rewrite without id
router.patch('/users/me', auth, async (req, res) => {
    //validate that the field is an option to update
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid user updates!'})
    }
    
    //update a user by the id
    //take updates in the https rquest : requ.body
    //then setup options
    try {
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators:true})
        // const user = await User.findById(req.params.id)
        //iterate over array to find the item to update (dynamic)
        //using bracket notation instead of dot notation. Ex: req.body[update] instead of req.body.name
        // updates.forEach((update) => user[update] = req.body[update])
        updates.forEach((update) => req.user[update] = req.body[update])
        
        //where middleware is executed
        // await user.save()
        await req.user.save()

        // if (!user) {
        //     return res.status(404).send()
        // }
        // res.send(user)
        res.send(req.user)
    } catch (e) {
        res.status(400).send()
    }
})

//delete user by id in https request
// router.delete('/users/:id', async (req, res) => {
//update for authorization
router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.params.id)
        // alter for the update with authorization, need auth middleware to access req.user.id
        //const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        //console.log('enter user delete')
        // const task = await Task.deleteMany({ owner: user._id})
        
        //send cancellation email
        sendCancellationEmail(req.user.email, req.user.name)

        //delete tasks corresponding to the owner BEFORE deleting the user
        const task = await Task.deleteMany({ owner: req.user._id})
        //console.log('after tasks deleted')
        
        const user = await User.findByIdAndDelete(req.user._id)
        //console.log('after user deleted')

        if (!user) {
            return res.status(404).send({ error: 'No user found!'})
        }

        
        //same as above but a nicer, however this does not work
        //await req.user.remove()
        // res.send(user)
        //console.log('user: ', req.user)
        // res.send(req.user)
        res.send({user, task})
    } catch (e) {
        res.status(500).send('User not deleted')
    }
})

//Ch 14 - Adding Support for File Uploads
// Goal: Setup endpoint for avatar upload //
// 1. Add POST /users/me/avatar to user router
// 2. Setup mutter to store uploads in an avatars directory
// 3. Choose name "avatar" for the key when registering the middleware
// 4. Send back a 200 response from route handler
// 5. Test your work. Create new Task App request and upload image

// const upload = multer ({
//     dest: 'avatars'
// })

// router.post('/users/me/avatar', upload.single('avatar'), (req, res) => {
//     res.send()
// })

//const multer = reqire('multer')   //moved to top
const upload = multer ({
    //removing dest will no longer allow multer to save to the avatar directory
    //dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
})

// router.post('/users/me/avatar', upload.single('avatar'), (req, res) => {
//     res.send()
// })

//ch 14 - Validation Challenge
// Goal: Add validation to avatar upload route //
// 1. Limit the upload size to 1 MB // 2. Only allow jpg, jpeg, png // 3. Test your work!
//	- Upload larger files (should fail)
//	- Upload non-images (should fail)]

// Ch 14 - Handling Express Errors
// Goal: Clean up error handling //
// 1. Setup an error handler function
// 2. Send back a 400 with the error message
// 3. Test your work

//authorizing
// // router.post('/users/me/avatar', upload.single('avatar'), (req, res) => {
// router.post('/users/me/avatar', auth, upload.single('avatar'), (req, res) => {

//     res.send()
// }, (error, req, res, next) => {
//     res.status(400).send({ error: error.message })
// })

// //need to store image files up on server in stead of on the file system - on user models
// router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
//     //can only use 'req.file.buffer' when dest is removed from upload above
//     req.user.avatar = req.file.buffer
//     await req.user.save()
//     res.send()
// }, (error, req, res, next) => {
//     res.status(400).send({ error: error.message })
// })

//update from Ch14 - Auto-Cropping and Image Formatting
//need to store image files up on server in stead of on the file system - on user models
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    //converting images to png and resize
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    
    //can only use 'req.file.buffer' when dest is removed from upload above
    //req.user.avatar = req.file.buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

//
// Goal: Setup route to delete avatar //
// 1. Setup DELETE /users/me/avatar 
// 2. Add authentication
// 3. Set the field to undefined and save the user sending back a 200 
// 4. Test your work by creating new request for Task App in Postman

router.delete('/users/me/avatar', auth, async (req, res) => {
    //can only use 'req.file.buffer' when dest is removed from upload above
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

//fetching the avatar image
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        //error thrown when no user or avatar is found
        if (!user || !user.avatar) {
            throw new Error('No avatar found.')
        }
        //send back correct data and the type
        // set takes a value pair name of response header we are trying to set and the value we are trying to set on it 
        // res.set('Content-Type', 'image/jpg')
        res.set('Content-Type', 'image/png')

        res.send(user.avatar)

    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router