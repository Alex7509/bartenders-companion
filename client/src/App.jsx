import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import CocktailList from './pages/CocktailList.jsx';
import CocktailDetails from './pages/CocktailDetails.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Favorites from './pages/Favorites.jsx';
import WhatCanIMake from './pages/WhatCanIMake.jsx';
import AddCocktail from './pages/AddCocktail.jsx';
import EditCocktail from './pages/EditCocktail.jsx';


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
            <Link to="/what-can-i-make">What can I make?</Link>
            {user ? (
              <>
                <Link to="/add">Add recipe</Link>
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
          <Route path="/what-can-i-make" element={<WhatCanIMake />} />
          <Route path="/add" element={<AddCocktail />} />
          <Route path="/cocktails/:id/edit" element={<EditCocktail />} />
        </Routes>
      </main>
    </>
  );
}

export default App;