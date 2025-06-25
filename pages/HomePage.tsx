
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BRAND_INFO, Icons } from '../constants';

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      nameKey: "home.coreCapabilities.features.insightsDashboard.name",
      descriptionKey: "home.coreCapabilities.features.insightsDashboard.description",
      icon: Icons.Dashboard,
      link: "/dashboard",
      ctaKey: "home.coreCapabilities.features.insightsDashboard.cta"
    },
    {
      nameKey: "home.coreCapabilities.features.talentProfile.name",
      descriptionKey: "home.coreCapabilities.features.talentProfile.description",
      icon: Icons.Users,
      link: "/talent-profiles",
      ctaKey: "home.coreCapabilities.features.talentProfile.cta"
    },
    {
      nameKey: "home.coreCapabilities.features.successionPlanning.name",
      descriptionKey: "home.coreCapabilities.features.successionPlanning.description",
      icon: Icons.Succession,
      link: "/succession-planning",
      ctaKey: "home.coreCapabilities.features.successionPlanning.cta"
    },
    {
      nameKey: "home.coreCapabilities.features.leadershipDevelopment.name",
      descriptionKey: "home.coreCapabilities.features.leadershipDevelopment.description",
      icon: Icons.Development,
      link: "/leadership-development",
      ctaKey: "home.coreCapabilities.features.leadershipDevelopment.cta"
    },
    {
      nameKey: "home.coreCapabilities.features.workforcePlanning.name",
      descriptionKey: "home.coreCapabilities.features.workforcePlanning.description",
      icon: Icons.Planning,
      link: "/workforce-planning",
      ctaKey: "home.coreCapabilities.features.workforcePlanning.cta"
    },
    {
      nameKey: "home.coreCapabilities.features.chatbot.name",
      descriptionKey: "home.coreCapabilities.features.chatbot.description",
      icon: Icons.Chat,
    }
  ];

  return (
    <div className="space-y-10 md:space-y-16">
      {/* Hero Section */}
      <section 
        className="relative text-white py-16 sm:py-20 md:py-24 px-6 rounded-xl shadow-2xl overflow-hidden" 
        style={{ backgroundColor: BRAND_INFO.colors.secondary }}
        aria-labelledby="hero-heading"
      >
        <div className="absolute top-0 left-0 w-24 h-24 md:w-32 md:h-32 opacity-10 transform -translate-x-1/3 -translate-y-1/3">
          <Icons.Dashboard className="w-full h-full animate-pulse" style={{ color: BRAND_INFO.colors.primary }} />
        </div>
        <div className="absolute bottom-0 right-0 w-32 h-32 md:w-48 md:h-48 opacity-5 transform translate-x-1/4 translate-y-1/4">
           <Icons.Chat className="w-full h-full" style={{ color: BRAND_INFO.colors.primary }} />
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <img 
            src={BRAND_INFO.logo.title} 
            alt={`${BRAND_INFO.organizationShortName} Logo`} 
            className="h-16 sm:h-20 md:h-24 mx-auto mb-6 object-contain"
          />
          <h1 id="hero-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ color: BRAND_INFO.colors.primary }}>
            {t('home.hero.title')}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 text-gray-200">
            {t('home.hero.subtitle', { organizationShortName: BRAND_INFO.organizationShortName })}
          </p>
          <p className="text-base sm:text-lg mb-8 text-gray-300 max-w-2xl mx-auto">
            {t('home.hero.description', { chatbotName: BRAND_INFO.chatbot.name })}
          </p>
          <p className="italic text-md sm:text-lg mb-10" style={{ color: BRAND_INFO.colors.primary }}>
            {t('home.hero.slogan', { slogan: BRAND_INFO.slogan })}
          </p>
          <Link
            to="/dashboard"
            className={`inline-block px-8 py-3 sm:px-10 sm:py-4 text-base sm:text-lg font-semibold rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[${BRAND_INFO.colors.primary}70] active:scale-95`}
            style={{ backgroundColor: BRAND_INFO.colors.primary, color: BRAND_INFO.colors.secondary }}
          >
            {t('home.hero.exploreButton')}
          </Link>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-8 sm:py-12" aria-labelledby="features-heading">
        <h2 id="features-heading" className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-12" style={{ color: BRAND_INFO.colors.secondary }}>
          {t('home.coreCapabilities.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out flex flex-col items-center text-center transform hover:-translate-y-1"
            >
              <div className="p-3 mb-5 inline-block rounded-full" style={{ backgroundColor: `${BRAND_INFO.colors.primary}30`}}>
                <feature.icon className="w-10 h-10 sm:w-12 sm:h-12" style={{ color: BRAND_INFO.colors.secondary }} />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3" style={{ color: BRAND_INFO.colors.secondary }}>
                {t(feature.nameKey)}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base mb-6 flex-grow px-2">{t(feature.descriptionKey, {chatbotName: BRAND_INFO.chatbot.name})}</p>
              {feature.ctaKey && feature.link && (
                <Link
                  to={feature.link}
                  className="mt-auto inline-block px-6 py-2.5 text-sm sm:text-base font-medium rounded-md shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
                  style={{ backgroundColor: BRAND_INFO.colors.secondary, color: BRAND_INFO.colors.primary }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = BRAND_INFO.colors.primary;
                    e.currentTarget.style.color = BRAND_INFO.colors.secondary;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = BRAND_INFO.colors.secondary;
                    e.currentTarget.style.color = BRAND_INFO.colors.primary;
                  }}
                >
                  {t(feature.ctaKey)}
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;