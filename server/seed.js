import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Ingredient from './models/Ingredient.js';
import Cocktail from './models/Cocktail.js';
import User from './models/User.js';

dotenv.config();

const ingredientsData = [
  { name: 'White rum', type: 'spirit' },
  { name: 'Tequila', type: 'spirit' },
  { name: 'Vodka', type: 'spirit' },
  { name: 'Gin', type: 'spirit' },
  { name: 'Whiskey', type: 'spirit' },
  { name: 'Triple sec', type: 'liqueur' },
  { name: 'Lime juice', type: 'fruit' },
  { name: 'Lemon juice', type: 'fruit' },
  { name: 'Mint', type: 'herb' },
  { name: 'Sugar syrup', type: 'mixer' },
  { name: 'Soda water', type: 'mixer' },
  { name: 'Tonic water', type: 'mixer' },
  { name: 'Cola', type: 'mixer' },
  { name: 'Ginger beer', type: 'mixer' },
];

await mongoose.connect(process.env.MONGO_URI);

await Cocktail.deleteMany();
await Ingredient.deleteMany();
await User.updateMany({}, { favorites: [] });

const created = await Ingredient.insertMany(ingredientsData);
const byName = Object.fromEntries(created.map((i) => [i.name, i._id]));

const recipe = (list) =>
  list.map(([name, amount]) => ({ ingredient: byName[name], amount }));

await Cocktail.insertMany([
  {
    name: 'Mojito',
    description: 'Fresh Cuban classic with mint and lime.',
    glass: 'Highball',
    difficulty: 'easy',
    ingredients: recipe([
      ['White rum', '50 ml'],
      ['Lime juice', '25 ml'],
      ['Sugar syrup', '15 ml'],
      ['Mint', '8 leaves'],
      ['Soda water', 'top'],
    ]),
    instructions: [
      'Muddle mint with syrup and lime juice.',
      'Add rum and ice.',
      'Top with soda and stir gently.',
    ],
  },
  {
    name: 'Margarita',
    description: 'Sharp, citrusy and salty-rimmed.',
    glass: 'Coupe',
    difficulty: 'easy',
    ingredients: recipe([
      ['Tequila', '50 ml'],
      ['Triple sec', '25 ml'],
      ['Lime juice', '25 ml'],
    ]),
    instructions: [
      'Shake all ingredients with ice.',
      'Strain into a salt-rimmed glass.',
    ],
  },
  {
    name: 'Daiquiri',
    description: 'Simple, balanced and dangerously drinkable.',
    glass: 'Coupe',
    difficulty: 'easy',
    ingredients: recipe([
      ['White rum', '50 ml'],
      ['Lime juice', '25 ml'],
      ['Sugar syrup', '15 ml'],
    ]),
    instructions: ['Shake with ice.', 'Strain into a chilled glass.'],
  },
  {
    name: 'Gin & Tonic',
    description: 'The ultimate two-ingredient highball.',
    glass: 'Highball',
    difficulty: 'easy',
    ingredients: recipe([
      ['Gin', '50 ml'],
      ['Tonic water', '150 ml'],
      ['Lime juice', '10 ml'],
    ]),
    instructions: ['Fill a glass with ice.', 'Add gin, top with tonic, add lime.'],
  },
  {
    name: 'Cuba Libre',
    description: 'Rum and cola with a squeeze of lime.',
    glass: 'Highball',
    difficulty: 'easy',
    ingredients: recipe([
      ['White rum', '50 ml'],
      ['Cola', '120 ml'],
      ['Lime juice', '10 ml'],
    ]),
    instructions: ['Fill a glass with ice.', 'Add rum and lime, top with cola.'],
  },
  {
    name: 'Whiskey Sour',
    description: 'Smooth whiskey balanced with lemon and sugar.',
    glass: 'Old fashioned',
    difficulty: 'medium',
    ingredients: recipe([
      ['Whiskey', '50 ml'],
      ['Lemon juice', '25 ml'],
      ['Sugar syrup', '15 ml'],
    ]),
    instructions: ['Shake all ingredients with ice.', 'Strain over fresh ice.'],
  },
  {
    name: 'Moscow Mule',
    description: 'Vodka, lime and spicy ginger beer.',
    glass: 'Copper mug',
    difficulty: 'easy',
    ingredients: recipe([
      ['Vodka', '50 ml'],
      ['Lime juice', '15 ml'],
      ['Ginger beer', '120 ml'],
    ]),
    instructions: ['Fill a mug with ice.', 'Add vodka and lime, top with ginger beer.'],
  },
]);

console.log('Database seeded');
await mongoose.disconnect();