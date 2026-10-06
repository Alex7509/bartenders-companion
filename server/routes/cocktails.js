import express from 'express';
import Cocktail from '../models/Cocktail.js';
import auth from '../middleware/auth.js';
import Ingredient from '../models/Ingredient.js';

const router = express.Router();

async function findOrCreateIngredient(rawName) {
  const name = rawName.trim();

  let ingredient = await Ingredient.findOne({ name }).collation({
    locale: 'en',
    strength: 2,
  });

  if (!ingredient) {
    ingredient = await Ingredient.create({ name });
  }

  return ingredient._id;
}

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
    const { name, description, glass, difficulty, ingredients, instructions } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const rows = Array.isArray(ingredients) ? ingredients : [];
    if (rows.length === 0 || rows.some((r) => !r.name?.trim() || !r.amount?.trim())) {
      return res
        .status(400)
        .json({ message: 'Each ingredient needs a name and an amount' });
    }

    const steps = Array.isArray(instructions)
      ? instructions.map((s) => String(s).trim()).filter(Boolean)
      : [];
    if (steps.length === 0) {
      return res.status(400).json({ message: 'Add at least one instruction step' });
    }

    const resolved = [];
    for (const row of rows) {
      resolved.push({
        ingredient: await findOrCreateIngredient(row.name),
        amount: row.amount.trim(),
      });
    }

    const cocktail = await Cocktail.create({
      name: name.trim(),
      description: description?.trim() || '',
      glass: glass?.trim() || '',
      difficulty,
      ingredients: resolved,
      instructions: steps,
      createdBy: req.userId,
    });

    res.status(201).json(cocktail);
  } catch (err) {
    const status = err.name === 'ValidationError' ? 400 : 500;
    res.status(status).json({ message: err.message });
  }
});

export default router;