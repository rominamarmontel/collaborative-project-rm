const router = require('express').Router()
const User = require('../models/User.model')
const bcrypt = require('bcryptjs')
const isAuthenticated = require('../middlewares/isAuthenticated')
const exposeUsersToView = require('./../middlewares/exposeUserToView')

router.get('/login', async (req, res, next) => {
  res.render('auth/login')
})

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body
  try {
    if (!username || !password) {
      return res.render('auth/login', {
        errorMessage: 'Please fill out all of the fields!',
      })
    }

    const foundUser = await User.findOne(
      { username },
      { password: 1, username: 1 }
    )
    if (!foundUser) {
      return res.render('auth/login', {
        errorMessage: 'Please sign up first!',
      })
    }
    const matchingPass = await bcrypt.compare(password, foundUser.password)
    if (!matchingPass) {
      return res.render('auth/login', {
        errorMessage: 'Invalid credentials!',
      })
    }
    req.session.currentUser = foundUser
    res.redirect('/profile')
  } catch (error) {
    next(error)
  }
})

router.get('/signup', async (req, res, next) => {
  try {
    res.render('auth/signup')
  } catch (error) {
    next(error)
  }
})

router.post('/signup', async (req, res, next) => {
  const { username, password } = req.body
  try {
    if (!username || !password) {
      return res.render('auth/signup', {
        errorMessage: 'Please fill out all of the fields!',
      })
    }
    if (password.length < 6) {
      return res.render('auth/signup', {
        errorMessage: 'Please put a longer password',
      })
    }
    console.log('before finding')
    const foundUser = await User.findOne({ username: username })
    console.log('after finding')

    if (foundUser) {
      return res.render('auth/signup', {
        errorMessage: 'Theres another one of you!',
      })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const userToCreate = {
      username,
      password: hashedPassword,
    }
    const userFromDb = await User.create(userToCreate)
    console.log(userFromDb)
    res.redirect('/login')
  } catch (error) {
    next(error)
  }
})


router.get('/logout', (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      return next(error)
    }
    res.redirect('/login')
  })
})

module.exports = router
