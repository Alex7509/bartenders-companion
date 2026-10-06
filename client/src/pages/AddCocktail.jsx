import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import RecipeForm from '../components/RecipeForm.jsx';

const API_URL = import.meta.env.VITE_API_URL;

function AddCocktail() {
  const { user, token, loading } = useAuth();
  const navigate = useNavigate();

  async function createCocktail(payload) {
    const res = await fetch(`${API_URL}/cocktails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Could not save the recipe');

    navigate(`/cocktails/${data._id}`);
  }

  if (loading) return <p className="status">Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <RecipeForm
      title="Add a recipe"
      submitLabel="Save recipe"
      onSubmit={createCocktail}
    />
  );
}

export default AddCocktail;