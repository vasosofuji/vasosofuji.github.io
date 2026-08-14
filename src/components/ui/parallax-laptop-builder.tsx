import { useEffect, useRef, useState, useCallback } from "react";

interface ParallaxLaptopBuilderProps {
  initialStage?: number;
}

interface DemoPhoto {
  id: string;
  category: "concerts" | "portraits" | "landscapes";
  title: string;
  camera: string;
  location: string;
  src: string;
}

const DEMO_PHOTOS: DemoPhoto[] = [
  { id: "1", category: "concerts", title: "LoveRave Festival 2025", camera: "Fujifilm X-T2 • XF 35mm F/2", location: "MKC Skopje", src: "photos/concerts/Untitled-13.jpg" },
  { id: "2", category: "portraits", title: "Studio Light Experiment", camera: "Fujifilm X-T2 • XF 35mm F/2", location: "Studio Skopje", src: "photos/portraits/DSCF0950.jpg" },
  { id: "3", category: "landscapes", title: "Misty Mountain Ridge", camera: "Fujifilm X-T2 • XC 16-50mm", location: "Vodno Peak", src: "photos/landscapes/IMG_8896.jpg" },
  { id: "4", category: "concerts", title: "Korka Live Set", camera: "Fujifilm X-T2 • XF 35mm F/2", location: "Laboratorium", src: "photos/concerts/kork.jpg" },
  { id: "5", category: "portraits", title: "Atmospheric Portrait", camera: "Fujifilm X-T2 • XF 35mm F/2", location: "Old Bazaar", src: "photos/portraits/IMG_5213.jpg" },
  { id: "6", category: "concerts", title: "Sickabass Energy", camera: "Fujifilm X-T2 • XF 35mm F/2", location: "Havana Club", src: "photos/concerts/sickabass.jpg" },
  { id: "7", category: "portraits", title: "Golden Hour Glow", camera: "Fujifilm X-T2 • XF 35mm F/2", location: "City Park", src: "photos/portraits/DSCF7475.jpg" },
  { id: "8", category: "landscapes", title: "Overcast Horizon", camera: "Fujifilm X-T2 • XC 16-50mm", location: "Mavrovo", src: "photos/landscapes/IMG_8635.jpg" },
];

export function ParallaxLaptopBuilder({ initialStage = 3 }: ParallaxLaptopBuilderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const laptopRef = useRef<HTMLDivElement>(null);
  const browserViewportRef = useRef<HTMLDivElement>(null);
  
  // Stages: 0: Terminal/Scaffold, 1: Design Tokens/Colors, 2: Component Assembly, 3: Live macOS Browser Website
  const [activeStage, setActiveStage] = useState(initialStage);
  const [copiedPalette, setCopiedPalette] = useState<string | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // macOS Browser State
  const [currentUrl, setCurrentUrl] = useState("https://vasojevich.com");
  const [isCopiedUrl, setIsCopiedUrl] = useState(false);
  const [demoFilter, setDemoFilter] = useState<"all" | "concerts" | "portraits" | "landscapes">("all");
  const [selectedPhoto, setSelectedPhoto] = useState<DemoPhoto | null>(null);
  const [demoLang, setDemoLang] = useState<"en" | "mk">("en");

  const [lang, setLang] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("siteLanguage") || "en";
    }
    return "en";
  });

  const isMk = lang === "mk";

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

  // 3D Mouse Parallax on Laptop Chassis
  useEffect(() => {
    const container = containerRef.current;
    const laptop = laptopRef.current;
    if (!container || !laptop) return;

    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let animFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      targetRotY = x * 10; // 10deg max Y tilt
      targetRotX = -y * 7; // 7deg max X tilt
    };

    const handleMouseLeave = () => {
      targetRotX = 0;
      targetRotY = 0;
    };

    const renderLoop = () => {
      currentRotX += (targetRotX - currentRotX) * 0.08;
      currentRotY += (targetRotY - currentRotY) * 0.08;

      if (laptop) {
        laptop.style.transform = `perspective(1200px) rotateX(${currentRotX}deg) rotateY(${currentRotY}deg)`;
      }
      animFrameId = requestAnimationFrame(renderLoop);
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    renderLoop();

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  // Scroll-driven stage progression
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || isAutoPlaying) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const totalScrollable = rect.height + windowHeight * 0.4;
      const current = windowHeight - rect.top;
      const progress = Math.max(0, Math.min(1, current / totalScrollable));

      if (progress < 0.22) {
        setActiveStage(0);
      } else if (progress < 0.48) {
        setActiveStage(1);
      } else if (progress < 0.74) {
        setActiveStage(2);
      } else {
        setActiveStage(3);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isAutoPlaying]);

  // Auto-play tour effect
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const setStageDirect = useCallback((stage: number) => {
    setIsAutoPlaying(false);
    setActiveStage(stage);
  }, []);

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedPalette(hex);
    setTimeout(() => setCopiedPalette(null), 1800);
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    setIsCopiedUrl(true);
    setTimeout(() => setIsCopiedUrl(false), 2000);
  };

  const filteredPhotos = demoFilter === "all" 
    ? DEMO_PHOTOS 
    : DEMO_PHOTOS.filter(p => p.category === demoFilter);

  const scrollToDemoSection = (id: string) => {
    if (!browserViewportRef.current) return;
    const el = browserViewportRef.current.querySelector(`#${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div ref={containerRef} className="laptop-builder-wrapper">
      {/* Ambient Lighting Depth Aura */}
      <div className="laptop-aura-glow" />

      {/* Stage Selector Bar (Geometric Architectural Tabs) */}
      <div className="laptop-stage-nav">
        <div className="stage-nav-tab-group">
          <button
            type="button"
            className={`stage-tab-btn ${activeStage === 0 ? "active" : ""}`}
            onClick={() => setStageDirect(0)}
          >
            <span className="tab-idx">01</span>
            <span className="tab-title">{isMk ? "Архитектура & Терминал" : "Terminal & Wireframe"}</span>
          </button>
          <button
            type="button"
            className={`stage-tab-btn ${activeStage === 1 ? "active" : ""}`}
            onClick={() => setStageDirect(1)}
          >
            <span className="tab-idx">02</span>
            <span className="tab-title">{isMk ? "Палета & Токени" : "Design Tokens"}</span>
          </button>
          <button
            type="button"
            className={`stage-tab-btn ${activeStage === 2 ? "active" : ""}`}
            onClick={() => setStageDirect(2)}
          >
            <span className="tab-idx">03</span>
            <span className="tab-title">{isMk ? "Монтажа на Модули" : "Component Assembly"}</span>
          </button>
          <button
            type="button"
            className={`stage-tab-btn ${activeStage === 3 ? "active" : ""}`}
            onClick={() => setStageDirect(3)}
          >
            <span className="tab-idx">04</span>
            <span className="tab-title">{isMk ? "Интерактивно Демо (macOS Browser)" : "Live Website Demo (macOS Browser)"}</span>
          </button>
        </div>

        <button
          type="button"
          className={`stage-tour-btn ${isAutoPlaying ? "active" : ""}`}
          onClick={() => setIsAutoPlaying((prev) => !prev)}
        >
          {isAutoPlaying ? "Pause Tour" : "Auto Build Tour"}
        </button>
      </div>

      {/* 3D Hardware Laptop Container */}
      <div className="laptop-scene">
        <div ref={laptopRef} className="laptop-chassis">
          {/* Top Display Enclosure */}
          <div className="laptop-screen-bezel">
            {/* Top Webcam & Status LED */}
            <div className="laptop-camera-bar">
              <div className="camera-lens" />
              <div className={`camera-led ${activeStage === 3 ? "active" : ""}`} />
            </div>

            {/* Specular Glass Glare Reflection */}
            <div className="laptop-screen-glare" />

            {/* Screen Inner Display Area */}
            <div className={`laptop-screen-content stage-view-${activeStage}`}>
              
              {/* STAGE 0: TERMINAL & BLUEPRINT WIREFRAME */}
              {activeStage === 0 && (
                <div className="stage-screen stage-terminal">
                  <div className="terminal-header">
                    <div className="term-dots">
                      <span className="dot dot-red" />
                      <span className="dot dot-yellow" />
                      <span className="dot dot-green" />
                    </div>
                    <div className="term-title">vaso@m4-max ~ zsh - 80x24</div>
                    <div className="term-badge">STAGE 01 / SCAFFOLD</div>
                  </div>

                  <div className="terminal-body">
                    <div className="term-line prompt">
                      <span className="term-usr">vaso@workstation</span>:<span className="term-path">~/code/vasojevich.com</span>$ npm run dev
                    </div>
                    <div className="term-line success">✓ Vite 8.1 ready in 140ms (ESM Edge)</div>
                    <div className="term-line success">✓ TypeScript 6.0 initialized with strict typing</div>
                    <div className="term-line success">✓ GSAP 3.15 + Lenis smooth inertial scroll mounted</div>
                    <div className="term-line info">
                      <span className="pulse-cursor">&gt;</span> Loading film canvas sequences &amp; multilingual state engine...
                    </div>
                  </div>

                  {/* Wireframe Architectural Matrix */}
                  <div className="wireframe-mockup">
                    <div className="wire-nav">
                      <div className="wire-box wire-logo" />
                      <div className="wire-nav-links">
                        <div className="wire-line" />
                        <div className="wire-line" />
                        <div className="wire-line" />
                      </div>
                    </div>
                    <div className="wire-hero">
                      <div className="wire-title-block">
                        <div className="wire-heading-line" />
                        <div className="wire-heading-line short" />
                        <div className="wire-btn-placeholder" />
                      </div>
                      <div className="wire-grid-2col">
                        <div className="wire-card pulse" />
                        <div className="wire-card pulse delay-1" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE 1: COLOR TOKENS & DESIGN SYSTEM INJECTION */}
              {activeStage === 1 && (
                <div className="stage-screen stage-tokens">
                  <div className="tokens-header">
                    <div className="stage-badge-small">STAGE 02 / DESIGN TOKENS</div>
                    <span className="palette-source">ColorHunt Palette #2E2910 | #2C5745 | #EBE3A7 | #EB7D00</span>
                  </div>

                  {/* Color Swatch Injection Grid */}
                  <div className="swatches-grid">
                    <div
                      className="swatch-card"
                      onClick={() => copyColor("#2E2910")}
                      title="Click to copy HEX"
                    >
                      <div className="swatch-color" style={{ backgroundColor: "#2E2910" }}>
                        <span className="swatch-badge">BASE</span>
                      </div>
                      <div className="swatch-meta">
                        <strong>#2E2910</strong>
                        <small>Dark Olive Earth</small>
                      </div>
                    </div>

                    <div
                      className="swatch-card"
                      onClick={() => copyColor("#2C5745")}
                      title="Click to copy HEX"
                    >
                      <div className="swatch-color" style={{ backgroundColor: "#2C5745" }}>
                        <span className="swatch-badge">SURFACE</span>
                      </div>
                      <div className="swatch-meta">
                        <strong>#2C5745</strong>
                        <small>Forest Evergreen Pine</small>
                      </div>
                    </div>

                    <div
                      className="swatch-card"
                      onClick={() => copyColor("#EBE3A7")}
                      title="Click to copy HEX"
                    >
                      <div className="swatch-color" style={{ backgroundColor: "#EBE3A7", color: "#2E2910" }}>
                        <span className="swatch-badge">TYPO</span>
                      </div>
                      <div className="swatch-meta">
                        <strong>#EBE3A7</strong>
                        <small>Warm Butter Linen</small>
                      </div>
                    </div>

                    <div
                      className="swatch-card"
                      onClick={() => copyColor("#EB7D00")}
                      title="Click to copy HEX"
                    >
                      <div className="swatch-color" style={{ backgroundColor: "#EB7D00" }}>
                        <span className="swatch-badge">ACTION</span>
                      </div>
                      <div className="swatch-meta">
                        <strong>#EB7D00</strong>
                        <small>Electric Tangerine</small>
                      </div>
                    </div>
                  </div>

                  {copiedPalette && (
                    <div className="palette-copied-toast">
                      ✓ Copied {copiedPalette} to clipboard
                    </div>
                  )}

                  {/* Typography & Aesthetic Binding */}
                  <div className="tokens-style-preview">
                    <div className="preview-typography">
                      <span className="type-label">Typographic Pacing: Syne 800 &amp; Geist Sans</span>
                      <h4 style={{ color: "#EBE3A7", fontFamily: "Syne, sans-serif" }}>
                        Editorial Spatial Hierarchy
                      </h4>
                      <p style={{ color: "#EBE3A7", opacity: 0.8, fontSize: "0.85rem" }}>
                        Zero-cliché design language with deliberate mass, inertia, and contrast.
                      </p>
                    </div>
                    <div className="preview-action-btn">
                      <button
                        type="button"
                        style={{
                          background: "#EB7D00",
                          color: "#1a1500",
                          fontWeight: 700,
                          padding: "8px 16px",
                          borderRadius: "6px",
                          border: "none",
                        }}
                      >
                        Accent Variable
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE 2: COMPONENT ASSEMBLY */}
              {activeStage === 2 && (
                <div className="stage-screen stage-assembly">
                  <div className="assembly-status-bar">
                    <div className="assembly-badge">STAGE 03 / COMPONENT INTEGRATION</div>
                    <div className="engine-status">
                      <span className="pulse-indicator" /> React 19 Core Mounted
                    </div>
                  </div>

                  <div className="assembly-canvas">
                    <div className="assembly-module module-nav">
                      <div className="module-tag">&lt;SterlingGateKineticNavigation /&gt;</div>
                      <div className="mini-nav-mock">
                        <span className="mini-brand">vasosofuji</span>
                        <div className="mini-links">
                          <span>Home</span>
                          <span className="active-item">Web Dev</span>
                          <span>Gallery</span>
                          <span>Videos</span>
                          <span>Contact</span>
                        </div>
                      </div>
                    </div>

                    <div className="assembly-row">
                      <div className="assembly-module module-hero">
                        <div className="module-tag">&lt;ParallaxPhotoGrid /&gt;</div>
                        <div className="mini-hero-mock">
                          <span className="mini-tag">60 FPS GSAP SCROLLTRIGGER</span>
                          <h5>Cinematography Meets High-Performance Code</h5>
                          <div className="mini-progress-bar">
                            <div className="mini-progress-fill" />
                          </div>
                        </div>
                      </div>

                      <div className="assembly-module module-metrics">
                        <div className="module-tag">&lt;CoreWebVitals /&gt;</div>
                        <div className="mini-metrics-mock">
                          <div className="metric-chip">
                            <strong>100</strong>
                            <small>Performance</small>
                          </div>
                          <div className="metric-chip">
                            <strong>0ms</strong>
                            <small>CLS</small>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="assembly-module module-security">
                      <div className="module-tag">&lt;CyberSecurityHardening /&gt;</div>
                      <div className="mini-sec-mock">
                        <span>🛡️ FINKI Cybersecurity Standards • Zero-Trust Input Sanitization • Strict CSP</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE 3: AUTHENTIC MACOS BROWSER WITH COMPLETE SCROLLABLE DEMO SITE */}
              {activeStage === 3 && (
                <div className="stage-screen stage-macos-browser">
                  
                  {/* macOS Safari / Arc Style Window Chrome */}
                  <div className="macos-window-header">
                    {/* Traffic Light Buttons */}
                    <div className="macos-traffic-lights">
                      <span className="traffic-light tl-red" title="Close">
                        <span className="tl-icon">✕</span>
                      </span>
                      <span className="traffic-light tl-yellow" title="Minimize">
                        <span className="tl-icon">−</span>
                      </span>
                      <span className="traffic-light tl-green" title="Maximize">
                        <span className="tl-icon">+</span>
                      </span>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="macos-nav-arrows">
                      <button type="button" className="macos-icon-btn" title="Back">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                      </button>
                      <button type="button" className="macos-icon-btn" title="Forward" disabled>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                      </button>
                      <button type="button" className="macos-icon-btn" title="Reload" onClick={() => scrollToDemoSection("demo-top")}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                      </button>
                    </div>

                    {/* macOS Centered Smart Search & Address Bar */}
                    <div className="macos-search-bar" onClick={copyUrl} title="Click to copy URL">
                      <span className="macos-padlock">🔒</span>
                      <span className="macos-url-text">{currentUrl}</span>
                      {isCopiedUrl ? (
                        <span className="macos-copied-badge">Copied!</span>
                      ) : (
                        <span className="macos-ssl-badge">TLS 1.3 • A+</span>
                      )}
                    </div>

                    {/* macOS Right Window Actions */}
                    <div className="macos-window-right-actions">
                      <button
                        type="button"
                        className="macos-lang-toggle"
                        onClick={() => setDemoLang(prev => prev === "en" ? "mk" : "en")}
                        title="Toggle Site Language"
                      >
                        {demoLang.toUpperCase()}
                      </button>
                      <a
                        href="index.html"
                        className="macos-icon-btn external-link"
                        title="Open Fullscreen Site in New Tab"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      </a>
                    </div>
                  </div>

                  {/* macOS Tab Strip */}
                  <div className="macos-tab-strip">
                    <div className="macos-tab active">
                      <span className="tab-favicon">⚡</span>
                      <span className="tab-title">vasosofuji — Mateja Vasojević</span>
                      <span className="tab-close">✕</span>
                    </div>
                    <div className="macos-tab-new" onClick={() => setCurrentUrl("https://vasojevich.com/portfolio")}>
                      +
                    </div>
                  </div>

                  {/* Complete Scrollable Live Website Inside macOS Browser */}
                  <div ref={browserViewportRef} className="macos-browser-viewport">
                    
                    {/* DEMO SITE HERO SECTION */}
                    <div id="demo-top" className="demo-site-hero">
                      <div className="demo-site-nav">
                        <div className="demo-brand" onClick={() => scrollToDemoSection("demo-top")}>
                          vasosofuji
                        </div>
                        <div className="demo-nav-anchors">
                          <button type="button" onClick={() => scrollToDemoSection("demo-gallery")}>
                            {demoLang === "mk" ? "Галерија" : "Gallery"}
                          </button>
                          <button type="button" onClick={() => scrollToDemoSection("demo-about")}>
                            {demoLang === "mk" ? "За Мене" : "About"}
                          </button>
                          <button type="button" onClick={() => scrollToDemoSection("demo-gear")}>
                            {demoLang === "mk" ? "Опрема" : "Gear"}
                          </button>
                          <button type="button" onClick={() => scrollToDemoSection("demo-contact")} className="demo-nav-cta">
                            {demoLang === "mk" ? "Контакт" : "Contact"}
                          </button>
                        </div>
                      </div>

                      <div className="demo-hero-body">
                        <span className="demo-hero-kicker">
                          {demoLang === "mk" ? "ФОТОГРАФИЈА & ВЕБ РАЗВОЈ" : "PHOTOGRAPHY & CREATIVE WEB"}
                        </span>
                        <h4>vasosofuji</h4>
                        <p className="demo-hero-author">
                          {demoLang === "mk" ? "Матеја Васојевиќ • Скопје, Македонија" : "Mateja Vasojevikj • Skopje, North Macedonia"}
                        </p>
                        <p className="demo-hero-desc">
                          {demoLang === "mk"
                            ? "Студент по Сајбер Безбедност на ФИНКИ и креативен девелопер. Овој сајт е рачно изработен со React 19, TypeScript и GSAP физика."
                            : "Cybersecurity student at FCSE (FINKI) and creative engineer. This entire site is hand-crafted with React 19, TypeScript, and 60fps GSAP physics."}
                        </p>
                      </div>
                    </div>

                    {/* DEMO SITE GALLERY SECTION WITH CATEGORY FILTERS */}
                    <div id="demo-gallery" className="demo-section">
                      <div className="demo-section-header">
                        <h5>{demoLang === "mk" ? "Избрани Фотографии" : "Selected Photographs"}</h5>
                        <div className="demo-filter-tabs">
                          <button
                            type="button"
                            className={`demo-filter-btn ${demoFilter === "all" ? "active" : ""}`}
                            onClick={() => setDemoFilter("all")}
                          >
                            {demoLang === "mk" ? "Сите" : "All"}
                          </button>
                          <button
                            type="button"
                            className={`demo-filter-btn ${demoFilter === "concerts" ? "active" : ""}`}
                            onClick={() => setDemoFilter("concerts")}
                          >
                            {demoLang === "mk" ? "Концерти" : "Concerts"}
                          </button>
                          <button
                            type="button"
                            className={`demo-filter-btn ${demoFilter === "portraits" ? "active" : ""}`}
                            onClick={() => setDemoFilter("portraits")}
                          >
                            {demoLang === "mk" ? "Портрети" : "Portraits"}
                          </button>
                          <button
                            type="button"
                            className={`demo-filter-btn ${demoFilter === "landscapes" ? "active" : ""}`}
                            onClick={() => setDemoFilter("landscapes")}
                          >
                            {demoLang === "mk" ? "Пејсажи" : "Landscapes"}
                          </button>
                        </div>
                      </div>

                      {/* Interactive Masonry Grid */}
                      <div className="demo-masonry-grid">
                        {filteredPhotos.map((photo) => (
                          <div
                            key={photo.id}
                            className="demo-photo-item"
                            onClick={() => setSelectedPhoto(photo)}
                          >
                            <img
                              src={photo.src}
                              alt={photo.title}
                              loading="lazy"
                            />
                            <div className="demo-photo-overlay">
                              <strong>{photo.title}</strong>
                              <small>{photo.camera}</small>
                              <span className="photo-loc">{photo.location}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* DEMO SITE BENTO ABOUT & GEAR SECTION */}
                    <div id="demo-about" className="demo-section">
                      <div className="demo-bento-grid">
                        
                        {/* Bio Card */}
                        <div className="demo-bento-card span-2">
                          <div className="demo-bento-author-row">
                            <img src="misc/vaso.jpg" alt="Mateja Vasojevic" className="demo-bento-avatar" />
                            <div>
                              <h6>{demoLang === "mk" ? "Зад Објективот & Кодот" : "Behind the Lens & Code"}</h6>
                              <span className="demo-bento-sub">
                                {demoLang === "mk" ? "Матеја Васојевиќ (vasosofuji)" : "Mateja Vasojevikj (vasosofuji)"}
                              </span>
                            </div>
                          </div>
                          <p className="demo-bento-text">
                            {demoLang === "mk"
                              ? "Балансирам помеѓу студиите по сајбер безбедност на ФИНКИ и љубовта кон фотографијата, кинематографијата и креативниот веб развој. Секоја линија код и секој кадар се направени со внимание кон деталите."
                              : "Balancing cybersecurity studies at FCSE (FINKI) with cinematography, live concert photography, and bespoke web development. Every line of code and every frame are crafted with precision."}
                          </p>
                        </div>

                        {/* Camera Gear Card */}
                        <div id="demo-gear" className="demo-bento-card">
                          <h6>{demoLang === "mk" ? "Моја Опрема" : "Camera Setup"}</h6>
                          <ul className="demo-gear-items">
                            <li><span>📷</span> Fujifilm X-T2</li>
                            <li><span>🔍</span> Fujinon XF 35mm F/2</li>
                            <li><span>🔍</span> Fujinon XC 16-50mm</li>
                            <li><span>📹</span> Sony Vintage Camcorder</li>
                          </ul>
                        </div>

                        {/* Golemata Voda Band Card */}
                        <div className="demo-bento-card span-2">
                          <div className="demo-band-row">
                            <img src="misc/gvcover.jpg" alt="Golemata Voda" className="demo-band-thumb" />
                            <div>
                              <h6>Golemata Voda</h6>
                              <p className="demo-band-desc">
                                {demoLang === "mk"
                                  ? "Бенд со кој соработувам од почетокот. Снимено на касета со стар Sony Camcorder во Прилеп."
                                  : "Indie band collaboration from the very start. Shot on vintage cassette tape in Prilep."}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Lighthouse Performance Metric Card */}
                        <div className="demo-bento-card">
                          <h6>{demoLang === "mk" ? "Перформанси" : "Core Metrics"}</h6>
                          <div className="demo-mini-score-grid">
                            <div className="demo-score-chip">
                              <span className="score-num">100</span>
                              <span className="score-lbl">Perf</span>
                            </div>
                            <div className="demo-score-chip">
                              <span className="score-num">100</span>
                              <span className="score-lbl">SEO</span>
                            </div>
                            <div className="demo-score-chip">
                              <span className="score-num">100</span>
                              <span className="score-lbl">A11y</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* DEMO CONTACT BANNER */}
                    <div id="demo-contact" className="demo-contact-strip">
                      <div>
                        <h6>{demoLang === "mk" ? "Сакате соработка?" : "Looking for custom web development?"}</h6>
                        <p>{demoLang === "mk" ? "Контактирајте ме за фотографски сесии или веб проекти." : "Get in touch for photo shoots or bespoke web engineering."}</p>
                      </div>
                      <a href="mailto:vasosofuji@gmail.com" className="demo-contact-cta-btn">
                        vasosofuji@gmail.com →
                      </a>
                    </div>

                    {/* DEMO FOOTER */}
                    <div className="demo-mini-footer">
                      <span>&copy; 2026 Mateja Vasojevikj (vasosofuji). All rights reserved.</span>
                      <button type="button" onClick={() => scrollToDemoSection("demo-top")}>
                        ↑ Top
                      </button>
                    </div>

                  </div>

                  {/* Lightbox Inspector Overlay Inside macOS Browser */}
                  {selectedPhoto && (
                    <div className="macos-modal-backdrop" onClick={() => setSelectedPhoto(null)}>
                      <div className="macos-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="macos-modal-header">
                          <span className="modal-title">{selectedPhoto.title}</span>
                          <button
                            type="button"
                            className="macos-modal-close"
                            onClick={() => setSelectedPhoto(null)}
                          >
                            ✕
                          </button>
                        </div>
                        <div className="macos-modal-body">
                          <img src={selectedPhoto.src} alt={selectedPhoto.title} />
                          <div className="macos-modal-meta">
                            <div className="meta-col">
                              <span className="meta-label">Camera &amp; Lens</span>
                              <strong>{selectedPhoto.camera}</strong>
                            </div>
                            <div className="meta-col">
                              <span className="meta-label">Location</span>
                              <strong>{selectedPhoto.location}</strong>
                            </div>
                            <div className="meta-col">
                              <span className="meta-label">Category</span>
                              <strong style={{ textTransform: "capitalize" }}>{selectedPhoto.category}</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          </div>

          {/* Keyboard Deck */}
          <div className="laptop-keyboard-deck">
            <div className="keyboard-hinge" />
            <div className="keyboard-keys-preview">
              <div className="key-row" />
              <div className="key-row" />
            </div>
            <div className="trackpad-indent" />
            <div className="laptop-notch-opener" />
          </div>

          {/* Desk Shadow */}
          <div className="laptop-desk-shadow" />
        </div>
      </div>
    </div>
  );
}

export default ParallaxLaptopBuilder;
