import NewsCard from './NewsCard';

const NewsGrid = ({ articles, loading, error }) => {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading news articles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3 className="error-title">Error</h3>
        <p className="error-text">An error occurred while fetching news articles. Please try again later.</p>
        <p className="error-subtext">The system is attempting to resolve the issue. Please try again shortly.</p>
        <button className="retry-btn" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="empty-container">
        <h3 className="empty-title">No Articles Available</h3>
        <p className="empty-text">Please adjust your search terms or filters to find relevant content.</p>
      </div>
    );
  }

  return (
    <div className="news-grid">
      {articles.map((article, index) => (
        <NewsCard key={`${article.article_id || article.link || index}`} article={article} />
      ))}
    </div>
  );
};

export default NewsGrid;