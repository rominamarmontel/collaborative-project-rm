const { Schema, model } = require('mongoose')

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  picture: {
    type: String,
    default:
      'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png',
  },
  // this second object adds extra properties: `createdAt` and `updatedAt`
  // {
  //   timestamps: true,
  // }
})

const User = model('User', userSchema)

module.exports = User
