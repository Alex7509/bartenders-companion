import { Routes, Route, Link } from 'react-router-dom';
import CocktailList from './pages/CocktailList.jsx';
import CocktailDetails from './pages/CocktailDetails.jsx';
import './App.css';

function App() {
  return (
    <>
      <header className="header">
        <Link to="/" className="logo">
          Bartender's Companion
        </Link>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<CocktailList />} />
          <Route path="/cocktails/:id" element={<CocktailDetails />} />
          <Route path="*" element={<p className="status">Page not found.</p>} />
        </Routes>
      </main>
    </>
  );
}

export default App;