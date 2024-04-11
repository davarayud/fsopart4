const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlog = [
  {
    _id: '6617d5e959b4b9dd6b726428',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    user: '6617d46059b4b9dd6b726419',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    user: '6617d46059b4b9dd6b726419',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    user: '6617d46059b4b9dd6b726419',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    user: '6617d46059b4b9dd6b726419',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    user: '6617d46059b4b9dd6b726419',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    user: '6617d46059b4b9dd6b726419',
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
    _id: '6617d46059b4b9dd6b726419',
    username: 'chimians',
    name: 'chimi',
    passwordHash: '$2b$10$Uie/0jlrOVsFckhcC2SGfun/PTRlyITgf38mm6aDXnnz5nXR91Wyy',
    blogs: [
      '6617d5e959b4b9dd6b726428',
      '5a422aa71b54a676234d17f8',
      '5a422b3a1b54a676234d17f9',
      '5a422b891b54a676234d17fa',
      '5a422ba71b54a676234d17fb',
      '5a422bc61b54a676234d17fc'
    ],
    __v: 6
  },
  {
    _id: '6617d49f59b4b9dd6b72641d',
    username: 'lala123',
    name: 'melani',
    passwordHash: '$2b$10$qtk28XB1ryteS54gFYf/qehwnL6/SIu4O5pLeSfumGF3nxFxrL8Hm',
    blogs: [],
    __v: 0
  },
  {
    _id: '6617d4c659b4b9dd6b726421',
    username: 'luchin',
    name: 'lucio',
    passwordHash: '$2b$10$HCwxdqavziHRTXI8Ycx6sec2Dg/1d8d0oGNkyfNWsZ.F2jEDNzoBS',
    blogs: [],
    __v: 0
  }
]

const userPass = {
  username: 'chimians',
  password: 'chimians'
}

const usersInDb = async () => {
  const blogs = await User.find({})
  return blogs.map(user => user.toJSON())
}


module.exports = {
  initialBlog, nonExistingId, blogsInDb, initialUser, usersInDb, userPass
}