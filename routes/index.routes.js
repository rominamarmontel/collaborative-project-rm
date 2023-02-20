const express = require('express')
// const isAuthenticated = require('../middlewares/isAuthenticated')
// const exposeUsersToView = require('./../middlewares/exposeUserToView')
const router = express.Router()
const fileUproad = require('../config/cloudinary.config')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index')
})
router.use('/', require('./auth.routes'))
router.use('/', require('./story.routes'))

module.exports = router
