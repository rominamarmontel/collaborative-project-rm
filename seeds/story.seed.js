const Story = require('../models/Story.model')
const User = require('../models/User.model')
const openConnection = require('../db/')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const stories = [
  {
    title: 'URASHIMA TARO',
    author: 'Romi',
    chapterCount: 1,
  },
  {
    title: 'CENDRILLON',
    author: 'Marianne',
    chapterCount: 1,
  },
  {
    title: 'Ma journee Ironhack',
    author: 'Bob Sponge',
    chapterCount: 1,
  },
]

async function seedDatabase() {
  try {
    const db = await openConnection()
    console.log(`Succesfully connected to ${db.connection.name} database.`)
    // await Story.deleteMany()
    // await User.deleteMany()

    await seedUsers()
    await seedStories()
    await mongoose.disconnect()
    console.log(`Succesfully disconnected from ${db.connection.name}`)
  } catch (error) {
    console.error(
      `Something went wrong while creating the seed: ${error.message}`
    )
  }
}

seedDatabase()

async function seedStories() {
  try {
    for (const story of stories) {
      const storyAuthor = await User.findOne({ username: story.author })
      story.author = storyAuthor._id
    }
    const createdStories = await Story.create(stories)
    console.log(`Created ${createdStories.length} stories`)
  } catch (error) {
    console.log(error)
  }
}

async function seedUsers() {
  try {
    const users = stories.map((story) => {
      const password = process.env.SEED_USERS_PASSWORD

      const salt = bcrypt.genSaltSync(10)
      const hashedPassword = bcrypt.hashSync(password, salt)

      return {
        username: story.author,
        password: hashedPassword,
      }
    })
    await User.create(users)
  } catch (error) {
    console.log(error)
  }
}
