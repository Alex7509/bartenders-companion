import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import FavoriteButton from '../components/FavoriteButton.jsx';

const API_URL = import.meta.env.VITE_API_URL;

function CocktailDetails() {
  const { id } = useParams();
  const [cocktail, setCocktail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCocktail() {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(`${API_URL}/cocktails/${id}`);
        if (!res.ok) throw new Error('Cocktail not found');
        setCocktail(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadCocktail();
  }, [id]);

  if (loading) return <p className="status">Loading...</p>;

  if (error) {
    return (
      <div className="status">
        <p>{error}</p>
        <Link to="/" className="back">← Back to all cocktails</Link>
      </div>
    );
  }

  return (
    <article className="details">
      <Link to="/" className="back">← Back to all cocktails</Link>

      <div className="title-row">
        <h1>{cocktail.name}</h1>
        <FavoriteButton cocktailId={cocktail._id} />
      </div>
      <p>{cocktail.description}</p>
      <p className="meta">
        {cocktail.glass} · {cocktail.difficulty}
      </p>

      <h2>Ingredients</h2>
      <ul>
        {cocktail.ingredients.map((item) => (
          <li key={item._id}>
            {item.amount} {item.ingredient.name}
          </li>
        ))}
      </ul>

      <h2>Instructions</h2>
      <ol>
        {cocktail.instructions.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
    </article>
  );
}

export default CocktailDetails;