const express = require('express');
const logger = require('morgan');
const cors = require('cors');

// Import and setup env variables from .env file
require('dotenv').config();

// const generateId = require('./generateId');
const Person = require('./models/person');

const app = express();
const { PORT } = process.env;
const logFormatStr = (
  ':method :url :status :res[content-length] - :response-time ms :body'
);

// Create custom body token for morgan
logger.token('body', (req) => JSON.stringify(req.body));

app.use(logger(logFormatStr));
app.use(express.static('dist'));
app.use(express.json());
app.use(cors());

app.get('/info', (req, res, next) => {
  const requestTime = new Date();

  Person
    .countDocuments({})
    .then((count) => {
      const html = `
        <div>
          <p>Phonebook currently has ${count} ${count === 1 ? 'entry' : 'entries'}.</p>
          <p>Request received: ${requestTime}</p>
        </div>
      `;

      return res.status(200).send(html);
    })
    .catch((err) => next(err));
});

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then((persons) => res.status(200).json(persons));
});

app.post('/api/persons', (req, res, next) => {
  const { body } = req;

  // Check that name and number fields were sent in request
  if (!body.name) {
    return res.status(400).json({
      error: 'Name field missing',
    });
  }

  if (!body.number) {
    return res.status(400).json({
      error: 'Number field missing',
    });
  }

  // Check if name already exists in phonebook
  // const existingUser = persons.find((p) => p.name === body.name);

  // if (existingUser) return res.status(409).json({
  //   error: 'Name already exists.',
  // })

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  // Save person and return to client
  return person
    .save()
    .then((p) => res.status(201).json(p))
    .catch((err) => next(err));
});

app.get('/api/persons/:id', (req, res, next) => {
  const { id } = req.params;

  Person
    .findById(id)
    .then((person) => {
      if (person) {
        // Person with matching id found
        return res.status(200).json(person);
      }

      // id not found
      return res.status(404).end();
    })
    .catch((err) => next(err));
});

app.put('/api/persons/:id', (req, res, next) => {
  const { body } = req;
  const { id } = req.params;

  // Client must send number field
  if (!body.number) {
    return res.status(400).json({
      error: 'Number field missing',
    });
  }

  return Person
    .findByIdAndUpdate(
      id,
      { number: body.number },
      { new: true, runValidators: true, context: 'query' },
    )
    .then((updatedPerson) => res.status(200).json(updatedPerson))
    .catch((err) => next(err));
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person
    .findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch((err) => next(err));
});

app.use((err, req, res, next) => {
  console.log(err);

  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Malformatted id' });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  // Any other types of errors get generic response
  return res.status(500).json({ error: 'Something went wrong' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
