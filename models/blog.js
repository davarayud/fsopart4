const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: String,
  url: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  likes: Number
})

blogSchema.set('toJSON', {
  transform: (document, returnedObjet) => {
    returnedObjet.id = returnedObjet._id.toString()
    delete returnedObjet._id
    delete returnedObjet.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)
