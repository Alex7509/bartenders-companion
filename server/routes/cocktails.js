import express from 'express';
import Cocktail from '../models/Cocktail.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const filter = search ? { name: { $regex: search, $options: 'i' } } : {};
    const cocktails = await Cocktail.find(filter).populate('ingredients.ingredient');
    res.json(cocktails);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const cocktail = await Cocktail.findById(req.params.id).populate('ingredients.ingredient');
    if (!cocktail) return res.status(404).json({ message: 'Cocktail not found' });
    res.json(cocktail);
  } catch (err) {
    res.status(400).json({ message: 'Invalid id' });
  }
});


router.post('/', async (req, res) => {
  try {
    const cocktail = await Cocktail.create(req.body);
    res.status(201).json(cocktail);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;