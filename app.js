require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
const Car = require('./models/cars');
const userController = require('./Controllers/userController');
const carController = require('./Controllers/carcontrollers');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/cars', carController)
app.use(express.static('public'))

const uri = process.env.MONGO_URI;


mongoose.connect(uri)
  .then(() => console.log('Mongoose connected to MongoDB!'))
  .catch(err => console.error('Mongoose connection error:', err));


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    app.use('/users', userController);


    app.get('/cars', async (req, res) => {
      const cars = await Car.find();
      res.json(cars);
    });

    app.post('/cars/create', async (req, res) => {
      try {
        const car = await Car.create(req.body);
        res.status(201).json(car);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    });


    app.get('/', (req, res) => {
      res.send('Hello from Express + MongoDB + Mongoose!');
    });


    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

  } catch (err) {
    console.error(err);
  }

}
run().catch(console.dir);