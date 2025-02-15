import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const changeLanguage = lng => {
    i18n.changeLanguage(lng);
    setMenuOpen(false); // Close the menu after selecting a language
  };

  return (
    <div className="language-switcher">
      <button className="hamburger" onClick={toggleMenu}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-globe"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
      </button>

      {menuOpen && (
        <div className="language-menu">
          <button onClick={() => changeLanguage('en')}>English</button>
          <button onClick={() => changeLanguage('pt')}>Português</button>
          <button onClick={() => changeLanguage('uk')}>Українська</button>
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;
