const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const generateId = require('./generateId');
let persons = require('./persons');

const app = express();
const PORT = process.env.PORT || 3001;
const logFormatStr = (
  ':method :url :status :res[content-length] - :response-time ms :body'
);

// Create custom body token for morgan
logger.token('body', (req) => JSON.stringify(req.body));

app.use(logger(logFormatStr));
app.use(express.static('dist'));
app.use(express.json());
app.use(cors());

app.get('/info', (req, res) => {
  const requestTime = new Date();
  const totalEntries = persons.length;
  const html = `
    <div>
      <p>Phonebook currently has ${ totalEntries } entries.</p>
      <p>Request received: ${ requestTime }</p>
    </div>
  `;

  res.status(200).send(html);
});

app.get('/api/persons', (req, res) => {
  res.status(200).json(persons);
});

app.post('/api/persons', (req, res) => {
  const body = req.body;

  // Check that name and number fields were sent in request
  if (!body.name) return res.status(400).json({
    error: 'Name field missing.',
  });

  if (!body.number) return res.status(400).json({
    error: 'Number field missing.',
  });

  // Check if name already exists in phonebook
  const existingUser = persons.find((p) => p.name === body.name);

  if (existingUser) return res.status(409).json({
    error: 'Name already exists.',
  })

  const person = {
    id: generateId(5000),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  res.json(person);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);

  if (person) {
    res.status(200).json(person);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((p) => p.id !== id);

  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${ PORT }`)
});
