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
      content: req.body.story,
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
 console.log(story);
     //  res.json(chapter)
    res.render('oneStory', story)
  } catch (error) {
    console.log(error)
  }
})

// Edit a story and add a new chapter to a story
router.post('/stories/edit/:storyId', async (req, res, next) => {
  console.log(req.body)
  try {
    const editStory = await Story.findByIdAndUpdate({
      author: req.body.author,
      title: req.body.title,
      chapters: [chapter._id]
    })
    const editChapter = await Chapter.findByIdAndUpdate({
      author: req.body.author,
      content: req.body.content
    })

    const addNewChapter = await Story.findById(req.params.storyId)
    const chapter = await Chapter.create({
      author: req.session.currentUser._id,
      // story: story._id,
      content: req.body.story,
    })

    res.render('oneStory')
  } catch (error) {
    next(error)
  }
})

//Delete a story
router.post('/stories/:storyId/delete', async (req, res, next) => {
  try {
    await Story.findByIdAndDelete(req.params.storyId)
    console.log({ message: `This story with id: ${req.params.storyId} was deleted` })
    res.render('oneStory')
  } catch (error) {
    next(error)
  }
})

//Delete a chapter
router.post('/chapters/:chapterId/delete', async (req, res, next) => {
  try {
    await Chapter.findByIdAndDelete(req.params.chapterId)
    console.log({ message: `This chapter with id: ${req.params.chapterId} was deleted` })
    res.render('oneStory')
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
