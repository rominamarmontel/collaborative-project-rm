const router = require("express").Router();
const User = require("../models/User.model");
const Story = require("../models/Story.model");
const Chapter = require("../models/Chapter.model");
const mongoose = require("mongoose");
const isAuthenticated = require("./../middlewares/isAuthenticated");

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

router.post("/stories", async (req, res, next) => {
  try {
    const chapter = await Chapter.create({
      author: req.session.currentUser._id,
      // story: story._id,
      content: req.body.story,
    });
    const story = await Story.create({
      author: req.session.currentUser._id,
      title: req.body.title,
      chapters: [chapter._id],
    });
    console.log(req.body);
    res.redirect("stories");
  } catch (error) {
    console.log(error);
  }
});

router.get("/stories/:storyId", async (req, res, next) => {
  console.log('here');
  try {
    const oneStory = await Story.findById(req.params.storyId).populate('chapters');
    res.json(oneStory)
  } catch (error) {
    next(error);
  }
});

// router.post('/stories/:storyId', (req, res, next) => {
//   // const editStory =
//   // const addChapter =
//   res.render('oneStory')
// })


// router.post('/stories/:storyId/delete', (req, res, next) => {
//   // const deleteStory =
//   res.render('oneStory')
// })

module.exports = router;
