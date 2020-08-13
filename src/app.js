require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
/*const winston = require('winston');*/
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

//Set card router after validateBearerToken
app.use(cardRouter)
app.use(listRouter)

/* -------------------------------------------------------- */
/*                    Test Data                             */
/* -------------------------------------------------------- */
/*const cards = [{
  id: 1,
  title: 'Task One',
  content: 'This is card one'
},
{
  id: 2,
  title: 'Task Two',
  content: 'This is card two'
}
];*/

/*const lists = [{
  id: 1,
  header: 'List One',
  cardIds: [1]
},
{
  id: 2,
  header: 'List Two',
  cardIds: [2]
}
];
*/

/* -------------------------------------------------------- */
/*                         GET /                            */
/* -------------------------------------------------------- */
app.get('/', (req, res) => {
    res.send('Hello, world!')
})

/* -------------------------------------------------------- */
/*                       CARD ID                            */
/* -------------------------------------------------------- */
/*app.get('/card/:id', (req, res) => {
  const { id } = req.params;
  const card = cards.find(c => c.id == id);
  if (!card) {
    logger.error(`Card with id ${id} not found.`);
    return res
      .status(404)
      .send('Card Not Found');
  }
  res.json(card);
});


app.delete('/card/:id', (req, res) => {
  const { id } = req.params;
  const cardIndex = cards.findIndex(li => li.id == id);
  if (cardIndex === -1) {
    logger.error(`Card with id ${id} not found.`);
    return res
      .status(404)
      .send('Not Found');
  }
  cards.splice(cardIndex, 1);
  logger.info(`Card with id ${id} deleted.`);
  res
    .status(204)
    .end();
});*/


/* -------------------------------------------------------- */
/*                          LIST                            */
/* -------------------------------------------------------- */
/*app.get('/list', (req, res) => {
  res
    .json(lists);
});


app.get('/list/:id', (req, res) => {
  const { id } = req.params;
  const list = lists.find(li => li.id == id);

  // make sure we found a list
  if (!list) {
    logger.error(`List with id ${id} not found.`);
    return res
      .status(404)
      .send('List Not Found');
  }

  res.json(list);
});


app.post('/list', (req, res) => {
  const { header, cardIds = [] } = req.body;

  if (!header) {
    logger.error(`Header is required`);
    return res
      .status(400)
      .send('Invalid data');
  }

  // check card IDs
  if (cardIds.length > 0) {
    let valid = true;
    cardIds.forEach(cid => {
      const card = cards.find(c => c.id == cid);
      if (!card) {
        logger.error(`Card with id ${cid} not found in cards array.`);
        valid = false;
      }
    });

    if (!valid) {
      return res
        .status(400)
        .send('Invalid data');
    }
  }

  // get an id
  const id = uuid();

  const list = {
    id,
    header,
    cardIds
  };

  lists.push(list);

  logger.info(`List with id ${id} created`);

  res
    .status(201)
    .location(`http://localhost:8000/list/${id}`)
    .json({id});
});

app.delete('/list/:id', (req, res) => {
  const { id } = req.params;

  const listIndex = lists.findIndex(li => li.id == id);

  if (listIndex === -1) {
    logger.error(`List with id ${id} not found.`);
    return res
      .status(404)
      .send('Not Found');
  }

  lists.splice(listIndex, 1);

  logger.info(`List with id ${id} deleted.`);
  res
    .status(204)
    .end();
});
*/

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