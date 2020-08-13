require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const { v4: uuid } = require('uuid');
const cardRouter = require('./card/card-router')
const listRouter = require('./list/list-router')

/* -------------------------------------------------------- */
/*                  Morgan setup                            */
/* -------------------------------------------------------- */
//const morganOption = (process.env.NODE_ENV === 'production')
const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

/* -------------------------------------------------------- */
/*                 Express setup                            */
/* -------------------------------------------------------- */
const app = express()

/* middleware that validates an Auth header */
app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    logger.error(`Unauthorized request to path: ${req.path}`);
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  // move to the next middleware
  next()
})

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

//Set router after validateBearerToken
app.use(cardRouter)
app.use(listRouter)

/* -------------------------------------------------------- */
/*                         GET /                            */
/* -------------------------------------------------------- */
app.get('/', (req, res) => {
    res.send('Hello, world!')
})

/* -------------------------------------------------------- */
/*                 Error Handler                            */
/* -------------------------------------------------------- */
app.use(function errorHandler(error, req, res, next) {
    let response
    //if (process.env.NODE_ENV === 'production') {
    if (NODE_ENV === 'production') {
      response = { error: { message: 'server error' } }
    } else {
      console.error(error)
      response = { message: error.message, error }
    }
    res.status(500).json(response)
})
  

module.exports = app