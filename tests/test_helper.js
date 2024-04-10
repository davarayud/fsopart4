const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlog = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

const nonExistingId = async () => {
  const newBlog = {
    title: 'willremovethissoon',
    author: 'willremovethissoon',
    url: 'willremovethissoon',
    likes: 0
  }
  const blog = new Blog(newBlog)
  await blog.save()
  await Blog.findByIdAndDelete(blog._id)
  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const initialUser = [
  {
    _id: '65bbaaab80dfc30048f9d979',
    username: 'chimians',
    name: 'damian',
    passwordHash: '$2b$10$.GSl2aPv8/3Kdb8B.UuyOuyc/nyK/gsV/uWauc6vAxeti3XyWnfda',
    __v: 0
  },
  {
    _id: '65bbeb13b6664bd034c67b14',
    username: 'lala123',
    name: 'melani',
    passwordHash: '$2b$10$SdsAwgVUFDTupBAoFF6TTeVZYkj.bRZK/krBOZgHS6tTgr5d1kede',
    __v: 0
  },
  {
    _id: '65ca8d55a255dc9345c97b93',
    username: 'luchin',
    name: 'lucio',
    passwordHash: '$2b$10$44pVoY2ldi/fxoD6VuAy0uBmAqpx1gWhYgC3gWGcDdPT.OBi.8jfm',
    __v: 0
  }
]

const usersInDb = async () => {
  const blogs = await User.find({})
  return blogs.map(user => user.toJSON())
}


module.exports = {
  initialBlog, nonExistingId, blogsInDb, initialUser, usersInDb
}