import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

declare global {
  interface Window {
    currentLang?: string;
    updateLanguage?: (lang: string) => void;
    openPopupCalendar?: () => void;
    translations?: Record<string, Record<string, string>>;
  }
}

export function SterlingGateKineticNavigation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isAnimatingRef = useRef(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lang, setLang] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("siteLanguage") || "en";
    }
    return "en";
  });

  useEffect(() => {
    const handleLangChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setLang(customEvent.detail);
      }
    };
    window.addEventListener("languagechange", handleLangChange);
    return () => window.removeEventListener("languagechange", handleLangChange);
  }, []);

  const handleLangToggle = (targetLang: string) => {
    setLang(targetLang);
    if (typeof window.updateLanguage === "function") {
      window.updateLanguage(targetLang);
    } else {
      localStorage.setItem("siteLanguage", targetLang);
      window.dispatchEvent(new CustomEvent("languagechange", { detail: targetLang }));
    }
  };

  // Ambient shape hover effects
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const menuItems = containerRef.current!.querySelectorAll(".menu-list-item[data-shape]");
      const shapesContainer = containerRef.current!.querySelector(".ambient-background-shapes");

      menuItems.forEach((item) => {
        const shapeIndex = item.getAttribute("data-shape");
        const shape = shapesContainer?.querySelector(`.bg-shape-${shapeIndex}`);

        const onEnter = () => {
          shapesContainer?.querySelectorAll(".bg-shape").forEach((s) => s.classList.remove("active"));
          if (shape) {
            shape.classList.add("active");
            const shapeEls = shape.querySelectorAll(".shape-element");
            gsap.killTweensOf(shapeEls);
            gsap.fromTo(
              shapeEls,
              { scale: 0.4, opacity: 0, rotation: -15 },
              { scale: 1, opacity: 1, rotation: 0, duration: 0.4, stagger: 0.05, ease: "back.out(1.5)", overwrite: true }
            );
          }
        };

        const onLeave = () => {
          if (shape) {
            const shapeEls = shape.querySelectorAll(".shape-element");
            gsap.killTweensOf(shapeEls);
            gsap.to(shapeEls, {
              scale: 0.7, opacity: 0, duration: 0.25, ease: "power2.in",
              onComplete: () => shape.classList.remove("active"),
              overwrite: true,
            });
          }
        };

        item.addEventListener("mouseenter", onEnter);
        item.addEventListener("mouseleave", onLeave);
        (item as any)._cleanup = () => {
          item.removeEventListener("mouseenter", onEnter);
          item.removeEventListener("mouseleave", onLeave);
        };
      });
    }, containerRef);

    return () => {
      ctx.revert();
      containerRef.current?.querySelectorAll(".menu-list-item[data-shape]").forEach((item: any) => item._cleanup?.());
    };
  }, []);

  // Build a single master timeline once. Play forward to open, reverse to close.
  // Using `to` (not `fromTo`) so reverse works perfectly without initial-state snapping.
  useEffect(() => {
    if (!containerRef.current) return;

    const navWrap = containerRef.current.querySelector(".nav-overlay-wrapper") as HTMLElement | null;
    const menu = containerRef.current.querySelector(".menu-content") as HTMLElement | null;
    const overlay = containerRef.current.querySelector(".overlay") as HTMLElement | null;
    const menuLinks = containerRef.current.querySelectorAll(".nav-link");
    const fadeTargets = containerRef.current.querySelectorAll("[data-menu-fade]");
    const menuButton = containerRef.current.querySelector(".nav-close-btn");
    const menuButtonTexts = menuButton?.querySelectorAll(".menu-text-slide");
    const menuButtonIcon = menuButton?.querySelector(".menu-button-icon");
    const pageWrapper = document.getElementById("page-wrapper");

    // Closed resting state. Written through GSAP so the timeline and the
    // resting state agree on units — mixing an inline `translateX(100%)` with
    // a pixel tween is what made the panel jump on the first frame.
    gsap.set(menu, { xPercent: 100, x: 0 });
    gsap.set(overlay, { opacity: 0 });
    gsap.set(menuLinks, { opacity: 0, y: 15 });
    gsap.set(fadeTargets, { opacity: 0, y: 12 });

    const tl = gsap.timeline({
      paused: true,
      // Every tween in this timeline is transform/opacity only, so the whole
      // thing runs on the compositor.
      defaults: { force3D: true },
      onStart: () => {
        isAnimatingRef.current = true;
        if (navWrap) navWrap.setAttribute("data-nav", "open");
        if (pageWrapper) pageWrapper.classList.add("menu-is-open");
      },
      onComplete: () => {
        isAnimatingRef.current = false;
      },
      onReverseComplete: () => {
        isAnimatingRef.current = false;
        if (navWrap) navWrap.setAttribute("data-nav", "closed");
        if (pageWrapper) pageWrapper.classList.remove("menu-is-open");
      },
    });

    // Overlay fade in (pointer-events are handled by CSS on [data-nav="open"])
    tl.to(overlay, { opacity: 1, duration: 0.4, ease: "power2.out" }, 0);

    // Panel slide in from right
    tl.to(menu, { xPercent: 0, duration: 0.45, ease: "power3.out" }, 0);

    // Menu/Close text slide
    if (menuButtonTexts && menuButtonTexts.length > 0) {
      tl.to(menuButtonTexts, { yPercent: -100, duration: 0.3, ease: "power2.out" }, 0);
    }
    // Hamburger bars rotate a quarter turn: horizontal to vertical.
    // (225deg left them sitting at a diagonal.)
    if (menuButtonIcon) {
      tl.to(menuButtonIcon, { rotate: 90, duration: 0.3, ease: "power2.out" }, 0);
    }

    // Menu links stagger in
    if (menuLinks.length > 0) {
      tl.to(menuLinks, { y: 0, opacity: 1, stagger: 0.04, duration: 0.35, ease: "power2.out" }, 0.08);
    }

    // Extras fade in
    if (fadeTargets.length > 0) {
      tl.to(fadeTargets, { opacity: 1, y: 0, stagger: 0.04, duration: 0.35, ease: "power2.out" }, 0.15);
    }

    timelineRef.current = tl;

    return () => {
      tl.kill();
      timelineRef.current = null;
    };
  }, []);

  // Play / Reverse on state change
  useEffect(() => {
    const tl = timelineRef.current;
    if (!tl) return;

    if (isMenuOpen) {
      tl.timeScale(1).play();
    } else {
      tl.timeScale(1.4).reverse();
    }
  }, [isMenuOpen]);

  // Broadcast open/closed so the page's ambient animation loops can idle while
  // the drawer covers them. On phones the drawer is full-width, so nothing
  // behind it is visible and pausing costs nothing visually.
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.menuOpen = isMenuOpen ? "true" : "false";
    window.dispatchEvent(
      new CustomEvent("menustatechange", { detail: { open: isMenuOpen } })
    );
  }, [isMenuOpen]);

  // Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) setIsMenuOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isMenuOpen]);

  // Click outside to close
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleOutside = (e: PointerEvent) => {
      if (!containerRef.current) return;
      const menuContent = containerRef.current.querySelector(".menu-content");
      const toggleBtn = containerRef.current.querySelector(".nav-close-btn");
      if (menuContent && !menuContent.contains(e.target as Node) && toggleBtn && !toggleBtn.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("pointerdown", handleOutside);
    return () => document.removeEventListener("pointerdown", handleOutside);
  }, [isMenuOpen]);

  const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), []);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  const handleContactClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    closeMenu();
    if (typeof window.openPopupCalendar === "function") {
      window.openPopupCalendar();
    } else {
      document.getElementById("popupCalendarModal")?.classList.add("active");
    }
  }, [closeMenu]);

  const isMk = lang === "mk";
  const labels = {
    home: isMk ? "Почетна" : "Home",
    webDev: isMk ? "Веб Развој" : "Web Dev",
    aboutMe: isMk ? "За Мене" : "About Me",
    gallery: isMk ? "Галерија" : "Gallery",
    videos: isMk ? "Видеа" : "Videos",
    contact: isMk ? "Контакт" : "Contact",
    menu: isMk ? "Мени" : "Menu",
    close: isMk ? "Затвори" : "Close",
    socials: isMk ? "Социјални Мрежи" : "Social Media",
    language: isMk ? "Јазик" : "Language",
  };

  return (
    <div ref={containerRef} className="sterling-nav-root">
      <div className="site-header-wrapper">
        <div className="header">
          <div className="container is--full">
            <nav className="nav-row">
              <a href="index.html" aria-label="vasosofuji home" className="logo nav-logo">vasosofuji</a>
              <div className="nav-row__right">
                <button type="button" aria-label="Toggle Menu" className="nav-close-btn" onClick={toggleMenu}>
                  <div className="menu-button-text">
                    <p className="p-large menu-text-slide">{labels.menu}</p>
                    <p className="p-large menu-text-slide">{labels.close}</p>
                  </div>
                  <div className="icon-wrap">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className="menu-button-icon">
                      <line x1="4" y1="6" x2="20" y2="6" />
                      <line x1="4" y1="12" x2="20" y2="12" />
                      <line x1="4" y1="18" x2="20" y2="18" />
                    </svg>
                  </div>
                </button>
              </div>
            </nav>
          </div>
        </div>
      </div>

      <section className="fullscreen-menu-container">
        <div data-nav="closed" className="nav-overlay-wrapper">
          <div className="overlay" onClick={closeMenu}></div>
          <nav className="menu-content">
            <div className="menu-bg">
              <div className="backdrop-layer"></div>
              <div className="ambient-background-shapes">
                <svg className="bg-shape bg-shape-1" viewBox="0 0 400 400" fill="none">
                  <circle className="shape-element" cx="100" cy="100" r="50" fill="rgba(255,133,51,0.25)" />
                  <circle className="shape-element" cx="300" cy="120" r="70" fill="rgba(255,107,0,0.2)" />
                  <circle className="shape-element" cx="220" cy="280" r="90" fill="rgba(255,133,51,0.18)" />
                </svg>
                <svg className="bg-shape bg-shape-2" viewBox="0 0 400 400" fill="none">
                  <path className="shape-element" d="M50 200 L150 100 L250 200 L350 100" stroke="rgba(235,125,0,0.35)" strokeWidth="24" strokeLinecap="round" fill="none" />
                  <rect className="shape-element" x="120" y="240" width="160" height="60" rx="16" fill="rgba(44,87,69,0.35)" />
                </svg>
                <svg className="bg-shape bg-shape-3" viewBox="0 0 400 400" fill="none">
                  <path className="shape-element" d="M0 180 Q100 80, 200 180 T 400 180" stroke="rgba(255,133,51,0.3)" strokeWidth="40" fill="none" />
                  <path className="shape-element" d="M0 260 Q100 160, 200 260 T 400 260" stroke="rgba(255,107,0,0.22)" strokeWidth="30" fill="none" />
                </svg>
                <svg className="bg-shape bg-shape-4" viewBox="0 0 400 400" fill="none">
                  <circle className="shape-element" cx="60" cy="60" r="8" fill="rgba(255,133,51,0.35)" />
                  <circle className="shape-element" cx="180" cy="60" r="8" fill="rgba(255,133,51,0.35)" />
                  <circle className="shape-element" cx="300" cy="60" r="8" fill="rgba(255,133,51,0.35)" />
                  <circle className="shape-element" cx="120" cy="180" r="12" fill="rgba(255,107,0,0.3)" />
                  <circle className="shape-element" cx="240" cy="180" r="12" fill="rgba(255,107,0,0.3)" />
                  <circle className="shape-element" cx="60" cy="300" r="10" fill="rgba(255,133,51,0.35)" />
                  <circle className="shape-element" cx="180" cy="300" r="10" fill="rgba(255,133,51,0.35)" />
                  <circle className="shape-element" cx="300" cy="300" r="10" fill="rgba(255,133,51,0.35)" />
                </svg>
                <svg className="bg-shape bg-shape-5" viewBox="0 0 400 400" fill="none">
                  <path className="shape-element" d="M100 100 Q150 50, 200 100 Q250 150, 200 200 Q150 250, 100 200 Q50 150, 100 100" fill="rgba(255,133,51,0.25)" />
                  <path className="shape-element" d="M240 220 Q290 170, 340 220 Q390 270, 340 320 Q290 270, 240 220" fill="rgba(255,107,0,0.2)" />
                </svg>
                <svg className="bg-shape bg-shape-6" viewBox="0 0 400 400" fill="none">
                  <line className="shape-element" x1="0" y1="100" x2="300" y2="400" stroke="rgba(255,133,51,0.3)" strokeWidth="30" />
                  <line className="shape-element" x1="100" y1="0" x2="400" y2="300" stroke="rgba(255,107,0,0.22)" strokeWidth="25" />
                </svg>
              </div>
            </div>

            <div className="menu-content-wrapper">
              <ul className="menu-list">
                <li className="menu-list-item" data-shape="1">
                  <a href="index.html" className="nav-link" onClick={closeMenu}>
                    <p className="nav-link-text">{labels.home}</p>
                    <div className="nav-link-hover-bg"></div>
                  </a>
                </li>
                <li className="menu-list-item" data-shape="2">
                  <a href="webdev.html" className="nav-link" onClick={closeMenu}>
                    <p className="nav-link-text">{labels.webDev}</p>
                    <div className="nav-link-hover-bg"></div>
                  </a>
                </li>
                <li className="menu-list-item" data-shape="3">
                  <a href="about.html" className="nav-link" onClick={closeMenu}>
                    <p className="nav-link-text">{labels.aboutMe}</p>
                    <div className="nav-link-hover-bg"></div>
                  </a>
                </li>
                <li className="menu-list-item" data-shape="4">
                  <a href="gallery.html" className="nav-link" onClick={closeMenu}>
                    <p className="nav-link-text">{labels.gallery}</p>
                    <div className="nav-link-hover-bg"></div>
                  </a>
                </li>
                <li className="menu-list-item" data-shape="5">
                  <a href="videos.html" className="nav-link" onClick={closeMenu}>
                    <p className="nav-link-text">{labels.videos}</p>
                    <div className="nav-link-hover-bg"></div>
                  </a>
                </li>
                <li className="menu-list-item" data-shape="6">
                  <a href="#contact" className="nav-link" onClick={handleContactClick}>
                    <p className="nav-link-text">{labels.contact}</p>
                    <div className="nav-link-hover-bg"></div>
                  </a>
                </li>
              </ul>

              <div className="menu-extras" data-menu-fade>
                <div className="menu-extra-section">
                  <span className="extra-label">{labels.language}</span>
                  <div className="lang-buttons-row">
                    <button type="button" className={`lang-btn ${lang === "en" ? "active" : ""}`} onClick={() => handleLangToggle("en")}>
                      <img src="misc/uk-flag.png" alt="English" className="flag-img" loading="lazy" decoding="async" width={20} height={14} />
                      <span>English</span>
                    </button>
                    <button type="button" className={`lang-btn ${lang === "mk" ? "active" : ""}`} onClick={() => handleLangToggle("mk")}>
                      <img src="misc/mk-flag.png" alt="Македонски" className="flag-img" loading="lazy" decoding="async" width={20} height={14} />
                      <span>Македонски</span>
                    </button>
                  </div>
                </div>
                <div className="menu-extra-section">
                  <span className="extra-label">{labels.socials}</span>
                  <div className="socials-links-row">
                    <a href="https://instagram.com/vasosofuji" target="_blank" rel="noopener noreferrer" className="social-extra-link">
                      <img src="misc/instalogo.png" alt="Instagram" loading="lazy" decoding="async" width={18} height={18} /><span>Instagram</span>
                    </a>
                    <a href="https://www.linkedin.com/in/mateja-vasojevikj-907555290/" target="_blank" rel="noopener noreferrer" className="social-extra-link">
                      <img src="misc/linkedin.png" alt="LinkedIn" loading="lazy" decoding="async" width={18} height={18} /><span>LinkedIn</span>
                    </a>
                    <a href="https://www.flickr.com/photos/201695063@N02/" target="_blank" rel="noopener noreferrer" className="social-extra-link">
                      <img src="misc/flickr.png" alt="Flickr" loading="lazy" decoding="async" width={18} height={18} /><span>Flickr</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </section>
    </div>
  );
}

export default SterlingGateKineticNavigation;
