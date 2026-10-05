import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import CocktailList from './pages/CocktailList.jsx';
import CocktailDetails from './pages/CocktailDetails.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Favorites from './pages/Favorites.jsx';
import './App.css';

function App() {
  const { user, loading, logout } = useAuth();

  return (
    <>
      <header className="header">
        <Link to="/" className="logo">
          Bartender's Companion
        </Link>

        {!loading && (
          <nav className="nav">
            {user ? (
              <>
               <Link to="/favorites">Favorites</Link>
                <span>Hi, {user.username}</span>
                <button className="link-btn" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
          </nav>
        )}
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<CocktailList />} />
          <Route path="/cocktails/:id" element={<CocktailDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<p className="status">Page not found.</p>} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </main>
    </>
  );
}

export default App;