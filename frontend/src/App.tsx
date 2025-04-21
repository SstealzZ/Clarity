import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import { fetchTags, fetchCountries } from './api/articles';

/**
 * Main application component that sets up routing and global state
 */
function App() {
  const [tags, setTags] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [tagsData, countriesData] = await Promise.all([
          fetchTags(),
          fetchCountries()
        ]);
        
        setTags(tagsData);
        setCountries(countriesData);
      } catch (error) {
        console.error('Failed to load filters:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFilters();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-white/80">Chargement...</div>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<HomePage tags={tags} countries={countries} />} />
            <Route path="/articles/:id" element={<ArticleDetailPage />} />
          </Routes>
        )}
      </main>
      
      <footer className="bg-surface/50 backdrop-blur-sm py-4 border-t border-white/10">
        <div className="container mx-auto px-4 text-white/50 text-sm text-center">
          Clarity &copy; {new Date().getFullYear()} - SynapseOS
        </div>
      </footer>
    </div>
  );
}

export default App; 