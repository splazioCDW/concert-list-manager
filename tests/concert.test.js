const request = require('supertest')
const app = require('../src/app')
const Concert = require('../src/models/concert')

//rewrite
// const {userOneId, userOne, setupDatabase } = require('./fixtures/db')

const {
    userOneId, 
    userOne, 
    userTwoId,
    userTwo,
    concertOne,
    concertTwo,
    concertThree,
    setupDatabase 
} = require('./fixtures/db')

//wipe database so it is empty before each round of testing for consistency
beforeEach(setupDatabase)

//test to create concert for the user
test('Should create conert for user', async () => {
    const response = await request(app)
        .post('/concert')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'From my test'
        })
        .expect(201)
    const concert = await Concert.findById(response.body._id)
    expect(concert).not.toBeNull()
    expect(concert.completed).toEqual(false)
})


//test get concert from user one
test('Should fetch user one concert', async () => {
    const response = await request(app)
        .get('/concerts')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toEqual(2)
})


//test that userTwo cannot delete concert of userOne
//delete - creating https request, the path will include the id of useOne's first concert
//can use concatination or a template string
//.delete(`/concert/${concertOne._id}`)
test('Should not delete other users concert', async () => {
    console.log('concert id ', concertOne._id)
    console.log('user two token: ', userTwo.tokens[0].token)
    const response = await request(app)
        .delete(`/concerts/646fc087f9981793a5472c1a`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
    const concert = await Concert.findById(concertOne._id)
    expect(concert).not.toBeNull()
})


