import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import CocktailCard from '../components/CocktailCard.jsx';

const API_URL = import.meta.env.VITE_API_URL;

function Favorites() {
    const { user, token, loading: authLoading } = useAuth();
    const [cocktails, setCocktails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) return;

        async function loadFavorites() {
            try {
                const res = await fetch(`${API_URL}/favorites`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error('Failed to load favorites');
                setCocktails(await res.json());
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadFavorites();
    }, [token]);

    if (authLoading) return <p className="status">Loading...</p>;
    if (!user) return <Navigate to="/login" replace />;

    const visible = cocktails.filter((c) => user.favorites.includes(c._id));

    return (
        <>
            <h1>My favorites</h1>

            {loading && <p className="status">Loading...</p>}
            {error && <p className="status">{error}</p>}
            {!loading && !error && visible.length === 0 && (
                <p className="status">You have no favorites yet.</p>
            )}

            <div className="grid">
                {visible.map((cocktail) => (
                    <CocktailCard key={cocktail._id} cocktail={cocktail} />
                ))}
            </div>
        </>
    );
}

export default Favorites;
