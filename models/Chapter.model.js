const { Schema, model } = require('mongoose')

const chapterSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    story: {
      type: Schema.Types.ObjectId,
      ref: 'Story',
      required: true,
    },
    content: {
      type: String,
      required: true,
      minLength: 10,
      maxLength: 100,
    },
  },
  { timestamps: true }
)

const Chapter = model('Chapter', chapterSchema)

module.exports = Chapter
