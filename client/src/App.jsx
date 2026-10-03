import { useEffect, useState } from 'react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL;

function App() {
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
    <main className="container">
      <h1>Bartender's Companion</h1>

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
          <article key={cocktail._id} className="card">
            <h2>{cocktail.name}</h2>
            <p>{cocktail.description}</p>
            <p className="meta">
              {cocktail.glass} · {cocktail.difficulty}
            </p>
            <ul>
              {cocktail.ingredients.map((item) => (
                <li key={item._id}>
                  {item.amount} {item.ingredient.name}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </main>
  );
}

export default App;