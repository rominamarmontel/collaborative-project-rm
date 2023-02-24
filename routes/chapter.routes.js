const Chapter = require('../models/Chapter.model')
const Story = require('../models/Story.model')
const router = require('express').Router()

router.get('/chapters/:chapterId/edit', async (req, res, next) => {
  try {
    const { chapterId } = req.params
    const chapterToUpdate = await Chapter.findOne({
      _id: chapterId,
      author: req.session.currentUser._id,
    }).populate('author')

    if (!chapterToUpdate) {
      return res.render('not-found')
    }

    const story = await Story.findOne({ chapters: chapterId })
    // console.log({chapterToUpdate, story});
    res.render('editStory', { chapterToUpdate, story })
    //res.json(foundStory)
  } catch (error) {
    console.log(error)
  }
})

router.post('/chapters/:chapterId/edit', async (req, res, next) => {
  try {
    const { chapterId } = req.params
    const { content } = req.body

    const foundStory = await Story.findOne({ chapters: chapterId }).populate(
      'chapters'
    )
    if (!foundStory) {
      return res.render('not-found')
    }
    const lastChapter = foundStory.chapters[story.chapters.length - 1]
    const thisChapterIsLast = lastChapter._id.equals(chapterId)
    const userIsAuthor = lastChapter.author.equals(req.session.currentUser._id)

    console.log(thisChapterIsLast, userIsAuthor)

    if (!thisChapterIsLast || !userIsAuthor) {
      return res.sendStatus(403) //forbidden
    }

    await Chapter.findByIdAndUpdate(chapterId, { content })

    res.redirect(`/stories/${foundStory.id}`)
  } catch (error) {
    console.log(error)
  }
})

router.post('/chapters/:chapterId/delete', async (req, res, next) => {
  try {
    const { chapterId } = req.params

    const foundStory = await Story.findOne({ chapters: chapterId }).populate(
      'chapters'
    )
    if (!foundStory) {
      return res.render('not-found')
    }
    const lastChapter = foundStory.chapters[foundStory.chapters.length - 1]
    const thisChapterIsLast = lastChapter._id.equals(chapterId)
    const userIsAuthor = lastChapter.author.equals(req.session.currentUser._id)

    if (!thisChapterIsLast || !userIsAuthor) {
      return res.sendStatus(403) //forbidden
    }

    await Chapter.findByIdAndDelete(chapterId)
    if (foundStory.chapters.length === 1) {
      await Story.findByIdAndDelete(foundStory.id)
      res.redirect(`/stories`)
    } else {
      await Story.findByIdAndUpdate(foundStory.id, {
        $pop: { chapters: 1 },
        $inc: { chapterCount: 1 },
      })
      res.redirect(`/stories/${foundStory.id}`)
    }
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
