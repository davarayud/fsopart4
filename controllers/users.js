const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')

usersRouter.get('/', async (req, res) => {
  const users = await User
    .find({})
    .populate('blogs', { title : 1, author: 1, url: 1, id: 1 })
  res.json(users)
})

usersRouter.post('/', async (req, res) => {
  const body = req.body
  if (body.password === undefined) {
    return res.status(400).json({ error: 'password missing' })
  } else if (body.password.length < 3) {
    return res.status(400).json({ error: `User validation failed: password: Path password (${body.password}) is shorter than the minimum allowed length (3)` })
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
    blogs: []
  })

  const savedUser = await user.save()

  res.status(201).json(savedUser)
})

usersRouter.delete('/all', async (req, res) => {
  await User.deleteMany({})
  await Blog.deleteMany({})
  res.status(200).end()
})

module.exports = usersRouter