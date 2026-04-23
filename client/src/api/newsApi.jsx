const API_ORIGIN = import.meta.env.VITE_API_BASE || "";
const API_BASE_URL = `${API_ORIGIN}/api/news`;

// Helper: create query string from filters
function createQueryString(filters) {
  const params = new URLSearchParams(filters);
  return params.toString() ? `?${params.toString()}` : "";
}

// Fetch news by category
export async function fetchNewsByCategory(category, filters = {}) {
  try {
    const url = `${API_BASE_URL}/category/${category}${createQueryString(
      filters
    )}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch news for category ${category}: ${response.status}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching category ${category}:`, error);
    throw error;
  }
}

// Search news articles
export async function searchNews(query, filters = {}) {
  try {
    const url = `${API_BASE_URL}/search${createQueryString({
      q: query,
      ...filters,
    })}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to search news: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error searching news:", error);
    throw error;
  }
}

// Fetch top headlines
export async function fetchTopHeadlines(filters = {}) {
  try {
    const url = `${API_BASE_URL}/top-headlines${createQueryString(filters)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch top headlines: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching top headlines:", error);
    throw error;
  }
}
