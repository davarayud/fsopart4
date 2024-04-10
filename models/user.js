const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: 3,
    required: true,
    unique: true
  },
  name: String,
  passwordHash: String,
  blogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  }]
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (document, returnedObjet) => {
    returnedObjet.id = document._id.toString()
    delete returnedObjet._id
    delete returnedObjet.__v
    delete returnedObjet.passwordHash
  }
})

module.exports = mongoose.model('User', userSchema)