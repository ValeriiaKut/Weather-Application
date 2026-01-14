import { useState, useEffect, useMemo, useCallback } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import HomePage from './pages/HomePage'
import CityDetailPage from './pages/CityDetailPage'
import FavoritesPage from './pages/FavoritesPage'
import './App.css'

function App() {
  const [miasta, setMiasta] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div>
        <h1>Ładowanie danych pogodowych...</h1>
        <p>Proszę czekać...</p>
      </div>
    );
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage miasta={miasta}/>} />
          <Route path="/miasto/:cityId" element={<CityDetailPage miasta={miasta}/>} />
          <Route path='/ulubione' element={<FavoritesPage miasta={miasta}/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App