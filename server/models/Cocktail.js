import mongoose from 'mongoose';
import "./Ingredient.js"

const cocktailSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    glass: { type: String, default: '' },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'easy',
    },
    ingredients: [
      {
        ingredient: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient', required: true },
        amount: { type: String, required: true },
      },
    ],
    instructions: [String],
  },
  { timestamps: true }
);

export default mongoose.model('Cocktail', cocktailSchema);