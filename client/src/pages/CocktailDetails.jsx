import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import FavoriteButton from '../components/FavoriteButton.jsx';

const API_URL = import.meta.env.VITE_API_URL;

function CocktailDetails() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [cocktail, setCocktail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

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

  async function handleDelete() {
    if (!window.confirm('Delete this recipe? This cannot be undone.')) return;

    try {
      setDeleting(true);
      const res = await fetch(`${API_URL}/cocktails/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Could not delete the recipe');
      }

      navigate('/');
    } catch (err) {
      alert(err.message);
      setDeleting(false);
    }
  }

  if (loading) return <p className="status">Loading...</p>;

  if (error) {
    return (
      <div className="status">
        <p>{error}</p>
        <Link to="/" className="back">← Back to all cocktails</Link>
      </div>
    );
  }

  const isOwner = Boolean(user && cocktail.createdBy && cocktail.createdBy === user.id);

  return (
    <article className="details">
      <Link to="/" className="back">← Back to all cocktails</Link>

      <div className="title-row">
        <h1>{cocktail.name}</h1>
        <FavoriteButton cocktailId={cocktail._id} />

        {isOwner && (
          <div className="owner-actions">
            <Link to={`/cocktails/${cocktail._id}/edit`} className="action-link">
              Edit
            </Link>
            <button
              type="button"
              className="danger-btn"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}
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