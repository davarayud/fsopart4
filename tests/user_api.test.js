const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')

beforeEach(async () => {
  await User.deleteMany({})
  const userObjects = helper.initialUser.map(user => new User(user))
  const promiseArray = userObjects.map(user => user.save())
  await Promise.all(promiseArray)
})

const api = supertest(app)

describe('when there is initially some users saved', () => {
  test('user are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all users are returned ', async () => {
    const response = await api.get('/api/users')

    expect(response.body).toHaveLength(helper.initialUser.length)
  })

  test('the unique identifier of the user is called id', async () => {
    const response = await api.get('/api/users')

    expect(response.body[0].id).toBeDefined()
  })
})

describe('addition of a new user', () => {
  test('a valid user can be added', async () => {
    const newUser = {
      username: 'nuevousuario',
      name: 'nuevonombre',
      password: 'contrase;a'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    const usernames = usersAtEnd.map(r => r.username)

    expect(usersAtEnd).toHaveLength(helper.initialUser.length + 1)
    expect(usernames).toContain('nuevousuario')
  })

  test('add user without username, returns error 400 Bad Request', async () => {
    const newUser = {
      name: 'nuevonombre',
      password: 'contrase;a'
    }

    const res = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(res.body.error).toBe('User validation failed: username: Path `username` is required.')
    const usersAtEnd = await helper.usersInDb()

    expect(usersAtEnd).toHaveLength(helper.initialUser.length)
  })
  test('add user without password, returns error 400 Bad Request', async () => {
    const newUser = {
      username: 'nuevousuario',
      name: 'nuevonombre',
    }

    const res = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(res.body.error).toBe('password missing')
    const usersAtEnd = await helper.usersInDb()

    expect(usersAtEnd).toHaveLength(helper.initialUser.length)
  })
  test('add user with invalid username parameter, returns error 400 Bad Request', async () => {
    const newUser = {
      username: 'nu',
      name: 'nuevonombre',
      password: 'contrase;a'
    }

    const res = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(res.body.error).toBe('User validation failed: username: Path `username` (`nu`) is shorter than the minimum allowed length (3).')
    const usersAtEnd = await helper.usersInDb()

    expect(usersAtEnd).toHaveLength(helper.initialUser.length)
  })
  test('add user with invalid password parameter, returns error 400 Bad Request', async () => {
    const newUser = {
      username: 'nuevousuario',
      name: 'nuevonombre',
      password: 'co'
    }

    const res = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(res.body.error).toBe('User validation failed: password: Path password (co) is shorter than the minimum allowed length (3)')
    const usersAtEnd = await helper.usersInDb()

    expect(usersAtEnd).toHaveLength(helper.initialUser.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})