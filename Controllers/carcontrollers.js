const express = require('express');
const router = express.Router();
const Car = require('../models/cars')


router.get('/', async (req, res) => {
  const cars = await Car.find();
  res.json(cars);
});


router.post('/create', async (req, res) => {
  try {
    const car = await Car.create(req.body);
    res.status(201).json(car);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.post('/save', async (req, res) => {
  try {
    const car = new Car(req.body);
    const savedCar = await car.save();
    res.status(201).json(savedCar);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.get('/find', async (req, res) => {
  const query = req.query;
  const cars = await Car.find(query);
  res.json(cars);
});


router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.json(car);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.get('/one/:brand', async (req, res) => {
  try {
    const car = await Car.findOne({ brand: req.params.brand });
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.json(car);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.put('/update', async (req, res) => {
  try {
    const filter = req.body.filter || {};
    const update = req.body.update || {};
    const result = await Car.updateMany(filter, update);
    res.json({ matched: result.matchedCount, modified: result.modifiedCount });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.put('/updateone', async (req, res) => {
  try {
    const filter = req.body.filter || {};
    const update = req.body.update || {};
    const result = await Car.updateOne(filter, update);
    res.json({ matched: result.matchedCount, modified: result.modifiedCount });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.put('/findbyidupdate/:id', async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.json(car);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.delete('/delete', async (req, res) => {
  try {
    const filter = req.body || {};
    const result = await Car.deleteMany(filter);
    res.json({ deleted: result.deletedCount });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.delete('/deleteone', async (req, res) => {
  try {
    const filter = req.body || {};
    const result = await Car.deleteOne(filter);
    res.json({ deleted: result.deletedCount });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.json({ message: 'Car deleted', car });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;