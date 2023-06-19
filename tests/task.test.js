const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')

//rewrite
// const {userOneId, userOne, setupDatabase } = require('./fixtures/db')

const {
    userOneId, 
    userOne, 
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase 
} = require('./fixtures/db')

//wipe database so it is empty before each round of testing for consistency
beforeEach(setupDatabase)

//test to create task for the user
test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'From my test'
        })
        .expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

//Ch 16 - Testing with Task Data
// Goal: Test GET /tasks //
// 1. Request all tasks for user one 
// 2. Assert the correct status code 
// 3. Check the length of the response array is 2 
// 4. Test your work

//test get tasks from user one
test('Should fetch user one tasks', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toEqual(2)
})

//Ch 16 - Testing with Task Data 
// Goal: Test delete task security //
// 1. Attempt to have the second user delete the first task (should fail)
//	- Setup necessary exports from db.js
// 2. Assert the failed status code
// 3. Assert the task is still in the database
// 4. Test your work!

//test that userTwo cannot delete tasks of userOne
//delete - creating https request, the path will include the id of useOne's first task
//can use concatination or a template string
//.delete(`/tasks/${taskOne._id}`)
test('Should not delete other users tasks', async () => {
    console.log('task id ', taskOne._id)
    console.log('user two token: ', userTwo.tokens[0].token)
    const response = await request(app)
        .delete(`/tasks/646fc087f9981793a5472c1a`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})


