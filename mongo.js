const mongoose = require('mongoose');

const { Schema } = mongoose;
const argsLength = process.argv.length;

// Exit if user doesn't provide enough args
if (argsLength < 3) {
  console.log('You must provide a password.');
  process.exit(1);
}

const password = process.argv[2];
const url = (
  `mongodb+srv://fullstack:${password}@cluster0.wlwlrlf.mongodb.net/phonebook?retryWrites=true&w=majority`
);

mongoose.connect(url);

// Mongoose schemas
const personSchema = new Schema({
  name: String,
  number: Number,
});

// Mongoose models
const Person = mongoose.model('Person', personSchema);

// Display all entries in phonebook
if (argsLength === 3) {
  Person
    .find({})
    .then((persons) => {
      console.log('Phonebook entries:');
      persons.forEach((p) => (
        console.log(`Name: ${p.name} | Number: ${p.number}`)
      ));
      mongoose.connection.close();
    });
}

// Add person to database
if (argsLength === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person
    .save()
    .then(() => {
      console.log(`Added ${person.name} with number ${person.number} to phonebook.`);
      mongoose.connection.close();
    });
}
