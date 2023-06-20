//require npm install
const express = require('express')
//used to upload files
const multer = require('multer')
const sharp = require('sharp')

const router = new express.Router()

const User = require('../models/user')
const auth = require('../middleware/auth')
const { sendWelcomeEmail, sendCancellationEmail } = require('../emails/account')
const Concert = require('../models/concert')


router.get('', (req, res) => {
    res.send('Go to Postman')
})

router.get('/test', (req, res) => {
    res.send('From a new user file')
})

//create a user
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

//route to verify user and password
//creating function findByCredentials instead of built-in, located in user model
router.post('/users/login', async (req, res) => {
    // console.log('start of user-login')
    try {
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

//get the current authorized user
router.get('/users/me', auth, async (req, res) => { 
    res.send(req.user)
})

//get user by id
router.get('/users/:id', async (req, res) => { 
    const _id = req.params.id

    try {
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send()
        }

        res. send(user)
    } catch(e) {
        res.status(500).send()
    }  
})

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

//delete authenticated user
//update for authorization
router.delete('/users/me', auth, async (req, res) => {
    try {
        //send cancellation email
        sendCancellationEmail(req.user.email, req.user.name)
 
        //delete concerts corresponding to the owner BEFORE deleting the user
        const concert = await Concert.deleteMany({ owner: req.user._id})
        
        const user = await User.findByIdAndDelete(req.user._id)

        if (!user) {
            return res.status(404).send({ error: 'No user found!'})
        }

        res.send({user, concert})
    } catch (e) {
        res.status(500).send('User not deleted')
    }
})

//used to upload an image file
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

//upload an image for user avatar
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    //resize image and convert to png 
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer

   
    await req.user.save()
    res.set('Content-Type', 'image/png')
    res.send(req.user.avatar)
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

// delete avatar/image for authenticated user.
router.delete('/users/me/avatar', auth, async (req, res) => {
    //can only use 'req.file.buffer' when dest is removed from upload above
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

//fetching the avatar image by user ID
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

// //fetching the avatar image for authorized user
// router.get('/users/me/avatar', auth, async (req, res) => {
//     //console.log('req ', req)
//     console.log('user.avatar ', user.avatar)
//     res.set('Content-Type', 'image/png')
//     res.send(req.user.avatar)
// })

module.exports = router