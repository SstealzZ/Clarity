import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Article, fetchArticleById } from '../api/articles';

/**
 * ArticleDetailPage component for displaying a single article's complete details
 */
const ArticleDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticle = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchArticleById(id);
        setArticle(data);
      } catch (err) {
        setError('Impossible de charger cet article. Il n\'existe peut-être pas ou a été supprimé.');
        console.error('Failed to load article:', err);
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-white/80">Chargement de l'article...</div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="glass-panel p-8 text-center">
        <h2 className="text-xl font-medium mb-4">Erreur</h2>
        <p className="text-white/70 mb-6">{error || 'Article non trouvé'}</p>
        <Link to="/" className="button-primary">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/" className="inline-flex items-center text-white/70 hover:text-white mb-6">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4 mr-1" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M10 19l-7-7m0 0l7-7m-7 7h18" 
          />
        </svg>
        Retour aux articles
      </Link>

      <article className="glass-panel p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{article.title_enhanced}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
            <time dateTime={article.created_at}>
              {formatDate(article.created_at)}
            </time>
            <span className="uppercase">{article.country}</span>
          </div>
        </header>

        <div className="space-y-6 mb-8">
          <section>
            <h2 className="text-xl font-semibold mb-2 text-primary">Résumé</h2>
            <p className="text-white/80 leading-relaxed">{article.summary}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-primary">Contexte</h2>
            <p className="text-white/80 leading-relaxed">{article.context}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-primary">Analyse</h2>
            <p className="text-white/80 leading-relaxed">{article.insight}</p>
          </section>
        </div>

        <footer className="border-t border-white/10 pt-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.map((tag) => (
              <span 
                key={tag} 
                className="px-3 py-1 bg-secondary/30 rounded-full text-sm text-white/90"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <a 
            href={article.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-primary hover:text-primary/80"
          >
            Source originale
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 ml-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </footer>
      </article>
    </div>
  );
};

export default ArticleDetailPage; 