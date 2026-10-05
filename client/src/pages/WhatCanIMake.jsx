import { useEffect, useState } from 'react';
import CocktailCard from '../components/CocktailCard.jsx';

const API_URL = import.meta.env.VITE_API_URL;

function WhatCanIMake() {
  const [ingredients, setIngredients] = useState([]);
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState({ ready: [], almost: [] });
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadIngredients() {
      try {
        const res = await fetch(`${API_URL}/ingredients`);
        if (!res.ok) throw new Error('Failed to load ingredients');
        setIngredients(await res.json());
      } catch (err) {
        setError(err.message);
      }
    }

    loadIngredients();
  }, []);

  useEffect(() => {
    if (selected.length === 0) return;

    let ignore = false;

    async function loadResult() {
      try {
        const res = await fetch(
          `${API_URL}/cocktails/makeable?ingredients=${selected.join(',')}`
        );
        if (!res.ok) throw new Error('Failed to load cocktails');
        const data = await res.json();
        if (!ignore) {
          setResult(data);
          setError('');
        }
      } catch (err) {
        if (!ignore) setError(err.message);
      }
    }

    loadResult();

    return () => {
      ignore = true;
    };
  }, [selected]);

  function toggleIngredient(id) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  const hasSelection = selected.length > 0;
  const ready = hasSelection ? result.ready : [];
  const almost = hasSelection ? result.almost : [];

  return (
    <>
      <h1>What can I make?</h1>
      <p className="meta">Select the ingredients you have at the bar.</p>

      {error && <p className="status">{error}</p>}

      <div className="chips">
        {ingredients.map((ingredient) => (
          <button
            key={ingredient._id}
            type="button"
            className={`chip ${selected.includes(ingredient._id) ? 'selected' : ''}`}
            onClick={() => toggleIngredient(ingredient._id)}
          >
            {ingredient.name}
          </button>
        ))}
      </div>

      {hasSelection && (
        <button
          type="button"
          className="link-btn clear-btn"
          onClick={() => setSelected([])}
        >
          Clear selection
        </button>
      )}

      {hasSelection && ready.length === 0 && almost.length === 0 && (
        <p className="status">Nothing matches yet. Try adding more ingredients.</p>
      )}

      {ready.length > 0 && (
        <section>
          <h2>You can make ({ready.length})</h2>
          <div className="grid">
            {ready.map((cocktail) => (
              <CocktailCard key={cocktail._id} cocktail={cocktail} />
            ))}
          </div>
        </section>
      )}

      {almost.length > 0 && (
        <section>
          <h2>Almost there ({almost.length})</h2>
          <div className="grid">
            {almost.map(({ cocktail, missing }) => (
              <div key={cocktail._id}>
                <CocktailCard cocktail={cocktail} />
                <p className="missing">Missing: {missing}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default WhatCanIMake;