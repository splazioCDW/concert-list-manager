const express = require('express')
const Concert = require('../models/concert')
const auth = require('../middleware/auth')
const router = new express.Router()

//localhost:3000
router.get('/test/concert', (req, res) => {
    res.send('From a new concert file')
})

// add concert
router.post('/concerts', auth, async (req, res) => { 
    // const concert = new Concert(req.body)
    const concert = new Concert({
        ...req.body,
        owner: req.user._id
    })
    try {
        await concert.save()
        res.status(201).send(concert)
    } catch (e){
        res.status (400).send(e) 
    }
})
     
//get a concert by id
router.get('/concerts/:id', auth, async (req, res) => { 
    const _id = req.params.id
    
    try {
        const concert = await Concert.findOne({ _id, owner: req.user._id })

        if (!concert) {
            return res.status(404).send()
        }
        
        res.send(concert)
    } catch (e) {
        res.status(500).send()
    }
})
    
//update existing concert resources
// router.patch('/concerts/:id', async (req, res) => {
router.patch('/concerts/:id', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    console.log('req.body ', req.body)
    console.log('concert updates ', updates)

    //validate that the field is an option to update
    const allowedUpdates = ['concert', 'venue', 'date']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    console.log('isValidOperation ', isValidOperation)
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid concert update!'})
    }
    
    //update a concert by the id
    //take updates in the https request : req.body
    try {
        const concert = await Concert.findOne({ _id: req.params.id, owner: req.user._id})
                
        if (!concert) {
            return res.status(404).send()
        }
        
        updates.forEach((update) => concert[update] = req.body[update])
        await concert.save()
        res.send(concert)
    } catch (e) {
        res.status(400).send()
    }
})

//delete concert by id in https request
router.delete('/concerts/:id', auth, async (req, res) => {
    try {
        // const concert = await Concert.findByIdAndDelete(req.params.id)
        const concert = await Concert.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        
        if (!concert) {
            return res.status(404).send()
        }

        res.send(concert)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router