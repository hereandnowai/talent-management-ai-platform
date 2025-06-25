
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BRAND_INFO, Icons } from '../constants';

const Sidebar: React.FC = () => {
  const { t } = useTranslation();

  const navItems = [
    { nameKey: 'sidebar.navigation.dashboard', path: '/dashboard', icon: Icons.Dashboard },
    { nameKey: 'sidebar.navigation.talentProfiles', path: '/talent-profiles', icon: Icons.Users },
    { nameKey: 'sidebar.navigation.successionPlanning', path: '/succession-planning', icon: Icons.Succession },
    { nameKey: 'sidebar.navigation.leadershipDevelopment', path: '/leadership-development', icon: Icons.Development },
    { nameKey: 'sidebar.navigation.workforcePlanning', path: '/workforce-planning', icon: Icons.Planning },
  ];

  const activeLinkStyle = {
    backgroundColor: BRAND_INFO.colors.primary,
    color: BRAND_INFO.colors.secondary,
    fontWeight: '600',
  };

  const inactiveLinkStyle = {
    color: '#E0E0E0', // Lighter text for inactive links
  };
  
  const hoverLinkStyle = `hover:bg-[${BRAND_INFO.colors.primary}] hover:text-[${BRAND_INFO.colors.secondary}] hover:bg-opacity-80`;

  return (
    <aside className="w-64 p-4 space-y-2 flex flex-col" style={{ backgroundColor: BRAND_INFO.colors.secondary }}>
      <nav className="flex-grow">
        <ul>
          {navItems.map((item) => (
            <li key={item.nameKey}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${hoverLinkStyle} ${isActive ? '' : ''}`
                }
                style={({ isActive }) => (isActive ? activeLinkStyle : inactiveLinkStyle)}
              >
                <item.icon className="w-5 h-5" />
                <span>{t(item.nameKey)}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto p-2 text-center text-xs" style={{color: BRAND_INFO.colors.primary}}>
        {t('sidebar.copyright', { year: new Date().getFullYear(), organizationShortName: BRAND_INFO.organizationShortName })}
      </div>
    </aside>
  );
};

export default Sidebar;