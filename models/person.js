const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

// Connect to MongoDB database
mongoose
  .connect(url)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB:', err.message);
  });

// Create a Person schema
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, '{PATH} must be at least 3 characters'],
  },
  number: {
    type: String,
    minLength: [8, '{PATH} must be at least 8 digits'],
    validate: {
      validator: (val) => /^\d{2,3}-\d+$/.test(val),
      message: (props) => `${ props.value } is not a valid number`,
    },
  },
});

// Modify data when it is sent back to client
personSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);
