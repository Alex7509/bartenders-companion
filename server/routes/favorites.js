import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Cocktail from '../models/Cocktail.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('favorites');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:cocktailId', async (req, res) => {
  try {
    const { cocktailId } = req.params;

    if (!mongoose.isValidObjectId(cocktailId)) {
      return res.status(400).json({ message: 'Invalid id' });
    }
    if (!(await Cocktail.exists({ _id: cocktailId }))) {
      return res.status(404).json({ message: 'Cocktail not found' });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $addToSet: { favorites: cocktailId } },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:cocktailId', async (req, res) => {
  try {
    const { cocktailId } = req.params;

    if (!mongoose.isValidObjectId(cocktailId)) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $pull: { favorites: cocktailId } },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;