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
  name: String,
  number: Number,
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
