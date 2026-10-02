import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  type: {
    type: String,
    enum: ['spirit', 'liqueur', 'mixer', 'fruit', 'herb', 'other'],
    default: 'other',
  },
});

export default mongoose.model('Ingredient', ingredientSchema);