const router = require('express').Router()
const User = require('../models/User.model')
const Story = require('../models/Story.model')
const Chapter = require('../models/Chapter.model')
const mongoose = require('mongoose')
const isAuthenticated = require('./../middlewares/isAuthenticated')

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

router.post('/stories', async (req, res, next) => {
  try {
    let unfinishedStories = await Story.find({
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

router.get('/stories/:storyId', async (req, res, next) => {
  try {
    const chapter = await Story.findById(req.params.storyId).populate(
      'chapters'
    )
    // res.render('oneStory', chapter)
    //  res.json(chapter)
    console.log('chapter:', chapter)
  } catch (error) {
    console.log(error)
  }
})

router.post('/stories/:id/edit', async (req, res, next) => {
  console.log(req.body)
  try {
    const updatedChapter = await Chapter.findByIdAndUpdate({
      author: req.session.currentUser._id,
      content: req.body.story,
    })
    const updatedStory = await Story.findByIdAndUpdate({
      author: req.session.currentUser._id,
      title: req.body.title,
      chapters: [chapter._id],
    })
    res.redirect('stories')
  } catch (error) {
    next(error)
  }
})

// router.post('/stories/:storyId/delete', (req, res, next) => {
//   // const deleteStory =
//   res.render('oneStory')
// })

module.exports = router
