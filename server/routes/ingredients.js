import express from 'express';
import Ingredient from '../models/Ingredient.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const ingredients = await Ingredient.find().sort('name');
    res.json(ingredients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;