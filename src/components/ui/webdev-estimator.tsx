import { useState, useEffect } from "react";

interface ProjectTier {
  id: string;
  name: string;
  nameMk: string;
  baseDays: number;
  description: string;
  descriptionMk: string;
  deliverables: string[];
  deliverablesMk: string[];
}

const PROJECT_TIERS: ProjectTier[] = [
  {
    id: "portfolio",
    name: "Creative Portfolio & Editorial Site",
    nameMk: "Креативно Портфолио & Веб Сајт",
    baseDays: 4,
    description: "Bespoke digital presence engineered with custom GSAP animations, responsive layouts, and zero-bloat architecture.",
    descriptionMk: "Уникатен сајт изработен со напредни GSAP анимации, брзо вчитување и без готови темплејти.",
    deliverables: [
      "Custom React 19 / TypeScript layout (zero template code)",
      "Kinetic GSAP micro-interactions and smooth inertial scrolling",
      "Optimized media delivery and responsive cross-device layout",
      "100/100 Google Lighthouse performance rating",
    ],
    deliverablesMk: [
      "Уникатен React 19 / TypeScript дизајн (без готови темплејти)",
      "GSAP микро-анимации и мазно скролање",
      "Оптимизирани слики и респонзивен дизајн за сите екрани",
      "100/100 Google Lighthouse брзина и перформанси",
    ],
  },
  {
    id: "webapp",
    name: "Interactive Web Application",
    nameMk: "Интерактивна Веб Апликација",
    baseDays: 8,
    description: "Full-stack frontend/backend architecture, dynamic state machines, booking engines, and database integration.",
    descriptionMk: "Комплетна full-stack архитектура, динамички календари за резервации и бази на податоци.",
    deliverables: [
      "React / Next.js / Node.js full-stack system",
      "Strict input validation and cybersecurity hardening",
      "Custom API endpoints and database storage",
      "Automated CI/CD deployment pipeline",
    ],
    deliverablesMk: [
      "React / Next.js / Node.js систем",
      "Сајбер безбедносна заштита и строга валидација",
      "Интеграција со API и база на податоци",
      "Автоматско хостирање и сигурносен протокол",
    ],
  },
  {
    id: "eventhub",
    name: "Event, Conference & Media Portal",
    nameMk: "Портал за Настани, Конференции & Медиуми",
    baseDays: 6,
    description: "High-traffic portals built for festivals, conferences, sponsor showcases, and multimedia ad campaigns.",
    descriptionMk: "Платформи за фестивали, конференции, промоција на спонзори и видео материјали.",
    deliverables: [
      "Dynamic event schedule and booking modules",
      "Integrated audio/video media player",
      "Sponsor tier showcases and interactive assets",
      "High-throughput caching for traffic spikes",
    ],
    deliverablesMk: [
      "Динамички распоред на програма и резервации",
      "Интегриран аудио/видео плеер за промоции",
      "Спонзорски структури и интерактивни елементи",
      "Оптимизација за висок сообраќај и посети",
    ],
  },
];

interface AddOnOption {
  id: string;
  name: string;
  nameMk: string;
  days: number;
}

const ADDON_OPTIONS: AddOnOption[] = [
  { id: "i18n", name: "Instant Multilingual Engine (EN / MK)", nameMk: "Мултијазичен Систем (MK / EN)", days: 1 },
  { id: "cybersec", name: "Cybersecurity CSP Hardening (FINKI Standards)", nameMk: "Сајбер Безбедност & Заштита (ФИНКИ)", days: 1 },
  { id: "canvas", name: "Custom Canvas 2D / WebGL Film Shader", nameMk: "Canvas 2D / WebGL Филмски Ефекти", days: 2 },
  { id: "seo", name: "Semantic SEO & OpenGraph Social Cards", nameMk: "SEO Оптимизација & Социјални Прегледи", days: 1 },
];

export function WebdevEstimator() {
  const [selectedTier, setSelectedTier] = useState<string>("portfolio");
  const [selectedAddons, setSelectedAddons] = useState<string[]>(["i18n", "cybersec"]);
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

  const currentTier = PROJECT_TIERS.find((t) => t.id === selectedTier) || PROJECT_TIERS[0];
  
  const additionalDays = selectedAddons.reduce((total, id) => {
    const addon = ADDON_OPTIONS.find((a) => a.id === id);
    return total + (addon ? addon.days : 0);
  }, 0);

  const totalEstimatedDays = currentTier.baseDays + additionalDays;

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleLaunchProject = () => {
    const addonNames = selectedAddons
      .map((id) => ADDON_OPTIONS.find((a) => a.id === id)?.[isMk ? "nameMk" : "name"])
      .filter(Boolean)
      .join(", ");

    const summary = `Selected Architecture: ${isMk ? currentTier.nameMk : currentTier.name}\nEstimated Timeline: ~${totalEstimatedDays} Days\nFeatures: ${addonNames}`;

    const msgBox = document.querySelector<HTMLTextAreaElement>('textarea[name="message"]');
    if (msgBox) {
      msgBox.value = `Hi Mateja,\n\nI want to discuss a project with the following scope:\n\n${summary}\n\nLet's get in touch!`;
    }

    if (typeof window.openPopupCalendar === "function") {
      window.openPopupCalendar();
    } else {
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="estimator-container">
      <div className="estimator-header">
        <h3>{isMk ? "Калкулатор на Рокови и Опсег" : "Project Scope & Timeline Calculator"}</h3>
        <p>
          {isMk
            ? "Изберете го типот на веб проект и дополнителните технологии за реална проценка на времето за изработка."
            : "Select the architectural archetype and engineering features for an accurate production timeline."}
        </p>
      </div>

      <div className="estimator-grid">
        {/* Left Column: Project Type Selector & Addons */}
        <div className="estimator-controls">
          <label className="estimator-step-label">
            <span className="step-badge">1</span>
            {isMk ? "Архитектура на Проектот" : "Project Archetype"}
          </label>
          <div className="tier-cards-grid">
            {PROJECT_TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`tier-select-card ${selectedTier === tier.id ? "active" : ""}`}
                onClick={() => setSelectedTier(tier.id)}
              >
                <div className="tier-radio">
                  <span className="radio-dot" />
                </div>
                <div className="tier-card-body">
                  <h4>{isMk ? tier.nameMk : tier.name}</h4>
                  <p>{isMk ? tier.descriptionMk : tier.description}</p>
                </div>
              </div>
            ))}
          </div>

          <label className="estimator-step-label mt-6">
            <span className="step-badge">2</span>
            {isMk ? "Инженерски Модули" : "Engineering Modules"}
          </label>
          <div className="addons-checkbox-grid">
            {ADDON_OPTIONS.map((addon) => {
              const isChecked = selectedAddons.includes(addon.id);
              return (
                <div
                  key={addon.id}
                  className={`addon-item-box ${isChecked ? "checked" : ""}`}
                  onClick={() => toggleAddon(addon.id)}
                >
                  <span className="addon-title">{isMk ? addon.nameMk : addon.name}</span>
                  <span className="addon-status">{isChecked ? "✓" : "+"}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Summary Card */}
        <div className="estimator-summary-card">
          <div className="summary-selected-tier">
            <small>{isMk ? "Избран модел" : "Selected Archetype"}</small>
            <h3>{isMk ? currentTier.nameMk : currentTier.name}</h3>
          </div>

          <div className="summary-metric-box">
            <div className="metric-col">
              <span className="metric-lbl">{isMk ? "Проценет Рок" : "Turnaround Time"}</span>
              <strong className="metric-val">{totalEstimatedDays} - {totalEstimatedDays + 2} {isMk ? "Дена" : "Days"}</strong>
            </div>
            <div className="metric-col">
              <span className="metric-lbl">{isMk ? "Код & Стандард" : "Engineering"}</span>
              <strong className="metric-val" style={{ color: "#EB7D00" }}>100% Hand-Crafted</strong>
            </div>
          </div>

          <div className="summary-deliverables">
            <h5>{isMk ? "Вклучени испораки:" : "Included Deliverables:"}</h5>
            <ul>
              {(isMk ? currentTier.deliverablesMk : currentTier.deliverables).map((item, idx) => (
                <li key={idx}>
                  <span className="check-icon">✓</span> {item}
                </li>
              ))}
              {selectedAddons.map((id) => {
                const addon = ADDON_OPTIONS.find((a) => a.id === id);
                if (!addon) return null;
                return (
                  <li key={id} className="addon-deliverable">
                    <span className="check-icon">✓</span> {isMk ? addon.nameMk : addon.name}
                  </li>
                );
              })}
            </ul>
          </div>

          <button
            type="button"
            className="estimator-cta-button"
            onClick={handleLaunchProject}
          >
            {isMk ? "Започни Соработка →" : "Initiate Project →"}
          </button>

          <p className="summary-disclaimer">
            {isMk
              ? "Директна комуникација со девелоперот без посредници, прецизен распоред и транспарентен процес."
              : "Direct developer communication, sprint-based delivery, and clean code documentation."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default WebdevEstimator;
