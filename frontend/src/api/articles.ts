import axios from 'axios';

// Déclaration de module pour étendre l'interface ImportMeta
declare global {
  interface ImportMeta {
    env: {
      VITE_API_URL?: string;
      VITE_API_TIMEOUT?: string;
      [key: string]: string | undefined;
    };
  }
}

/**
 * API base URL for the backend from environment variables
 */
const API_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * API timeout in milliseconds from environment variables
 */
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10);

/**
 * Axios instance configured with API URL and timeout
 */
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT
});

/**
 * Type definition for an article from the API
 */
export interface Article {
  _id: string;
  title_enhanced: string;
  summary: string;
  context: string;
  insight: string;
  tags: string[];
  link: string;
  country: string;
  created_at: string;
}

/**
 * Fetches all articles with optional filtering
 * 
 * @param tag Optional tag to filter articles
 * @param country Optional country to filter articles
 * @returns Promise with array of articles
 */
export const fetchArticles = async (tag?: string, country?: string): Promise<Article[]> => {
  const params: Record<string, string> = {};
  
  if (tag) params.tag = tag;
  if (country) params.country = country;
  
  const response = await apiClient.get<Article[]>('/articles', { params });
  return response.data;
};

/**
 * Fetches articles published today
 * 
 * @param tag Optional tag to filter articles
 * @param country Optional country to filter articles
 * @returns Promise with array of today's articles
 */
export const fetchTodayArticles = async (tag?: string, country?: string): Promise<Article[]> => {
  // Assurez-vous que le booléen est envoyé en tant que chaîne 'true'
  const params: Record<string, string> = { today: 'true' };
  
  if (tag) params.tag = tag;
  if (country) params.country = country;
  
  console.log('API fetchTodayArticles - Paramètres:', params);
  
  try {
    console.log('Requête articles du jour:', `${API_URL}/articles`, params);
    const response = await apiClient.get<Article[]>('/articles', { params });
    console.log('Réponse articles du jour:', response.data.length, 'articles trouvés');
    
    // Log les dates des articles pour vérifier qu'ils sont bien d'aujourd'hui
    if (response.data.length > 0) {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      console.log('Date aujourdhui:', today);
      
      response.data.slice(0, 3).forEach((article, index) => {
        const articleDate = new Date(article.created_at).toISOString().split('T')[0];
        console.log(`Article ${index + 1} date:`, articleDate, article.created_at);
        console.log(`Est d'aujourd'hui:`, articleDate === today);
      });
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching today articles:', error);
    return [];
  }
};

/**
 * Fetches a single article by ID
 * 
 * @param id The ID of the article to fetch
 * @returns Promise with the article data
 */
export const fetchArticleById = async (id: string): Promise<Article> => {
  const response = await apiClient.get<Article>(`/articles/${id}`);
  return response.data;
};

/**
 * Fetches all unique tags
 * 
 * @returns Promise with array of tag strings
 */
export const fetchTags = async (): Promise<string[]> => {
  const response = await apiClient.get<{ tags: string[] }>('/tags');
  return response.data.tags;
};

/**
 * Fetches all unique countries
 * 
 * @returns Promise with array of country strings
 */
export const fetchCountries = async (): Promise<string[]> => {
  const response = await apiClient.get<{ countries: string[] }>('/countries');
  return response.data.countries;
};

/**
 * Fetches articles published on a specific date
 * 
 * @param date The date to fetch articles for
 * @param tag Optional tag to filter articles
 * @param country Optional country to filter articles
 * @returns Promise with array of articles from the specified date
 */
export const fetchArticlesByDate = async (date: Date, tag?: string, country?: string): Promise<Article[]> => {
  // Afficher la date complète pour débogage
  console.log('Date brute sélectionnée:', date.toString());
  
  // Format the date to YYYY-MM-DD in local timezone
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  
  // Params to send to the API
  const params: Record<string, string> = { date: formattedDate };
  
  if (tag) params.tag = tag;
  if (country) params.country = country;
  
  console.log('API fetchArticlesByDate - Paramètres:', params);
  
  try {
    console.log('Requête articles pour la date:', formattedDate);
    const response = await apiClient.get<Article[]>('/articles', { params });
    console.log('Réponse articles pour la date:', response.data.length, 'articles trouvés');
    
    if (response.data.length > 0) {
      // Vérifier si les articles correspondent bien à la date demandée (pour debug)
      const datesParArticle = response.data.map(article => {
        const articleDate = new Date(article.created_at);
        const articleFormattedDate = `${articleDate.getFullYear()}-${(articleDate.getMonth() + 1).toString().padStart(2, '0')}-${articleDate.getDate().toString().padStart(2, '0')}`;
        
        return {
          id: article._id,
          date: article.created_at,
          formattedDate: articleFormattedDate,
          matches: articleFormattedDate === formattedDate
        };
      });
      
      console.log('Vérification des dates:', datesParArticle);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching articles by date:', error);
    return [];
  }
}; 