import express from 'express';
import Cocktail from '../models/Cocktail.js';
import auth from '../middleware/auth.js';

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

router.get('/makeable', async (req, res) => {
  try {
    const owned = new Set((req.query.ingredients || '').split(',').filter(Boolean));

    if (owned.size === 0) {
      return res.json({ ready: [], almost: [] });
    }

    const cocktails = await Cocktail.find().populate('ingredients.ingredient');

    const ready = [];
    const almost = [];

    for (const cocktail of cocktails) {
      const missing = cocktail.ingredients
        .map((item) => item.ingredient)
        .filter(Boolean)
        .filter((ingredient) => !owned.has(ingredient._id.toString()));

      if (missing.length === 0) {
        ready.push(cocktail);
      } else if (missing.length === 1) {
        almost.push({ cocktail, missing: missing[0].name });
      }
    }

    res.json({ ready, almost });
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


router.post('/', auth, async (req, res) => {
  try {
    const cocktail = await Cocktail.create(req.body);
    res.status(201).json(cocktail);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;