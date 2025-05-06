const mongoose = require('mongoose');
const Car = require('./models/cars');
require('dotenv').config();

const cars = [
  { brand: "Toyota", model: "Corolla", year: 2020, colors: ["red", "blue"] },
  { brand: "Ford", model: "Focus", year: 2018, colors: ["black"] },
  { brand: "Tesla", model: "Model 3", year: 2022, colors: ["white", "black"] },
  { brand: "BMW", model: "X5", year: 2019, colors: ["silver", "blue"] },
  { brand: "Audi", model: "A4", year: 2021, colors: ["grey"] }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Car.deleteMany({});
    await Car.insertMany(cars);
    console.log('Seeded car data!');
    mongoose.disconnect();
  })
  .catch(err => console.error(err));