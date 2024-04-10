const lodash = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  const blogMostLikes = blogs.reduce((res, blog) => {
    res.likes > blog.likes ? res : res = blog
    return res
  }, { likes: 0 })
  if ( blogMostLikes.title === undefined){
    return {}
  }
  const result = {
    title: blogMostLikes.title,
    author: blogMostLikes.author,
    likes: blogMostLikes.likes
  }
  return result
}

const mostBlogs = (blogs) => {
  const count = lodash.countBy(blogs, 'author')

  let result = {}
  lodash.forEach(count, (value, key) => {
    result.blogs > value ? result : result = { author: key, blogs: value }
  })
  return result
}

const mostLikes = (blogs) => {
  const authors = lodash.groupBy(blogs,'author')
  const authorLikes = lodash.map(authors, (item, itemID) => {
    let obj = {}
    obj.author = itemID
    obj.likes = item.reduce((sum, blog) => {
      return sum + blog.likes
    }, 0)
    return obj
  })
  const result = lodash.reduce(authorLikes,(res, obj) => {
    return res.likes > obj.likes ? res : res = obj
  }, {})
  return result
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}