// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const server = express();
server.use(cors());
server.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/signup', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

// Create (Sign Up) Operation
server.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = new User({
      name: name,
      email: email,
      password: password,
    });

    const doc = await user.save();
    console.log(doc);
    res.json(doc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Read (List Users) Operation
server.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update Operation
server.put('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedData = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });

    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete Operation
server.delete('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (deletedUser) {
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Login Operation
server.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
