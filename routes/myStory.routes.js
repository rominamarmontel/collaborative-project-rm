const router = require('express').Router()
const User = require('../models/User.model')
const Story = require('../models/Story.model')
const Chapter = require('../models/Chapter.model')
const mongoose = require('mongoose')

// Get a myStory
router.get('/myStories', async (req, res, next) => {
  const allMyStory = await Story.find(
    {
      // chapterCount: { $gt: 0 },
      author: req.session.currentUser._id,
    },
    {},
    { sort: { updatedAt: -1 } }
  ).populate('chapters author')

  res.render('myStories', { allMyStory })
  //res.json(allMyStory)
})

module.exports = router
