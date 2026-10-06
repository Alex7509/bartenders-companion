import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

const EMPTY = {
  name: '',
  description: '',
  glass: '',
  difficulty: 'easy',
  ingredients: [],
  instructions: [],
};

const newIngredientRow = (row = {}) => ({
  id: crypto.randomUUID(),
  name: row.name || '',
  amount: row.amount || '',
});

const newStep = (text = '') => ({ id: crypto.randomUUID(), text });

function RecipeForm({ title, submitLabel, initialValues = EMPTY, onSubmit }) {
  const [details, setDetails] = useState({
    name: initialValues.name,
    description: initialValues.description,
    glass: initialValues.glass,
    difficulty: initialValues.difficulty,
  });

  const [ingredients, setIngredients] = useState(() =>
    initialValues.ingredients.length > 0
      ? initialValues.ingredients.map((row) => newIngredientRow(row))
      : [newIngredientRow()]
  );

  const [steps, setSteps] = useState(() =>
    initialValues.instructions.length > 0
      ? initialValues.instructions.map((text) => newStep(text))
      : [newStep()]
  );

  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadSuggestions() {
      try {
        const res = await fetch(`${API_URL}/ingredients`);
        if (res.ok) setSuggestions(await res.json());
      } catch {
        
      }
    }

    loadSuggestions();
  }, []);

  function handleDetailsChange(e) {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  }

  function updateIngredient(id, field, value) {
    setIngredients((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  }

  function addIngredient() {
    setIngredients((prev) => [...prev, newIngredientRow()]);
  }

  function removeIngredient(id) {
    setIngredients((prev) => prev.filter((row) => row.id !== id));
  }

  function updateStep(id, text) {
    setSteps((prev) => prev.map((step) => (step.id === id ? { ...step, text } : step)));
  }

  function addStep() {
    setSteps((prev) => [...prev, newStep()]);
  }

  function removeStep(id) {
    setSteps((prev) => prev.filter((step) => step.id !== id));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await onSubmit({
        ...details,
        ingredients: ingredients.map(({ name, amount }) => ({ name, amount })),
        instructions: steps.map((step) => step.text),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
      <h1>{title}</h1>

      {error && <p className="error">{error}</p>}

      <label>
        Name
        <input
          type="text"
          name="name"
          value={details.name}
          onChange={handleDetailsChange}
          required
        />
      </label>

      <label>
        Description
        <textarea
          name="description"
          rows={3}
          value={details.description}
          onChange={handleDetailsChange}
        />
      </label>

      <div className="form-row">
        <label>
          Glass
          <input
            type="text"
            name="glass"
            placeholder="e.g. Highball"
            value={details.glass}
            onChange={handleDetailsChange}
          />
        </label>

        <label>
          Difficulty
          <select
            name="difficulty"
            value={details.difficulty}
            onChange={handleDetailsChange}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>
      </div>

      <fieldset>
        <legend>Ingredients</legend>

        <datalist id="ingredient-options">
          {suggestions.map((item) => (
            <option key={item._id} value={item.name} />
          ))}
        </datalist>

        {ingredients.map((row) => (
          <div key={row.id} className="dynamic-row">
            <input
              type="text"
              list="ingredient-options"
              placeholder="Ingredient"
              value={row.name}
              onChange={(e) => updateIngredient(row.id, 'name', e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Amount (e.g. 50 ml)"
              value={row.amount}
              onChange={(e) => updateIngredient(row.id, 'amount', e.target.value)}
              required
            />
            <button
              type="button"
              className="remove-btn"
              onClick={() => removeIngredient(row.id)}
              disabled={ingredients.length === 1}
              aria-label="Remove ingredient"
            >
              ✕
            </button>
          </div>
        ))}

        <button type="button" className="add-btn" onClick={addIngredient}>
          + Add ingredient
        </button>
      </fieldset>

      <fieldset>
        <legend>Instructions</legend>

        {steps.map((step, index) => (
          <div key={step.id} className="dynamic-row">
            <span className="step-number">{index + 1}.</span>
            <input
              type="text"
              placeholder="Describe this step"
              value={step.text}
              onChange={(e) => updateStep(step.id, e.target.value)}
              required
            />
            <button
              type="button"
              className="remove-btn"
              onClick={() => removeStep(step.id)}
              disabled={steps.length === 1}
              aria-label="Remove step"
            >
              ✕
            </button>
          </div>
        ))}

        <button type="button" className="add-btn" onClick={addStep}>
          + Add step
        </button>
      </fieldset>

      <button type="submit" className="submit-btn" disabled={submitting}>
        {submitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}

export default RecipeForm;