const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');  // Import cors module

const app = express();
const port = 3001;

// Enable CORS for all routes
app.use(cors());

mongoose.connect('mongodb://localhost:27017/birthdayWishesDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Wish = mongoose.model('Wish', {
  name: String,
  message: String,
  image: String,
});

app.use(bodyParser.json());

app.post('/submitWish', async (req, res) => {
  const { name, message, image } = req.body;

  const newWish = new Wish({ name, message, image });
  await newWish.save();

  res.sendStatus(201);
});

app.get('/getWishes', async (req, res) => {
  const wishes = await Wish.find();
  res.json(wishes);
});

app.delete('/deleteWish/:id', async (req, res) => {
  const wishId = req.params.id;
  await Wish.findByIdAndDelete(wishId);
  res.sendStatus(204);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
