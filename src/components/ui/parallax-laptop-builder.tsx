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

export function ParallaxLaptopBuilder({ initialStage = 4 }: ParallaxLaptopBuilderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const laptopRef = useRef<HTMLDivElement>(null);
  const browserViewportRef = useRef<HTMLDivElement>(null);
  
  // 5 Distinct Stages:
  // 0: Research & Competitor Inspection (with mouse animations & teardowns)
  // 1: Palette & Typography Discovery Workbench (interactive sliders, swatches & font pairings)
  // 2: AI Co-Engineering & Dev Tools (Claude Code, Antigravity, Figma, WebStorm with live chat & code stream)
  // 3: DNS & Domain Connection (vasojevich.com global edge propagation & SSL handshake)
  // 4: Live Production macOS Browser Demo (scrollable live site)
  const [activeStage, setActiveStage] = useState(initialStage);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // Stage 1: Research State
  const [activeCompetitor, setActiveCompetitor] = useState<number>(0);
  const [heatmapActive, setHeatmapActive] = useState<boolean>(false);
  const [virtualCursorPos, setVirtualCursorPos] = useState({ x: 45, y: 35 });

  // Stage 2: Typography & Palette Workbench State
  const [selectedFontIndex, setSelectedFontIndex] = useState(0);
  const [headlineWeight, setHeadlineWeight] = useState(800);
  const [letterSpacing, setLetterSpacing] = useState(-0.5);
  const [activeThemeAccent, setActiveThemeAccent] = useState("#EB7D00");
  const [copiedColorHex, setCopiedColorHex] = useState<string | null>(null);

  // Stage 3: AI Co-Pilot & Tools State
  const [activeAiTool, setActiveAiTool] = useState<"antigravity" | "claude" | "webstorm" | "figma">("antigravity");
  const [chatPromptIndex, setChatPromptIndex] = useState(0);
  const [isStreamingCode, setIsStreamingCode] = useState(false);

  // Stage 4: DNS & Domain Connection State
  const [isPropagating, setIsPropagating] = useState(false);
  const [dnsNodes, setDnsNodes] = useState([
    { city: "Skopje (MK)", ip: "185.199.108.153", status: "online", latency: "4ms" },
    { city: "Frankfurt (DE)", ip: "185.199.109.153", status: "online", latency: "18ms" },
    { city: "London (UK)", ip: "185.199.110.153", status: "online", latency: "24ms" },
    { city: "New York (US)", ip: "185.199.111.153", status: "online", latency: "76ms" },
    { city: "Tokyo (JP)", ip: "185.199.108.153", status: "online", latency: "135ms" },
  ]);

  // Stage 5: macOS Browser State
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

      targetRotY = x * 8; // 8deg max Y tilt
      targetRotX = -y * 6; // 6deg max X tilt
    };

    const handleMouseLeave = () => {
      targetRotX = 0;
      targetRotY = 0;
    };

    const renderLoop = () => {
      currentRotX += (targetRotX - currentRotX) * 0.08;
      currentRotY += (targetRotY - currentRotY) * 0.08;

      if (laptop) {
        laptop.style.transform = `perspective(1400px) rotateX(${currentRotX}deg) rotateY(${currentRotY}deg)`;
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

  // Stage 1: Virtual Mouse Cursor Research Animation Loop
  useEffect(() => {
    if (activeStage !== 0) return;
    const interval = setInterval(() => {
      setVirtualCursorPos({
        x: 20 + Math.random() * 60,
        y: 20 + Math.random() * 55,
      });
    }, 2400);
    return () => clearInterval(interval);
  }, [activeStage]);

  // Scroll-driven stage progression
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || isAutoPlaying) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const totalScrollable = rect.height + windowHeight * 0.4;
      const current = windowHeight - rect.top;
      const progress = Math.max(0, Math.min(1, current / totalScrollable));

      if (progress < 0.18) {
        setActiveStage(0);
      } else if (progress < 0.38) {
        setActiveStage(1);
      } else if (progress < 0.58) {
        setActiveStage(2);
      } else if (progress < 0.78) {
        setActiveStage(3);
      } else {
        setActiveStage(4);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isAutoPlaying]);

  // Auto-play tour effect (cycling through 5 stages)
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % 5);
    }, 5500);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const setStageDirect = useCallback((stage: number) => {
    setIsAutoPlaying(false);
    setActiveStage(stage);
  }, []);

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColorHex(hex);
    setTimeout(() => setCopiedColorHex(null), 1800);
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    setIsCopiedUrl(true);
    setTimeout(() => setIsCopiedUrl(false), 2000);
  };

  const triggerDnsPropagation = () => {
    setIsPropagating(true);
    setDnsNodes((prev) => prev.map((n) => ({ ...n, status: "checking" })));
    setTimeout(() => {
      setDnsNodes((prev) =>
        prev.map((n) => ({
          ...n,
          status: "online",
          latency: `${Math.floor(4 + Math.random() * 40)}ms`,
        }))
      );
      setIsPropagating(false);
    }, 1400);
  };

  const triggerAiPrompt = (idx: number) => {
    setChatPromptIndex(idx);
    setIsStreamingCode(true);
    setTimeout(() => setIsStreamingCode(false), 1200);
  };

  const FONT_OPTIONS = [
    { name: "Syne 800 + Geist Sans", familyHeading: "Syne, sans-serif", familyBody: "Geist, sans-serif", vibe: "Architectural & Brutalist Motion" },
    { name: "Montserrat 900 + Space Mono", familyHeading: "Montserrat, sans-serif", familyBody: "monospace", vibe: "High-Energy Concert & Editorial" },
    { name: "Playfair Display + Inter", familyHeading: "Playfair Display, serif", familyBody: "sans-serif", vibe: "Cinematographic Classic Film" },
  ];

  const COMPETITORS = [
    {
      name: "Template Agency X",
      url: "template-agency-x.com",
      issues: "Heavy 4.8MB bundle size, slow 1.8s TTFB, bloated WordPress plugins, generic stock layout.",
      verdict: "High churn, no unique branding.",
      score: 54,
    },
    {
      name: "Standard Portfolio Y",
      url: "portfolio-builder-y.io",
      issues: "Jumpy scrolling, 240ms layout shift (CLS), broken mobile typography, uncompressed images.",
      verdict: "Fails Google Core Web Vitals.",
      score: 62,
    },
    {
      name: "vasojevich.com (Our Goal)",
      url: "vasojevich.com",
      issues: "React 19 + GSAP 3.15, 0ms CLS, 100/100 Lighthouse score, custom 100-frame film preloader.",
      verdict: "Flawless 60fps performance & security.",
      score: 100,
    },
  ];

  const AI_PROMPTS = [
    {
      label: "Optimize GSAP Timeline & Lenis",
      prompt: "Refactor hero parallax scroll trigger to strict GPU composite transforms with 0 layout thrashing.",
      codeResponse: `// GSAP 3.15 + Lenis Physics\nconst tl = gsap.timeline({ scrollTrigger: { trigger: '#hero', scrub: 1 } });\ntl.to('.laptop-chassis', { rotateX: 0, rotateY: 0, scale: 1.02, ease: 'power2.out' });`,
    },
    {
      label: "Harden CSP & Zero-Trust Headers",
      prompt: "Apply strict Content Security Policy Level 3 with SRI sha384 integrity and frame-ancestors 'none'.",
      codeResponse: `// Security Hardening (FINKI Standards)\nContent-Security-Policy: default-src 'self'; script-src 'self' 'strict-dynamic'; frame-ancestors 'none';\nStrict-Transport-Security: max-age=63072000; includeSubDomains; preload;`,
    },
    {
      label: "Canvas Film Sequence Preloader",
      prompt: "Create memory-safe 100-frame sequential canvas animation loop with automatic DPI scaling.",
      codeResponse: `// HTML5 Canvas Frame Interpolator\nconst ctx = canvas.getContext('2d', { alpha: false });\nrequestAnimationFrame(() => ctx.drawImage(cachedFrames[currentFrame], 0, 0, w * dpr, h * dpr));`,
    },
  ];

  const filteredPhotos = demoFilter === "all" 
    ? DEMO_PHOTOS 
    : DEMO_PHOTOS.filter((p) => p.category === demoFilter);

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

      {/* 5-Step Stage Selector Navigation (Geometric Clean Architecture) */}
      <div className="laptop-stage-nav">
        <div className="stage-nav-tab-group">
          <button
            type="button"
            className={`stage-tab-btn ${activeStage === 0 ? "active" : ""}`}
            onClick={() => setStageDirect(0)}
          >
            <span className="tab-idx">01</span>
            <span className="tab-title">{isMk ? "Истражување & Анализа" : "Research & Analysis"}</span>
          </button>
          <button
            type="button"
            className={`stage-tab-btn ${activeStage === 1 ? "active" : ""}`}
            onClick={() => setStageDirect(1)}
          >
            <span className="tab-idx">02</span>
            <span className="tab-title">{isMk ? "Палета & Типографија" : "Palette & Typography"}</span>
          </button>
          <button
            type="button"
            className={`stage-tab-btn ${activeStage === 2 ? "active" : ""}`}
            onClick={() => setStageDirect(2)}
          >
            <span className="tab-idx">03</span>
            <span className="tab-title">{isMk ? "AI Алатки & Код" : "AI Co-Pilot & Tools"}</span>
          </button>
          <button
            type="button"
            className={`stage-tab-btn ${activeStage === 3 ? "active" : ""}`}
            onClick={() => setStageDirect(3)}
          >
            <span className="tab-idx">04</span>
            <span className="tab-title">{isMk ? "Домен & DNS Edge" : "DNS & Domain Setup"}</span>
          </button>
          <button
            type="button"
            className={`stage-tab-btn ${activeStage === 4 ? "active" : ""}`}
            onClick={() => setStageDirect(4)}
          >
            <span className="tab-idx">05</span>
            <span className="tab-title">{isMk ? "Готов Сајт (macOS)" : "Live Production App"}</span>
          </button>
        </div>

        <button
          type="button"
          className={`stage-tour-btn ${isAutoPlaying ? "active" : ""}`}
          onClick={() => setIsAutoPlaying((prev) => !prev)}
        >
          {isAutoPlaying ? "Pause 5-Step Tour" : "Auto 5-Step Tour"}
        </button>
      </div>

      {/* Realistic 3D Laptop Display Enclosure */}
      <div className="laptop-scene">
        <div ref={laptopRef} className="laptop-chassis">
          
          {/* Top Display Bezel with Aluminum Border, Rubber Gasket & Glass Glare */}
          <div className="laptop-screen-bezel">
            
            {/* Top Camera Notch & Green Indicator LED */}
            <div className="laptop-camera-bar">
              <div className="camera-housing">
                <div className="camera-lens" />
                <div className={`camera-led ${activeStage === 4 ? "active" : ""}`} />
              </div>
            </div>

            {/* Specular Screen Glass Reflection */}
            <div className="laptop-screen-glare" />

            {/* Display Viewport Content Area */}
            <div className={`laptop-screen-content stage-view-${activeStage}`}>
              
              {/* ══════════════════════════════════════════════════════════
                  STAGE 0: RESEARCH, MOUSE ANIMATION & COMPETITOR TEARDOWN
                  ══════════════════════════════════════════════════════════ */}
              {activeStage === 0 && (
                <div className="stage-screen stage-research">
                  {/* Virtual Cursor */}
                  <div
                    className="virtual-research-mouse"
                    style={{
                      left: `${virtualCursorPos.x}%`,
                      top: `${virtualCursorPos.y}%`,
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#EB7D00" stroke="#000" strokeWidth="1.5">
                      <path d="M3 3l7 18 3-7 7-3L3 3z" />
                    </svg>
                    <span className="mouse-audit-tag">Auditing Layout...</span>
                  </div>

                  <div className="stage-panel-header">
                    <div>
                      <span className="step-count-pill">STEP 01 OF 05</span>
                      <h4>Competitor Research &amp; Architectural Teardown</h4>
                    </div>
                    <div className="stage-header-actions">
                      <button
                        type="button"
                        className={`mini-tool-btn ${heatmapActive ? "active" : ""}`}
                        onClick={() => setHeatmapActive((prev) => !prev)}
                      >
                        {heatmapActive ? "Heatmap: ON" : "Toggle Heatmap"}
                      </button>
                    </div>
                  </div>

                  <div className="research-layout-grid">
                    {/* Competitor List */}
                    <div className="competitors-list">
                      {COMPETITORS.map((comp, idx) => (
                        <div
                          key={comp.name}
                          className={`competitor-card ${activeCompetitor === idx ? "active" : ""} ${heatmapActive && idx < 2 ? "heatmap-hot" : ""}`}
                          onClick={() => setActiveCompetitor(idx)}
                        >
                          <div className="comp-card-top">
                            <span className="comp-name">{comp.name}</span>
                            <span className={`comp-score-badge ${comp.score === 100 ? "score-100" : "score-bad"}`}>
                              {comp.score}/100
                            </span>
                          </div>
                          <span className="comp-url">{comp.url}</span>
                          <p className="comp-issues">{comp.issues}</p>
                        </div>
                      ))}
                    </div>

                    {/* Live Inspector Preview Pane */}
                    <div className="research-inspector-pane">
                      <div className="inspector-head">
                        <span className="ins-title">Performance &amp; Code Quality Inspector</span>
                        <span className="ins-status">Active Audit</span>
                      </div>

                      <div className="inspector-radar-box">
                        <div className="radar-metric-row">
                          <span>First Contentful Paint (FCP)</span>
                          <strong style={{ color: activeCompetitor === 2 ? "#2ed573" : "#ff4757" }}>
                            {activeCompetitor === 2 ? "0.2s (Optimal)" : "2.4s (High Latency)"}
                          </strong>
                        </div>
                        <div className="radar-metric-row">
                          <span>Cumulative Layout Shift (CLS)</span>
                          <strong style={{ color: activeCompetitor === 2 ? "#2ed573" : "#ff4757" }}>
                            {activeCompetitor === 2 ? "0.000 (Zero Shift)" : "0.284 (Visual Jitter)"}
                          </strong>
                        </div>
                        <div className="radar-metric-row">
                          <span>Security &amp; Privacy (CSP)</span>
                          <strong style={{ color: activeCompetitor === 2 ? "#2ed573" : "#ffa502" }}>
                            {activeCompetitor === 2 ? "A+ Hardened Header" : "Vulnerable / No CSP"}
                          </strong>
                        </div>
                      </div>

                      <div className="developer-notes-box">
                        <strong>Architectural Insight:</strong>
                        <p>
                          {activeCompetitor === 2
                            ? "By avoiding monolithic templates and coding directly in React 19 + GSAP, we achieve instant sub-50ms paint times and zero frame drops."
                            : "Standard template sites suffer from 30+ uncompressed script payloads and render-blocking fonts. We will engineer a custom lightweight stack."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════════════
                  STAGE 1: PALETTE & TYPOGRAPHY DISCOVERY WORKBENCH
                  ══════════════════════════════════════════════════════════ */}
              {activeStage === 1 && (
                <div className="stage-screen stage-tokens-workbench">
                  <div className="stage-panel-header">
                    <div>
                      <span className="step-count-pill">STEP 02 OF 05</span>
                      <h4>Color Harmony &amp; Typographic Pacing</h4>
                    </div>
                    <span className="palette-source-tag">ColorHunt #2E2910 | #2C5745 | #EBE3A7 | #EB7D00</span>
                  </div>

                  <div className="workbench-grid">
                    {/* Left Column: Interactive Swatches & Font Chooser */}
                    <div className="workbench-controls-col">
                      <label className="wb-label">Color Tokens (Click to Copy &amp; Apply):</label>
                      <div className="wb-swatches-row">
                        {[
                          { hex: "#2E2910", name: "Dark Olive Earth", role: "Base Canvas" },
                          { hex: "#2C5745", name: "Forest Evergreen", role: "Surface" },
                          { hex: "#EBE3A7", name: "Warm Butter Linen", role: "Text" },
                          { hex: "#EB7D00", name: "Electric Tangerine", role: "Accent Action" },
                        ].map((c) => (
                          <div
                            key={c.hex}
                            className={`wb-swatch-box ${activeThemeAccent === c.hex ? "active-accent" : ""}`}
                            onClick={() => {
                              setActiveThemeAccent(c.hex);
                              copyHex(c.hex);
                            }}
                          >
                            <div className="wb-swatch-chip" style={{ backgroundColor: c.hex }} />
                            <div className="wb-swatch-info">
                              <strong>{c.hex}</strong>
                              <small>{c.name}</small>
                            </div>
                          </div>
                        ))}
                      </div>

                      {copiedColorHex && (
                        <div className="wb-copied-alert">✓ Copied {copiedColorHex} to clipboard &amp; applied!</div>
                      )}

                      <label className="wb-label mt-4">Typographic Voice:</label>
                      <div className="wb-font-pair-list">
                        {FONT_OPTIONS.map((font, idx) => (
                          <div
                            key={font.name}
                            className={`wb-font-card ${selectedFontIndex === idx ? "selected" : ""}`}
                            onClick={() => setSelectedFontIndex(idx)}
                          >
                            <strong>{font.name}</strong>
                            <small>{font.vibe}</small>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right Column: Live Responsive Typography Canvas */}
                    <div
                      className="workbench-preview-pane"
                      style={{
                        backgroundColor: "#19160a",
                        borderColor: activeThemeAccent,
                      }}
                    >
                      <div className="wb-preview-header">
                        <span className="live-pill">LIVE RENDER</span>
                        <div className="wb-sliders">
                          <span>Weight: {headlineWeight}</span>
                          <input
                            type="range"
                            min="400"
                            max="900"
                            step="100"
                            value={headlineWeight}
                            onChange={(e) => setHeadlineWeight(Number(e.target.value))}
                          />
                          <span>Tracking: {letterSpacing}px</span>
                          <input
                            type="range"
                            min="-2"
                            max="3"
                            step="0.5"
                            value={letterSpacing}
                            onChange={(e) => setLetterSpacing(Number(e.target.value))}
                          />
                        </div>
                      </div>

                      <div className="wb-preview-body">
                        <h2
                          style={{
                            fontFamily: FONT_OPTIONS[selectedFontIndex].familyHeading,
                            fontWeight: headlineWeight,
                            letterSpacing: `${letterSpacing}px`,
                            color: "#EBE3A7",
                          }}
                        >
                          vasosofuji <span style={{ color: activeThemeAccent }}>media</span>
                        </h2>
                        <p
                          style={{
                            fontFamily: FONT_OPTIONS[selectedFontIndex].familyBody,
                            color: "#EBE3A7",
                            opacity: 0.85,
                          }}
                        >
                          Every photograph and interaction carries cinematic atmosphere, deliberate typographic balance, and instant responsiveness.
                        </p>

                        <div className="wb-contrast-badge">
                          <span>Contrast Ratio: <strong>11.4:1 (WCAG AAA Pass)</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════════════
                  STAGE 2: AI CO-PILOT & DEV TOOLS WORKSPACE
                  ══════════════════════════════════════════════════════════ */}
              {activeStage === 2 && (
                <div className="stage-screen stage-ai-workspace">
                  <div className="stage-panel-header">
                    <div>
                      <span className="step-count-pill">STEP 03 OF 05</span>
                      <h4>Engineering with Antigravity, Claude Code, WebStorm &amp; Figma</h4>
                    </div>
                    {/* Tool Badges */}
                    <div className="dev-tool-tabs">
                      <button
                        type="button"
                        className={`tool-tab-btn ${activeAiTool === "antigravity" ? "active" : ""}`}
                        onClick={() => setActiveAiTool("antigravity")}
                      >
                        ⚡ Antigravity AI
                      </button>
                      <button
                        type="button"
                        className={`tool-tab-btn ${activeAiTool === "claude" ? "active" : ""}`}
                        onClick={() => setActiveAiTool("claude")}
                      >
                        🤖 Claude Code
                      </button>
                      <button
                        type="button"
                        className={`tool-tab-btn ${activeAiTool === "webstorm" ? "active" : ""}`}
                        onClick={() => setActiveAiTool("webstorm")}
                      >
                        💻 WebStorm
                      </button>
                      <button
                        type="button"
                        className={`tool-tab-btn ${activeAiTool === "figma" ? "active" : ""}`}
                        onClick={() => setActiveAiTool("figma")}
                      >
                        🎨 Figma
                      </button>
                    </div>
                  </div>

                  <div className="ai-workspace-split">
                    {/* Left: Interactive Multi-Agent Terminal Chat */}
                    <div className="ai-chat-column">
                      <div className="ai-chat-box">
                        <div className="chat-msg user-msg">
                          <span className="chat-avatar">MV</span>
                          <div className="chat-bubble">
                            <strong>Mateja (vasosofuji):</strong>
                            <p>{AI_PROMPTS[chatPromptIndex].prompt}</p>
                          </div>
                        </div>

                        <div className="chat-msg agent-msg">
                          <span className="chat-avatar agent-av">AGY</span>
                          <div className="chat-bubble">
                            <strong>Antigravity Orchestrator &amp; Claude Code:</strong>
                            <p>
                              Deep reasoning initialized. Refactoring timeline to bind Lenis scroll triggers directly to hardware-accelerated compositor layers.
                            </p>
                            <pre className="streamed-code-block">
                              <code>{AI_PROMPTS[chatPromptIndex].codeResponse}</code>
                            </pre>
                            {isStreamingCode && (
                              <div className="streaming-indicator">
                                <span className="stream-dot" /> Compiling TypeScript AST &amp; verifying WebGL frame loop...
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Interactive Prompt Suggestions */}
                      <div className="ai-prompt-quick-actions">
                        <span className="qa-label">Test Real-Time Directives:</span>
                        <div className="qa-buttons-row">
                          {AI_PROMPTS.map((p, idx) => (
                            <button
                              key={p.label}
                              type="button"
                              className={`qa-btn ${chatPromptIndex === idx ? "active" : ""}`}
                              onClick={() => triggerAiPrompt(idx)}
                            >
                              ▶ {p.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Live Build Telemetry & Tool Activity */}
                    <div className="ai-telemetry-column">
                      <div className="telemetry-card">
                        <h6>Active Pipeline: WebStorm + Vite ESM</h6>
                        <ul className="telemetry-list">
                          <li><span className="status-dot-green" /> <strong>React 19:</strong> Strict Concurrent Mode</li>
                          <li><span className="status-dot-green" /> <strong>Tailwind CSS v4:</strong> LightningCSS engine</li>
                          <li><span className="status-dot-green" /> <strong>Oxlint:</strong> 0 errors on 24 threads</li>
                          <li><span className="status-dot-green" /> <strong>GSAP 3.15:</strong> ScrollTrigger &amp; Observer active</li>
                        </ul>
                      </div>

                      <div className="figma-sync-card">
                        <div className="figma-header">
                          <span>🎨 Figma Dev Mode Sync</span>
                          <span className="sync-tag">100% Token Parity</span>
                        </div>
                        <p>Design variables automatically exported into CSS custom properties with zero drift.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════════════
                  STAGE 3: DNS, DOMAIN CONNECTION & SECURITY HARDENING
                  ══════════════════════════════════════════════════════════ */}
              {activeStage === 3 && (
                <div className="stage-screen stage-dns-propagation">
                  <div className="stage-panel-header">
                    <div>
                      <span className="step-count-pill">STEP 04 OF 05</span>
                      <h4>Domain Linking &amp; Global Anycast DNS Routing</h4>
                    </div>
                    <button
                      type="button"
                      className="dev-btn-primary"
                      style={{ padding: "6px 14px", fontSize: "0.8rem" }}
                      onClick={triggerDnsPropagation}
                      disabled={isPropagating}
                    >
                      {isPropagating ? "Pinging Nodes..." : "⚡ Re-Test Global DNS Nodes"}
                    </button>
                  </div>

                  <div className="dns-dashboard-grid">
                    {/* Left: Domain Records Configuration */}
                    <div className="dns-records-card">
                      <div className="dns-domain-row">
                        <span className="domain-globe">🌐</span>
                        <div>
                          <strong>vasojevich.com</strong>
                          <small>Alias: vasosofuji.github.io • Edge CDN</small>
                        </div>
                        <span className="ssl-secured-badge">🔒 TLS 1.3 Active</span>
                      </div>

                      <table className="dns-table">
                        <thead>
                          <tr>
                            <th>Type</th>
                            <th>Host</th>
                            <th>Target / Value</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><code>A</code></td>
                            <td>@</td>
                            <td>185.199.108.153</td>
                            <td><span className="table-status-green">✓ Active</span></td>
                          </tr>
                          <tr>
                            <td><code>AAAA</code></td>
                            <td>@</td>
                            <td>2606:50c0:8000::153</td>
                            <td><span className="table-status-green">✓ Active</span></td>
                          </tr>
                          <tr>
                            <td><code>CNAME</code></td>
                            <td>www</td>
                            <td>vasosofuji.github.io</td>
                            <td><span className="table-status-green">✓ Active</span></td>
                          </tr>
                        </tbody>
                      </table>

                      <div className="dns-security-status">
                        <strong>🛡️ FINKI Security Protocols Applied:</strong>
                        <span>HSTS Preloaded • DNSSEC Enabled • CSP Level 3 Active</span>
                      </div>
                    </div>

                    {/* Right: Global Edge Propagation Nodes */}
                    <div className="dns-nodes-card">
                      <h6>Global Anycast Edge Nodes:</h6>
                      <div className="dns-nodes-list">
                        {dnsNodes.map((node) => (
                          <div key={node.city} className="dns-node-item">
                            <div className="node-info">
                              <span className="node-city">{node.city}</span>
                              <small className="node-ip">{node.ip}</small>
                            </div>
                            <div className="node-status-wrap">
                              <span className="node-lat">{node.latency}</span>
                              <span className={`node-indicator ${node.status === "online" ? "online" : "checking"}`} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════════════
                  STAGE 4: LIVE PRODUCTION MACOS BROWSER APP (GRAND FINALE)
                  ══════════════════════════════════════════════════════════ */}
              {activeStage === 4 && (
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
                        onClick={() => setDemoLang((prev) => (prev === "en" ? "mk" : "en"))}
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

          {/* Realistic Hardware Keyboard Deck & Chamfered Aluminum Lip */}
          <div className="laptop-keyboard-deck">
            <div className="keyboard-hinge" />
            <div className="laptop-speaker-grille left" />
            <div className="keyboard-keys-preview">
              <div className="key-row" />
              <div className="key-row" />
            </div>
            <div className="laptop-speaker-grille right" />
            <div className="trackpad-indent" />
            <div className="laptop-notch-opener" />
          </div>

          {/* Ambient Desk Drop Shadow */}
          <div className="laptop-desk-shadow" />
        </div>
      </div>
    </div>
  );
}

export default ParallaxLaptopBuilder;
