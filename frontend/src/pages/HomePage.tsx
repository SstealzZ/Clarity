import { useEffect, useState } from 'react';
import { Article, fetchArticles, fetchTodayArticles, fetchArticlesByDate } from '../api/articles';
import ArticleCard from '../components/ArticleCard';
import FilterDropdown from '../components/FilterDropdown';
import { DatePicker } from '../components/DatePicker';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date()); // Par défaut, aujourd'hui

  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true);
      try {
        let data;
        
        if (selectedDate) {
          // Formatage de la date pour l'affichage dans les logs
          const formattedDateStr = format(selectedDate, 'yyyy-MM-dd');
          
          // Comparer avec la date d'aujourd'hui pour déterminer s'il faut utiliser l'API today
          const today = new Date();
          const todayStr = format(today, 'yyyy-MM-dd');
          const isToday = formattedDateStr === todayStr;
          
          console.log(`Date sélectionnée: ${formattedDateStr}, Aujourd'hui: ${todayStr}, Est Aujourd'hui: ${isToday}`);
          
          if (isToday) {
            console.log('Récupération des articles du jour');
            data = await fetchTodayArticles(
              selectedTag || undefined,
              selectedCountry || undefined
            );
          } else {
            console.log(`Récupération des articles pour la date: ${formattedDateStr}`);
            data = await fetchArticlesByDate(
              selectedDate,
              selectedTag || undefined,
              selectedCountry || undefined
            );
          }
        } else {
          console.log('Récupération de tous les articles');
          data = await fetchArticles(
            selectedTag || undefined,
            selectedCountry || undefined
          );
        }
        
        console.log(`Articles récupérés: ${data.length}`);
        if (data.length > 0) {
          console.log(`Premier article date: ${data[0].created_at}`);
          
          if (selectedDate) {
            // Vérifiez si les articles sont de la date sélectionnée
            const selectedDateStr = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
            const filteredArticles = data.filter(article => {
              const articleDate = new Date(article.created_at).toISOString().split('T')[0];
              return articleDate === selectedDateStr;
            });
            
            console.log(`Articles de la date ${selectedDateStr}: ${filteredArticles.length} sur ${data.length}`);
          }
        }
        
        setArticles(data);
      } catch (error) {
        console.error('Failed to load articles:', error);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, [selectedTag, selectedCountry, selectedDate]);

  const handleDateChange = (date: Date | undefined) => {
    console.log(`Nouvelle date sélectionnée: ${date ? date.toISOString() : 'aucune'}`);
    setSelectedDate(date);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric'
    }).format(date);
  };

  // Déterminer quelle date est affichée
  const getDisplayDate = () => {
    if (selectedDate) {
      return formatDate(selectedDate.toISOString());
    } else if (articles.length > 0) {
      // Trouver la date la plus récente parmi les articles
      const dates = articles.map(a => new Date(a.created_at).getTime());
      const mostRecentDate = new Date(Math.max(...dates));
      return formatDate(mostRecentDate.toISOString());
    }
    return formatDate(new Date().toISOString());
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Articles Technologiques</h1>
        <p className="text-white/70">
          Découvrez les dernières actualités et tendances du monde de la technologie.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex-1">
          <div className="flex flex-wrap gap-4">
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
        </div>
        
        <div className="w-[200px]">
          <DatePicker 
            date={selectedDate}
            onDateChange={handleDateChange}
            label="Date"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-white/80">Chargement des articles...</div>
        </div>
      ) : articles.length === 0 ? (
        <div className="glass-panel p-8 text-center">
          <h2 className="text-xl font-medium mb-2">Aucun article trouvé</h2>
          <p className="text-white/70">
            {selectedDate 
              ? `Aucun article publié le ${formatDate(selectedDate.toISOString())} avec les filtres sélectionnés.`
              : "Essayez de modifier vos filtres pour voir plus de résultats."}
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