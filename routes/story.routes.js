const router = require('express').Router()
const User = require('../models/User.model')
const Story = require('../models/Story.model')
const Chapter = require('../models/Chapter.model')
const mongoose = require('mongoose')
const isAuthenticated = require('./../middlewares/isAuthenticated')

// Get all the stories
router.get('/stories', async (req, res, next) => {
  const finishedStories = await Story.find({ chapterCount: 0 }).populate(
    'chapters author'
  )

  const unfinishedStories = await Story.find({
    chapterCount: { $gt: 0 },
  }).populate('chapters author')

  res.render('stories', { finishedStories, unfinishedStories })
})

// router.get('/stories', async (req, res, next) => {
//   const finishedStories = []
//   const toContinue = []
//   const stories = await Story.find({
//     author: req.session.currentUser._id,
//   }).populate({
//     path: 'chapters',
//     populate: {
//       path: 'author',
//     },
//   })
//   for (const oneStory of stories) {
//     if (oneStory.chapters.length >= 5) {
//       finishedStories.push(oneStory)
//     } else {
//       toContinue.push(oneStory)
//     }
//   }

//   console.log({ finishedStories, toContinue })
//   res.render('stories', { finishedStories, toContinue })
// })

// for (const oneStory of stories) {
//   const chapters = await Chapter.find({story: oneStory._id})
//   if (chapters.length === 5) {
//     finishedStories.push()
//   }
// }

// Create a story with a chapter
router.post('/stories', async (req, res, next) => {
  try {
    const unfinishedStories = await Story.find({
      chapterCount: { $gt: 0 },
    }).populate('chapters author')

    const chapter = await Chapter.create({
      author: req.session.currentUser._id,
      // story: story._id,
      content: req.body.content,
    })
    const story = await Story.create({
      author: req.session.currentUser._id,
      title: req.body.title,
      chapters: [chapter._id],
    })
    console.log(req.body)
    res.redirect('stories')
  } catch (error) {
    console.log(error)
  }
})

// Get one story
router.get('/stories/:storyId', async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.storyId).populate({
      path: 'chapters',
      populate: {
        path: 'author',
      },
    })
    console.log(story)
    //  res.json(chapter)
    res.render('oneStory', story)
  } catch (error) {
    console.log(error)
  }
})

// Add Chapter
router.post('/stories/:storyId', async (req, res, next) => {
  try {
    const newChapter = { ...req.body }
    const addNewChapter = await Chapter.create(newChapter)
    console.log(addNewChapter)
    res.redirect('/oneStory')
  } catch (error) {
    next(error)
  }
})

// Read a story
router.get('/stories', async (req, res, next) => {
  const finishedStories = await Story.find({ chapterCount: 0 }).populate(
    'chapters author'
  )
  res.render('readFinishedStory', { finishedStories })
})

module.exports = router
