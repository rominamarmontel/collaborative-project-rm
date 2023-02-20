const router = require('express').Router()
const User = require('../models/User.model')
const Story = require('../models/Story.model')
const Chapter = require('../models/Chapter.model')
const mongoose = require('mongoose')

router.get('/profile/create-story', (req, res, next) => {
  try {
    res.render('story/create-story')
  } catch (error) {
    next(error)
  }
})

router.post('/profile/create-story', (req, res, next) => {
  try {
    res.status(200).json()
  } catch (error) {}
})

router.get('/profile/add-chapter', (req, res, next) => {
  try {
    res.status(200).json()
  } catch (error) {}
})

router.post('/profile/add-chapter', (req, res, next) => {
  try {
    res.status(200).json()
  } catch (error) {}
})

router.get('/profile/read-story', (req, res, next) => {
  try {
    res.status(200).json()
  } catch (error) {}
})

router.post('/profile/read-story', (req, res, next) => {
  try {
    res.status(200).json()
  } catch (error) {}
})

module.exports = router
