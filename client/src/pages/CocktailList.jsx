import { useEffect, useState } from 'react';
import CocktailCard from '../components/CocktailCard.jsx';

const API_URL = import.meta.env.VITE_API_URL;

function CocktailList() {
  const [cocktails, setCocktails] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(
          `${API_URL}/cocktails?search=${encodeURIComponent(search)}`
        );
        if (!res.ok) throw new Error('Failed to load cocktails');
        setCocktails(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <>
      <input
        className="search"
        type="text"
        placeholder="Search cocktails..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <p className="status">Loading...</p>}
      {error && <p className="status">{error}</p>}
      {!loading && !error && cocktails.length === 0 && (
        <p className="status">No cocktails found.</p>
      )}

      <div className="grid">
        {cocktails.map((cocktail) => (
          <CocktailCard key={cocktail._id} cocktail={cocktail} />
        ))}
      </div>
    </>
  );
}

export default CocktailList;