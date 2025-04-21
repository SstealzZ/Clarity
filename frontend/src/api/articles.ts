import axios from 'axios';

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