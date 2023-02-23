const router = require("express").Router();
const User = require("../models/User.model");
const Story = require("../models/Story.model");
const Chapter = require("../models/Chapter.model");
const mongoose = require("mongoose");
const isAuthenticated = require("./../middlewares/isAuthenticated");

// Get all the stories
router.get("/stories", async (req, res, next) => {
  const finishedStories = await Story.find(
    { chapterCount: 0 },
    {},
    { sort: { updatedAt: -1 } }
  ).populate("chapters author");

  const unfinishedStories = await Story.find(
    {
      chapterCount: { $gt: 0 },
    },
    {},
    { sort: { updatedAt: -1 } }
  ).populate("chapters author");

  res.render("stories", { finishedStories, unfinishedStories });
});

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
router.post("/stories", async (req, res, next) => {
  try {
    // const unfinishedStories = await Story.find({
    //   chapterCount: { $gt: 0 },
    // }).populate('chapters author')

    const chapter = await Chapter.create({
      author: req.session.currentUser._id,
      // story: story._id,
      content: req.body.content,
    });
    const story = await Story.create({
      author: req.session.currentUser._id,
      title: req.body.title,
      chapters: [chapter._id],
      // chapterCount: req.body.chapterCount,--->stories.hbs line 10
    });
    console.log(req.body);
    res.redirect("/stories");
  } catch (error) {
    console.log(error);
  }
});

// Get one story
router.get("/stories/:storyId", async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.storyId).populate({
      path: "chapters",
      populate: {
        path: "author",
        model: User,
      },
    });
    // console.log('ines', story.chapters[story.chapters.length - 1])
    if (story.chapters.at(-1)) {
      const isUserAuthorOfLastChapter = story.chapters
        .at(-1)
        .author._id.equals(req.session.currentUser._id);

      story.chapters.at(-1)._doc.editable = isUserAuthorOfLastChapter;
    }

    // console.log(story.chapters.at(-1))
    //  res.json(chapter)
    res.render("oneStory", story);
  } catch (error) {
    console.log(error);
  }
});

// Add Chapter
router.post("/stories/:storyId", async (req, res, next) => {
  try {
    const foundStory = await Story.findById(req.params.storyId);
    if (!foundStory) {
      return res.render("not-found");
    }
    if (foundStory.chapterCount === 0) {
      return res.sendStatus(403); // forbidden
    }
    const chapter = await Chapter.create({
      author: req.session.currentUser._id,
      content: req.body.content,
    });
    await Story.findByIdAndUpdate(req.params.storyId, {
      $push: { chapters: chapter._id },
      $inc: { chapterCount: -1 },
    });
    res.redirect(`/stories/${req.params.storyId}`);
  } catch (error) {
    next(error);
  }
});

// Read a story
router.get("/stories", async (req, res, next) => {
  const finishedStories = await Story.find({ chapterCount: 0 }).populate(
    "chapters author"
  );
  res.render("readFinishedStory", { finishedStories });
});

module.exports = router;
