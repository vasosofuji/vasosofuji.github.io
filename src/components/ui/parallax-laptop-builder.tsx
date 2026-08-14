import { useEffect, useRef, useState, useCallback } from "react";

interface ParallaxLaptopBuilderProps {
  initialStage?: number;
}

interface DemoPhoto {
  id: string;
  category: "concerts" | "portraits" | "landscapes";
  title: string;
  camera: string;
  src: string;
}

const DEMO_PHOTOS: DemoPhoto[] = [
  { id: "1", category: "concerts", title: "LoveRave Festival", camera: "Fujifilm X-T2 • XF 35mm F/2", src: "photos/concerts/Untitled-13.jpg" },
  { id: "2", category: "portraits", title: "Editorial Portrait", camera: "Fujifilm X-T2 • 35mm F/2", src: "photos/portraits/DSCF0950.jpg" },
  { id: "3", category: "landscapes", title: "Misty Horizon", camera: "Fujifilm X-T2 • 16-50mm", src: "photos/landscapes/IMG_8896.jpg" },
  { id: "4", category: "concerts", title: "Korka Live Performance", camera: "Fujifilm X-T2 • 35mm F/2", src: "photos/concerts/kork.jpg" },
  { id: "5", category: "portraits", title: "Studio Light Study", camera: "Fujifilm X-T2 • 35mm F/2", src: "photos/portraits/IMG_5213.jpg" },
  { id: "6", category: "concerts", title: "Sickabass Stage", camera: "Fujifilm X-T2 • 35mm F/2", src: "photos/concerts/sickabass.jpg" },
  { id: "7", category: "portraits", title: "Golden Hour Flare", camera: "Fujifilm X-T2 • 35mm F/2", src: "photos/portraits/DSCF7475.jpg" },
  { id: "8", category: "landscapes", title: "Mountain Fog", camera: "Fujifilm X-T2 • 16-50mm", src: "photos/landscapes/IMG_8635.jpg" },
];

export function ParallaxLaptopBuilder({ initialStage = 3 }: ParallaxLaptopBuilderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const laptopRef = useRef<HTMLDivElement>(null);
  const screenContentRef = useRef<HTMLDivElement>(null);
  
  // Stages: 0: Terminal/Wireframe, 1: Design Tokens/Colors, 2: Component Assembly, 3: Live Website Demo
  const [activeStage, setActiveStage] = useState(initialStage);
  const [copiedPalette, setCopiedPalette] = useState<string | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // Interactive Mini Website Demo State
  const [demoCategory, setDemoCategory] = useState<"all" | "concerts" | "portraits" | "landscapes">("all");
  const [selectedPhoto, setSelectedPhoto] = useState<DemoPhoto | null>(null);
  const [demoView, setDemoView] = useState<"gallery" | "about">("gallery");
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

  // 3D Mouse Parallax on Laptop & Floating Code Badges
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

      targetRotY = x * 12; // max 12deg Y rotation
      targetRotX = -y * 8; // max 8deg X rotation

      // Parallax floating code badges
      const badges = container.querySelectorAll<HTMLElement>(".laptop-floating-code");
      badges.forEach((badge) => {
        const depth = parseFloat(badge.getAttribute("data-depth") || "1");
        const moveX = x * 32 * depth;
        const moveY = y * 28 * depth;
        badge.style.transform = `translate3d(${moveX}px, ${moveY}px, ${depth * 20}px)`;
      });
    };

    const handleMouseLeave = () => {
      targetRotX = 0;
      targetRotY = 0;
      const badges = container.querySelectorAll<HTMLElement>(".laptop-floating-code");
      badges.forEach((badge) => {
        badge.style.transform = `translate3d(0px, 0px, 0px)`;
      });
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
    }, 3800);
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

  const filteredPhotos = demoCategory === "all" 
    ? DEMO_PHOTOS 
    : DEMO_PHOTOS.filter(p => p.category === demoCategory);

  return (
    <div ref={containerRef} className="laptop-builder-wrapper">
      {/* Ambient Lighting Depth Aura */}
      <div className="laptop-aura-glow" />

      {/* Floating Code Languages & Technologies (Used to build this site) */}
      <div className="laptop-floating-code chip-ts" data-depth="1.6">
        <span className="code-lang-tag">TypeScript</span>
        <code className="code-snippet">type Site = StrictMode &amp; Typed;</code>
      </div>

      <div className="laptop-floating-code chip-react" data-depth="2.2">
        <span className="code-lang-tag">React 19</span>
        <code className="code-snippet">&lt;SterlingNav active="webdev" /&gt;</code>
      </div>

      <div className="laptop-floating-code chip-gsap" data-depth="1.3">
        <span className="code-lang-tag">GSAP 3.15</span>
        <code className="code-snippet">gsap.timeline(&#123; scrub: 1 &#125;)</code>
      </div>

      <div className="laptop-floating-code chip-lenis" data-depth="2.6">
        <span className="code-lang-tag">Lenis</span>
        <code className="code-snippet">lenis.on('scroll', onScroll)</code>
      </div>

      <div className="laptop-floating-code chip-css" data-depth="1.8">
        <span className="code-lang-tag">Tailwind v4</span>
        <code className="code-snippet">--color-olive: #2E2910;</code>
      </div>

      <div className="laptop-floating-code chip-canvas" data-depth="2.0">
        <span className="code-lang-tag">HTML5 Canvas</span>
        <code className="code-snippet">ctx.drawImage(frameSequence, 0, 0)</code>
      </div>

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
            <span className="tab-title">{isMk ? "Палета & Токени" : "Design System & Tokens"}</span>
          </button>
          <button
            type="button"
            className={`stage-tab-btn ${activeStage === 2 ? "active" : ""}`}
            onClick={() => setStageDirect(2)}
          >
            <span className="tab-idx">03</span>
            <span className="tab-title">{isMk ? "Монтажа на Компоненти" : "Component Assembly"}</span>
          </button>
          <button
            type="button"
            className={`stage-tab-btn ${activeStage === 3 ? "active" : ""}`}
            onClick={() => setStageDirect(3)}
          >
            <span className="tab-idx">04</span>
            <span className="tab-title">{isMk ? "Интерактивно Демо (Live)" : "Live Website Demo"}</span>
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
            <div ref={screenContentRef} className={`laptop-screen-content stage-view-${activeStage}`}>
              
              {/* STAGE 0: TERMINAL & BLUEPRINT WIREFRAME */}
              {activeStage === 0 && (
                <div className="stage-screen stage-terminal">
                  <div className="terminal-header">
                    <div className="term-dots">
                      <span className="dot dot-red" />
                      <span className="dot dot-yellow" />
                      <span className="dot dot-green" />
                    </div>
                    <div className="term-title">vasosofuji-engine ~ zsh - 80x24</div>
                    <div className="term-badge">STAGE 01 / SCAFFOLD</div>
                  </div>

                  <div className="terminal-body">
                    <div className="term-line prompt">
                      <span className="term-usr">vaso@workstation</span>:<span className="term-path">~/code/vasosofuji</span>$ npm run dev
                    </div>
                    <div className="term-line success">✓ Vite 8.1 ready in 140ms</div>
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

              {/* STAGE 3: ACTUAL INTERACTABLE WEBSITE DEMO (VASOSOFUJI.GITHUB.IO) */}
              {activeStage === 3 && (
                <div className="stage-screen stage-live-demo">
                  {/* Miniature Browser Chrome Bar */}
                  <div className="live-demo-browser-chrome">
                    <div className="browser-dots">
                      <span className="dot dot-red" />
                      <span className="dot dot-yellow" />
                      <span className="dot dot-green" />
                    </div>
                    <div className="browser-url-bar">
                      <span className="url-lock">🔒</span>
                      <span className="url-text">https://vasosofuji.github.io</span>
                      <span className="url-status-tag">LIVE DEMO</span>
                    </div>
                    <div className="browser-top-actions">
                      <button
                        type="button"
                        className="demo-lang-btn"
                        onClick={() => setDemoLang(prev => prev === "en" ? "mk" : "en")}
                        title="Toggle Demo Language"
                      >
                        {demoLang.toUpperCase()}
                      </button>
                      <a
                        href="index.html"
                        className="demo-open-external"
                        title="Open Full Site"
                      >
                        ↗
                      </a>
                    </div>
                  </div>

                  {/* Miniature Website Operating Interface */}
                  <div className="mini-site-viewport">
                    {/* Mini Site Navigation Header */}
                    <div className="mini-site-header">
                      <span className="mini-site-logo" onClick={() => { setDemoView("gallery"); setDemoCategory("all"); }}>
                        vasosofuji
                      </span>
                      <nav className="mini-site-nav-links">
                        <button
                          type="button"
                          className={`mini-nav-btn ${demoView === "gallery" && demoCategory === "all" ? "active" : ""}`}
                          onClick={() => { setDemoView("gallery"); setDemoCategory("all"); }}
                        >
                          {demoLang === "mk" ? "Сите" : "All"}
                        </button>
                        <button
                          type="button"
                          className={`mini-nav-btn ${demoView === "gallery" && demoCategory === "concerts" ? "active" : ""}`}
                          onClick={() => { setDemoView("gallery"); setDemoCategory("concerts"); }}
                        >
                          {demoLang === "mk" ? "Концерти" : "Concerts"}
                        </button>
                        <button
                          type="button"
                          className={`mini-nav-btn ${demoView === "gallery" && demoCategory === "portraits" ? "active" : ""}`}
                          onClick={() => { setDemoView("gallery"); setDemoCategory("portraits"); }}
                        >
                          {demoLang === "mk" ? "Портрети" : "Portraits"}
                        </button>
                        <button
                          type="button"
                          className={`mini-nav-btn ${demoView === "gallery" && demoCategory === "landscapes" ? "active" : ""}`}
                          onClick={() => { setDemoView("gallery"); setDemoCategory("landscapes"); }}
                        >
                          {demoLang === "mk" ? "Пејсажи" : "Landscapes"}
                        </button>
                        <button
                          type="button"
                          className={`mini-nav-btn ${demoView === "about" ? "active" : ""}`}
                          onClick={() => setDemoView("about")}
                        >
                          {demoLang === "mk" ? "За Мене" : "About"}
                        </button>
                      </nav>
                    </div>

                    {/* View 1: Interactive Gallery */}
                    {demoView === "gallery" && (
                      <div className="mini-gallery-scroll">
                        <div className="mini-gallery-intro">
                          <span className="mini-intro-sub">
                            {demoLang === "mk" ? "Фотографија & Креативен Веб" : "Photography & Creative Web"}
                          </span>
                          <h6>
                            {demoLang === "mk" 
                              ? "Матеја Васојевиќ — Креативен Девелопер & Фотограф" 
                              : "Mateja Vasojevikj — Creative Developer & Photographer"}
                          </h6>
                          <p className="mini-intro-desc">
                            {demoLang === "mk"
                              ? "Кликнете на која било фотографија за преглед на метаподатоците."
                              : "Click any image below to test interactive lightbox and camera metadata."}
                          </p>
                        </div>

                        {/* Interactive Photo Cards Grid */}
                        <div className="mini-photos-grid">
                          {filteredPhotos.map((photo) => (
                            <div
                              key={photo.id}
                              className="mini-photo-card"
                              onClick={() => setSelectedPhoto(photo)}
                            >
                              <img
                                src={photo.src}
                                alt={photo.title}
                                loading="lazy"
                              />
                              <div className="mini-photo-caption">
                                <strong>{photo.title}</strong>
                                <small>{photo.camera}</small>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* View 2: Interactive About Me Card */}
                    {demoView === "about" && (
                      <div className="mini-about-view">
                        <div className="mini-about-card">
                          <img src="misc/vaso.jpg" alt="Mateja Vasojevikj" className="mini-avatar" />
                          <div className="mini-about-text">
                            <h5>Mateja Vasojevikj (vasosofuji)</h5>
                            <span className="mini-role">Cybersecurity Student @ FCSE (FINKI) • Creative Web Developer</span>
                            <p>
                              {demoLang === "mk"
                                ? "Студент по Сајбер Безбедност на ФИНКИ и freelance девелопер и фотограф од Скопје. Оваа веб-страница е комплетно рачно изработена со React 19, TypeScript и GSAP анимации."
                                : "Cybersecurity student at the Faculty of Computer Science & Engineering (FINKI) and freelance developer/photographer in Skopje. This entire website is bespoke-engineered with React 19, TypeScript, and GSAP."}
                            </p>
                            <div className="mini-gear-row">
                              <span>Fujifilm X-T2</span>
                              <span>XF 35mm F/2</span>
                              <span>React 19</span>
                              <span>TypeScript</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Lightbox Overlay Inside Laptop Screen */}
                    {selectedPhoto && (
                      <div className="mini-lightbox-modal" onClick={() => setSelectedPhoto(null)}>
                        <div className="mini-lightbox-box" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            className="mini-lightbox-close"
                            onClick={() => setSelectedPhoto(null)}
                          >
                            ✕
                          </button>
                          <img src={selectedPhoto.src} alt={selectedPhoto.title} />
                          <div className="mini-lightbox-meta">
                            <h6>{selectedPhoto.title}</h6>
                            <p>{selectedPhoto.camera}</p>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
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
