const { Schema, model, SchemaTypeOptions } = require('mongoose')

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const storySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 50,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    chapterCount: {
      type: Number,
      min: 0,
      default: 5,
    },
    chapters: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Chapter',
      },
    ],
  },
  { timestamps: true }
)

const Story = model('Story', storySchema)

module.exports = Story
