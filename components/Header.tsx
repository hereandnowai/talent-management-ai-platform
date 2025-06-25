
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BRAND_INFO, Icons } from '../constants';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLangDropdownOpen(false);
  };

  const supportedLanguages = [
    { code: 'en', name: t('languageSwitcher.en') },
    { code: 'es', name: t('languageSwitcher.es') },
    { code: 'fr', name: t('languageSwitcher.fr') },
    { code: 'de', name: t('languageSwitcher.de') },
  ];

  return (
    <header 
      className="fixed top-0 left-0 right-0 h-16 shadow-md flex items-center justify-between px-6 z-50"
      style={{ backgroundColor: BRAND_INFO.colors.secondary }}
    >
      <Link to="/" className="flex items-center space-x-3">
        <img src={BRAND_INFO.logo.title} alt={`${BRAND_INFO.organizationShortName} Logo`} className="h-10 object-contain" />
      </Link>
      <div className="flex items-center space-x-4">
        <div className="text-sm hidden md:block" style={{ color: BRAND_INFO.colors.primary }}>
          {t('header.slogan', { slogan: BRAND_INFO.slogan })}
        </div>
        <div className="relative">
          <button
            onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
            className="flex items-center text-sm p-2 rounded hover:bg-opacity-20 hover:bg-white"
            style={{ color: BRAND_INFO.colors.primary }}
            aria-label={t('languageSwitcher.label')}
          >
            <Icons.Users className="w-5 h-5 mr-1" /> {/* Placeholder for a globe icon */}
            {supportedLanguages.find(lang => lang.code === i18n.language)?.name || i18n.language.toUpperCase()}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1">
              <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          </button>
          {isLangDropdownOpen && (
            <div 
              className="absolute right-0 mt-2 w-36 rounded-md shadow-lg py-1"
              style={{ backgroundColor: BRAND_INFO.colors.secondary, border: `1px solid ${BRAND_INFO.colors.primary}` }}
            >
              {supportedLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`block w-full text-left px-4 py-2 text-sm ${i18n.language === lang.code ? 'font-semibold' : ''}`}
                  style={{ 
                    color: i18n.language === lang.code ? BRAND_INFO.colors.secondary : BRAND_INFO.colors.primary,
                    backgroundColor: i18n.language === lang.code ? BRAND_INFO.colors.primary : 'transparent'
                  }}
                  onMouseOver={(e) => {
                     if (i18n.language !== lang.code) {
                        e.currentTarget.style.backgroundColor = `${BRAND_INFO.colors.primary}40`; // Primary with opacity
                     }
                  }}
                  onMouseOut={(e) => {
                    if (i18n.language !== lang.code) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;