const router = require('express').Router()
const User = require('../models/User.model')
const Story = require('../models/Story.model')
const Chapter = require('../models/Chapter.model')
const mongoose = require('mongoose')
const isAuthenticated = require('./../middlewares/isAuthenticated')

router.get('/profile', async (req, res, next) => {
  const finishedStories = []
  const toContinue = []
  const stories = await Story.find({
    author: req.session.currentUser._id,
  }).populate({
    path: 'chapters',
    populate: {
      path: 'author',
    },
  })
  for (const oneStory of stories) {
    if (oneStory.chapters.length >= 5) {
      finishedStories.push(oneStory)
    } else {
      toContinue.push(oneStory)
    }
  }

  // for (const oneStory of stories) {
  //   const chapters = await Chapter.find({story: oneStory._id})
  //   if (chapters.length === 5) {
  //     finishedStories.push()
  //   }
  // }
  console.log({ finishedStories, toContinue })
  res.render('profile', { finishedStories, toContinue })
})

router.post('/profile/create-story', async (req, res, next) => {
  try {
    const chapter = await Chapter.create({
      author: req.session.currentUser._id,
      // story: story._id,
      content: req.body.story,
    })
    const story = await Story.create({
      author: req.session.currentUser._id,
      title: req.body.title,
      chapters: [chapter._id],
    })
    console.log(req.body)
    res.redirect('/profile')
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
