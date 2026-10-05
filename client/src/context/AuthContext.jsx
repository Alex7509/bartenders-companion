import { createContext, useContext, useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('token')));

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    async function loadUser() {
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Invalid token');
        setUser(await res.json());
      } catch {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [token]);

  async function authRequest(path, body) {
    const res = await fetch(`${API_URL}/auth/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Something went wrong');

    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
  }

  const login = (email, password) => authRequest('login', { email, password });

  const register = (username, email, password) =>
    authRequest('register', { username, email, password });

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }

  async function toggleFavorite(cocktailId) {
    const isFavorite = user.favorites.includes(cocktailId);

    const res = await fetch(`${API_URL}/favorites/${cocktailId}`, {
      method: isFavorite ? 'DELETE' : 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Could not update favorites');

    const favorites = await res.json();
    setUser((prev) => ({ ...prev, favorites }));
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, toggleFavorite }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}