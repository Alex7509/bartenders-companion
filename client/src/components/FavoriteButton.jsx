import { useAuth } from '../context/AuthContext.jsx';

function FavoriteButton({ cocktailId }) {
  const { user, toggleFavorite } = useAuth();

  if (!user) return null;

  const isFavorite = user.favorites.includes(cocktailId);

  async function handleClick() {
    try {
      await toggleFavorite(cocktailId);
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <button
      className={`fav-btn ${isFavorite ? 'active' : ''}`}
      onClick={handleClick}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isFavorite ? '♥' : '♡'}
    </button>
  );
}

export default FavoriteButton;