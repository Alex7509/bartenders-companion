import { Link } from 'react-router-dom';
import FavoriteButton from './FavoriteButton.jsx';

function CocktailCard({ cocktail }) {
  return (
    <div className="card">
      <FavoriteButton cocktailId={cocktail._id} />
      <Link to={`/cocktails/${cocktail._id}`} className="card-link">
        <h2>{cocktail.name}</h2>
        <p>{cocktail.description}</p>
        <p className="meta">
          {cocktail.glass} · {cocktail.difficulty}
        </p>
      </Link>
    </div>
  );
}

export default CocktailCard;