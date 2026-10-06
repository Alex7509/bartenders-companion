import express from 'express';
import mongoose from 'mongoose';
import Cocktail from '../models/Cocktail.js';
import Ingredient from '../models/Ingredient.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

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

async function parseCocktailBody(body) {
  const { name, description, glass, difficulty, ingredients, instructions } = body;

  if (!name?.trim()) {
    return { error: 'Name is required' };
  }

  const rows = Array.isArray(ingredients) ? ingredients : [];
  if (rows.length === 0 || rows.some((r) => !r.name?.trim() || !r.amount?.trim())) {
    return { error: 'Each ingredient needs a name and an amount' };
  }

  const steps = Array.isArray(instructions)
    ? instructions.map((s) => String(s).trim()).filter(Boolean)
    : [];
  if (steps.length === 0) {
    return { error: 'Add at least one instruction step' };
  }

  const resolved = [];
  for (const row of rows) {
    resolved.push({
      ingredient: await findOrCreateIngredient(row.name),
      amount: row.amount.trim(),
    });
  }

  return {
    data: {
      name: name.trim(),
      description: description?.trim() || '',
      glass: glass?.trim() || '',
      difficulty: difficulty || 'easy',
      ingredients: resolved,
      instructions: steps,
    },
  };
}

async function getOwnedCocktail(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).json({ message: 'Invalid id' });
    return null;
  }

  const cocktail = await Cocktail.findById(req.params.id);
  if (!cocktail) {
    res.status(404).json({ message: 'Cocktail not found' });
    return null;
  }

  if (cocktail.createdBy?.toString() !== req.userId) {
    res.status(403).json({ message: 'You can only change your own recipes' });
    return null;
  }

  return cocktail;
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
    const { error, data } = await parseCocktailBody(req.body);
    if (error) return res.status(400).json({ message: error });

    const cocktail = await Cocktail.create({ ...data, createdBy: req.userId });
    res.status(201).json(cocktail);
  } catch (err) {
    const status = err.name === 'ValidationError' ? 400 : 500;
    res.status(status).json({ message: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const cocktail = await getOwnedCocktail(req, res);
    if (!cocktail) return;

    const { error, data } = await parseCocktailBody(req.body);
    if (error) return res.status(400).json({ message: error });

    Object.assign(cocktail, data);
    await cocktail.save();

    res.json(cocktail);
  } catch (err) {
    const status = err.name === 'ValidationError' ? 400 : 500;
    res.status(status).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const cocktail = await getOwnedCocktail(req, res);
    if (!cocktail) return;

    await cocktail.deleteOne();
    await User.updateMany(
      { favorites: cocktail._id },
      { $pull: { favorites: cocktail._id } }
    );

    res.json({ message: 'Cocktail deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;