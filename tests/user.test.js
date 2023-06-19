//requires npm install
//request is supertest's naming convention
const request = require('supertest')

//restructured so only the app is retrieved and not the port, that is left in index.js
const app = require('../src/app')
const User = require('../src/models/user')
const {userOneId, userOne, setupDatabase } = require('./fixtures/db')

//wipe database so it is empty before each round of testing for consistency
beforeEach(setupDatabase)

//test signing up a user
test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Sarah', 
        email: 'sarah@example.com',
        password: 'MyPass777!'
    }).expect(201)

    //Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()    

    //Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Sarah', 
            email: 'sarah@example.com',
        },
        token: user.tokens[0].token
    })
    //testing password is not plain text
    expect(user.password).not.toBe('MyPass777!')
})

//test to login user
test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

//test login not allowed for non-existent user
test('Should NOT login NONexistent user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'thisisnotmypassword'
    }).expect(400)
})

//use token to create test case that interacts with endpoint that requires authentication
//.set() is used to set the headers, Authorization is the name of the header
//.set() must be called before .send()
test('Should get profile for user', async () => {
    await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

//test not allowed to get info from unauthenticated user
test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

//test delete the account of the signed in user
test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

//test do not delete account for unauthenticated user
test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

//test uploading an image for the avatar
test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)
    //check binary data was saved
    const user = await User.findById(userOneId)
    //looks at avatar property and checks if any buffer
    expect(user.avatar).toEqual(expect.any(Buffer))
})

//test updating a info for a valid user
test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Jess'
        })
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.name).toEqual('Jess') //would also work with toBe()
})

//test info is NOT updated for an invalid fields
test('Should NOT update INVALID user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Baltimore'
        })
        .expect(400)

})