import { Link } from 'react-router-dom';
import { Article } from '../api/articles';

/**
 * Props for the ArticleCard component
 */
interface ArticleCardProps {
  article: Article;
}

/**
 * Card component to display article information in the article list
 * 
 * @param article The article data to display
 */
const ArticleCard = ({ article }: ArticleCardProps) => {
  /**
   * Formats a date string to a localized date format
   * 
   * @param dateString Date string to format
   * @returns Formatted date string
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    }).format(date);
  };

  /**
   * Truncates text to a maximum length and adds ellipsis
   * 
   * @param text Text to truncate
   * @param maxLength Maximum length of the truncated text
   * @returns Truncated text with ellipsis if needed
   */
  const truncateText = (text: string, maxLength: number = 100): string => {
    if (text.length <= maxLength) return text;
    
    // Trouver le dernier espace avant la limite pour couper au niveau d'un mot complet
    const lastSpace = text.substring(0, maxLength).lastIndexOf(' ');
    const truncatedText = text.substring(0, lastSpace > 0 ? lastSpace : maxLength);
    
    return `${truncatedText}...`;
  };

  return (
    <Link to={`/articles/${article._id}`} className="block">
      <article className="glass-card p-6 h-full flex flex-col">
        <h2 className="text-xl font-semibold mb-2 text-white line-clamp-2">
          {article.title_enhanced}
        </h2>
        
        <p className="text-white/70 mb-4 text-sm flex-grow line-clamp-3">
          {truncateText(article.summary, 120)}
        </p>
        
        <div className="mt-auto">
          <div className="flex flex-wrap gap-2 mb-3">
            {article.tags.slice(0, 3).map((tag) => (
              <span 
                key={tag} 
                className="px-2 py-1 bg-secondary/30 rounded-full text-xs text-white/90"
              >
                {tag}
              </span>
            ))}
            {article.tags.length > 3 && (
              <span className="px-2 py-1 bg-secondary/30 rounded-full text-xs text-white/90">
                +{article.tags.length - 3}
              </span>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-white/60">
              {formatDate(article.created_at)}
            </span>
            <span className="text-xs uppercase text-white/60">
              {article.country}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ArticleCard; 