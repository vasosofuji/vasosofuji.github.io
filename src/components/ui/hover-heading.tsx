

import { useState, useEffect } from "react";

interface HoverHeadingProps {
  text: string;
  url?: string;
  dataTranslate?: string;
  outline?: boolean;
}

export default function HoverHeading({ text, url, dataTranslate, outline }: HoverHeadingProps) {
  const [lang, setLang] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem('siteLanguage') || 'en';
    }
    return 'en';
  });

  useEffect(() => {
    const handleLangChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setLang(customEvent.detail || 'en');
    };
    window.addEventListener('languagechange', handleLangChange);
    return () => {
      window.removeEventListener('languagechange', handleLangChange);
    };
  }, []);

  const handleClick = () => {
    if (url) {
      // Go through the site's own page transition so the curtain and the camera
      // play. Setting location directly skipped all of it, which is why the
      // headings jumped straight to the next page with no wipe at all.
      const go = (window as unknown as { startPageTransition?: (u: string) => boolean }).startPageTransition;
      if (typeof go === 'function' && go(url)) return;
      window.location.href = url;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (url && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      const go = (window as unknown as { startPageTransition?: (u: string) => boolean }).startPageTransition;
      if (typeof go === 'function' && go(url)) return;
      window.location.href = url;
    }
  };

  // Resolve display text based on language and dataTranslate key
  let displayText = text;
  if (dataTranslate && typeof window !== "undefined" && (window as any).translations) {
    const translations = (window as any).translations;
    if (translations[lang] && translations[lang][dataTranslate]) {
      displayText = translations[lang][dataTranslate];
    }
  }

  return (
    <h2 
      className={`section-title ${url ? 'clickable-heading' : ''} ${outline ? 'section-title-outline' : ''}`} 
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={url ? "button" : undefined}
      tabIndex={url ? 0 : undefined}
      data-translate={dataTranslate}
      style={{ cursor: url ? 'pointer' : 'default' }}
    >
      {displayText}
    </h2>
  );
}
