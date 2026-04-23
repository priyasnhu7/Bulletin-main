import { useState } from 'react';

const Header = ({ onSearch, searchQuery, setSearchQuery }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-section">
          <div className="logo-icon">
            <img height="32" src="/logo.png" alt="logo" />
          </div>
          <h1 className="logo-text" style={{fontFamily: "'Playfair Display', 'Times New Roman', serif", fontWeight: 700}}>THE BULLETIN</h1>
        </div>
        
        <form className="search-section" onSubmit={handleSearchSubmit}>
          <div className={`search-container ${isSearchFocused ? 'focused' : ''}`}>
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="search-input"
            />
            <button
              type="button"
              onClick={handleSearchClick}
              className="search-button"
              disabled={!searchQuery.trim()}
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </header>
  );
};

export default Header;