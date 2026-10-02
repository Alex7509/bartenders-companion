import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Ingredient from './models/Ingredient.js';
import Cocktail from './models/Cocktail.js';

dotenv.config();

const ingredientsData = [
  { name: 'White rum', type: 'spirit' },
  { name: 'Tequila', type: 'spirit' },
  { name: 'Triple sec', type: 'liqueur' },
  { name: 'Lime juice', type: 'fruit' },
  { name: 'Mint', type: 'herb' },
  { name: 'Sugar syrup', type: 'mixer' },
  { name: 'Soda water', type: 'mixer' },
];

await mongoose.connect(process.env.MONGO_URI);
await Cocktail.deleteMany();
await Ingredient.deleteMany();

const ing = await Ingredient.insertMany(ingredientsData);
const byName = Object.fromEntries(ing.map((i) => [i.name, i._id]));

await Cocktail.insertMany([
  {
    name: 'Mojito',
    description: 'Fresh Cuban classic with mint and lime.',
    glass: 'Highball',
    difficulty: 'easy',
    ingredients: [
      { ingredient: byName['White rum'], amount: '50 ml' },
      { ingredient: byName['Lime juice'], amount: '25 ml' },
      { ingredient: byName['Sugar syrup'], amount: '15 ml' },
      { ingredient: byName['Mint'], amount: '8 leaves' },
      { ingredient: byName['Soda water'], amount: 'top' },
    ],
    instructions: ['Muddle mint with syrup and lime juice.', 'Add rum and ice.', 'Top with soda and stir gently.'],
  },
  {
    name: 'Margarita',
    description: 'Sharp, citrusy and salty-rimmed.',
    glass: 'Coupe',
    difficulty: 'easy',
    ingredients: [
      { ingredient: byName['Tequila'], amount: '50 ml' },
      { ingredient: byName['Triple sec'], amount: '25 ml' },
      { ingredient: byName['Lime juice'], amount: '25 ml' },
    ],
    instructions: ['Shake all ingredients with ice.', 'Strain into a salt-rimmed glass.'],
  },
]);

console.log('Database seeded');
await mongoose.disconnect();