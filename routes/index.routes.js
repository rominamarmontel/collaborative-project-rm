const express = require('express')
// const isAuthenticated = require('../middlewares/isAuthenticated')
// const exposeUsersToView = require('./../middlewares/exposeUserToView')
const router = express.Router()
const fileUproad = require('../config/cloudinary.config')
const isAuthenticated = require('../middlewares/isAuthenticated')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index')
})
router.use('/', require('./auth.routes'))

router.use(isAuthenticated)
router.use('/', require('./story.routes'))
router.use('/', require('./chapter.routes'))
router.use('/', require('./myStory.routes'))

module.exports = router
