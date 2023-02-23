const Story = require('../models/Story.model')
const User = require('../models/User.model')
const openConnection = require('../db/')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Chapter = require('../models/Chapter.model')

const stories = [
  {
    title: 'Urashima Taro',
    author: 'Romi2',
    chapterCount: 3,
    chapters: ['blablabla', 'bliblibli'],
  },
  {
    title: 'Cinderella',
    author: 'Marianne2',
    chapterCount: 5,
    chapters: [],
  },
  {
    title: 'A typical day at Ironhack',
    author: 'Bob Sponge',
    chapterCount: 5,
    chapters: [],
  },
]

async function seedDatabase() {
  try {
    const db = await openConnection()
    console.log(`Succesfully connected to ${db.connection.name} database.`)
    await Story.deleteMany()
    await User.deleteMany()
    await Chapter.deleteMany()

    await seedUsers()
    await seedChapters()
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
      for (let i = 0; i < story.chapters.length; i++) {
        const storyChapter = await Chapter.findOne({
          content: story.chapters[i],
          author: story.author,
        })
        if (storyChapter) {
          story.chapters[i] = storyChapter._id
        }
      }
    }
    console.log(stories)
    const createdStories = await Story.create(stories)
    console.log(`Created ${createdStories.length} stories`)
  } catch (error) {
    console.log(error)
  }
}

async function seedChapters() {
  try {
    for (const story of stories) {
      for (const chapter of story.chapters) {
        const storyAuthor = await User.findOne({ username: story.author })
        const storyChapter = await Chapter.create({
          author: storyAuthor._id,
          content: chapter,
        })
      }
    }
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
