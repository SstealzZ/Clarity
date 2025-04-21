import { useEffect, useState } from 'react';
import { Article, fetchArticles } from '../api/articles';
import ArticleCard from '../components/ArticleCard';
import FilterDropdown from '../components/FilterDropdown';

/**
 * Props for the HomePage component
 */
interface HomePageProps {
  tags: string[];
  countries: string[];
}

/**
 * HomePage component displaying the list of articles with filtering options
 * 
 * @param tags Array of available tags for filtering
 * @param countries Array of available countries for filtering
 */
const HomePage = ({ tags, countries }: HomePageProps) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true);
      try {
        const data = await fetchArticles(selectedTag, selectedCountry);
        setArticles(data);
      } catch (error) {
        console.error('Failed to load articles:', error);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, [selectedTag, selectedCountry]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Articles Technologiques</h1>
        <p className="text-white/70">
          Découvrez les dernières actualités et tendances du monde de la technologie.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <FilterDropdown
          label="Tag"
          items={tags}
          selectedItem={selectedTag}
          onSelect={setSelectedTag}
        />
        <FilterDropdown
          label="Pays"
          items={countries}
          selectedItem={selectedCountry}
          onSelect={setSelectedCountry}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-white/80">Chargement des articles...</div>
        </div>
      ) : articles.length === 0 ? (
        <div className="glass-panel p-8 text-center">
          <h2 className="text-xl font-medium mb-2">Aucun article trouvé</h2>
          <p className="text-white/70">
            Essayez de modifier vos filtres pour voir plus de résultats.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {articles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;