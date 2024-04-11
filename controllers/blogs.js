const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1, id: 1 })

  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user
  const blogToDelete = await Blog.findById(request.params.id)
  if (blogToDelete === null) {
    return response.status(401).json({ error: 'id invalid' })
  }
  if (user._id.toString() !== blogToDelete.user.toString()) {
    return response.status(401).json({ error: 'user invalid' })
  }
  await Blog.findByIdAndDelete(request.params.id)
  user.blogs = user.blogs.filter(blogid => blogid.toString() !== request.params.id.toString())
  await user.save()

  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blogToUp = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const result = await Blog.findByIdAndUpdate(
    request.params.id,
    blogToUp,
    { new: true, runValidators: true }
  )
  if(result) {
    response.status(200).json(result)
  } else {
    response.status(400).json({ error: `${blogToUp.title} was already removed from server` })
  }
})

module.exports = blogsRouter