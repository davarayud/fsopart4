const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')


beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjects = helper.initialBlog.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

const api = supertest(app)

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned ', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlog.length)
  })

  test('the unique identifier of the blog is called id', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
  })
})

describe('viewing a specific note', () => {

  test('succeeds with a valid id', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToView = blogsAtStart[0]

    const result = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(result.body).toEqual(blogToView)
  })

  test('fails with statuscode 404 if note does not exist', async () => {
    const validNonExistingId = await helper.nonExistingId()

    await api
      .get(`/api/blogs/${validNonExistingId}`)
      .expect(404)
  })

  test('fails with statuscode 400 id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400)
  })
})

describe('addition of a new blog', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Motos Argentinas',
      author: 'Pedro Varela',
      url: 'https://motosargentinasnews.blogspot.com/',
      likes: 6
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const titles = blogsAtEnd.map(r => r.title)

    expect(blogsAtEnd).toHaveLength(helper.initialBlog.length + 1)
    expect(titles).toContain('Motos Argentinas')
  })

  test('adding blog without likes property, likes are 0 by default', async () => {
    const newBlog = {
      title: 'Motos Argentinas',
      author: 'Pedro Varela',
      url: 'https://motosargentinasnews.blogspot.com/',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const blogAdded = blogsAtEnd.filter(r => r.title === 'Motos Argentinas')

    expect(blogsAtEnd).toHaveLength(helper.initialBlog.length + 1)
    expect(blogAdded[0].likes).toEqual(0)
  })

  test('add blog without title and url, returns error 400 Bad Request', async () => {
    const  newBlog = {
      author: 'Pedro Varela',
      likes: 6
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlog.length)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    const titles = blogsAtEnd.map(r => r.title)

    expect(blogsAtEnd).toHaveLength(helper.initialBlog.length - 1)
    expect(titles).not.toContain(blogToDelete.title)
  })
})

describe('update a blog', () => {
  test('a valid blog can be Update', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpId = await blogsAtStart[0].id
    const blogToUp = {
      title: 'Motos Argentinas',
      author: 'Pedro Varela',
      url: 'https://motosargentinasnews.blogspot.com/',
      likes: 6
    }

    await api
      .put(`/api/blogs/${blogToUpId}`)
      .send(blogToUp)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    blogToUp.id = blogToUpId

    expect(blogsAtEnd).toContainEqual(blogToUp)
    expect(blogsAtEnd).toHaveLength(helper.initialBlog.length)
  })

  test('fails with statuscode 400 if blog does not exist', async () => {
    const validNonExistingId = await helper.nonExistingId()
    const blogToUp = {
      title: 'Motos Argentinas',
      author: 'Pedro Varela',
      url: 'https://motosargentinasnews.blogspot.com/',
      likes: 6
    }

    await api
      .put(`/api/blogs/${validNonExistingId}`)
      .send(blogToUp)
      .expect(400)
  })

  test('fails with statuscode 400 if blog does not exist', async () => {
    const validNonExistingId = await helper.nonExistingId()
    const blogToUp = {
      title: 'Motos Argentinas',
      author: 'Pedro Varela',
      url: 'https://motosargentinasnews.blogspot.com/',
      likes: 6
    }

    await api
      .put(`/api/blogs/${validNonExistingId}`)
      .send(blogToUp)
      .expect(400)
  })

  test('fails with statuscode 400 id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .put(`/api/blogs/${invalidId}`)
      .expect(400)
  })
})

afterAll(() => {
  mongoose.connection.close()
})