import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import RecipeForm from '../components/RecipeForm.jsx';

const API_URL = import.meta.env.VITE_API_URL;

function EditCocktail() {
  const { id } = useParams();
  const { user, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [cocktail, setCocktail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCocktail() {
      try {
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

  async function updateCocktail(payload) {
    const res = await fetch(`${API_URL}/cocktails/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Could not save changes');

    navigate(`/cocktails/${id}`);
  }

  if (authLoading || loading) return <p className="status">Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (error) return <p className="status">{error}</p>;

  if (cocktail.createdBy !== user.id) {
    return <p className="status">You can only edit your own recipes.</p>;
  }

  const initialValues = {
    name: cocktail.name,
    description: cocktail.description,
    glass: cocktail.glass,
    difficulty: cocktail.difficulty,
    ingredients: cocktail.ingredients.map((item) => ({
      name: item.ingredient.name,
      amount: item.amount,
    })),
    instructions: cocktail.instructions,
  };

  return (
    <RecipeForm
      key={cocktail._id}
      title="Edit recipe"
      submitLabel="Save changes"
      initialValues={initialValues}
      onSubmit={updateCocktail}
    />
  );
}

export default EditCocktail;