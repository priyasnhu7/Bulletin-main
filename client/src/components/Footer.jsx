const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        <div className="footer-left">
          <div className="footer-logo">
                        <img height="28" src="/logo.png" alt="logo" />
            <span className="footer-logo-text" style={{fontFamily: "'Playfair Display', 'Times New Roman', serif", fontWeight: 700}}>THE BULLETIN</span>
          </div>
          <p className="footer-description">
            THE BULLETIN delivers top stories from trusted sources, tailored to your interests. Stay informed, stay ahead. <br />Your News, Your Way.</p>
          <div className="footer-contact">
            <p><a href="mailto:support@newscurator.com">Email: support@newscurator.com</a></p>
            <p><a href="tel:+91-9876543210">Phone: +91 98765 43210</a></p>
          </div>
        </div>

        <div className="footer-right">
          <ul className="footer-links">
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">About Us</a></li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2025 News Curator. All rights reserved.</p>
        <p>Powered by NewsData.io</p>
      </div>
    </footer>
  );
};

export default Footer;
