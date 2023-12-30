const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const server = express();
server.use(cors());
server.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/Aditya', { useNewUrlParser: true, useUnifiedTopology: true });

const donationSchema = new mongoose.Schema({
  fullname: String,
  phone: Number,
  email: String,
  msg: String,
  address: String,
});

const Donation = mongoose.model('Donation', donationSchema);

server.post('/submitDonation', async (req, res) => {
  try {
    const { fullname, phone, email, msg, address } = req.body;

    const donation = new Donation({
      fullname,
      phone,
      email,
      msg,
      address,
    });

    const doc = await donation.save();
    console.log(doc);
    res.json(doc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

server.listen(3002, () => {
  console.log('Donation Server started on port 3002');
});
