
import React from 'react';
import { useTranslation } from 'react-i18next';
import { BRAND_INFO, Icons } from '../constants';

const socialMediaLinks = [
  { name: 'Blog', href: BRAND_INFO.socialMedia.blog, icon: Icons.Blog },
  { name: 'LinkedIn', href: BRAND_INFO.socialMedia.linkedin, icon: Icons.LinkedIn },
  { name: 'Instagram', href: BRAND_INFO.socialMedia.instagram, icon: Icons.Instagram },
  { name: 'GitHub', href: BRAND_INFO.socialMedia.github, icon: Icons.GitHub },
  { name: 'X', href: BRAND_INFO.socialMedia.x, icon: Icons.X },
  { name: 'YouTube', href: BRAND_INFO.socialMedia.youtube, icon: Icons.YouTube },
];

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="p-6 text-center" style={{ backgroundColor: BRAND_INFO.colors.secondary, color: 'white' }}>
      <p className="mb-2 text-sm">{t('footer.slogan', { slogan: BRAND_INFO.slogan })}</p>
      <p className="mb-2 text-xs">
        {t('footer.contact')}: <a href={`mailto:${BRAND_INFO.email}`} className="hover:underline" style={{color: BRAND_INFO.colors.primary}}>{BRAND_INFO.email}</a> | 
        {t('footer.phone')}: <a href={`tel:${BRAND_INFO.mobile.replace(/\s/g, '')}`} className="hover:underline" style={{color: BRAND_INFO.colors.primary}}>{BRAND_INFO.mobile}</a>
      </p>
      <div className="flex justify-center space-x-4 mt-4">
        {socialMediaLinks.map((social) => (
          <a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.name}
            className="transition-transform hover:scale-110"
            style={{ color: BRAND_INFO.colors.primary }}
          >
            <social.icon className="w-6 h-6" />
          </a>
        ))}
      </div>
      <p className="mt-4 text-xs opacity-75">
        {t('footer.rights', { year: new Date().getFullYear(), organizationLongName: BRAND_INFO.organizationLongName })}
      </p>
      <p className="mt-1 text-xs opacity-75">
        {t('footer.developedBy')}
      </p>
    </footer>
  );
};

export default Footer;