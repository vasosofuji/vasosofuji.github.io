"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

export interface CardItem {
  imgUrl: string;
  alt?: string;
  linkUrl?: string;
}

interface SocialCardsProps {
  cards: CardItem[];
}

const MAX_VISIBLE = 7;
const HALF = 3;

const FAN_POSITIONS = [
  { rot: -21, scale: 0.7756, x: -30, y: 7.3, zIndex: 1 },
  { rot: -14, scale: 0.8498, x: -22, y: 4.0, zIndex: 2 },
  { rot: -7,  scale: 0.9346, x: -11, y: 1.3, zIndex: 3 },
  { rot: 0,   scale: 1.0,    x: 0,   y: 0.0, zIndex: 10 },
  { rot: 7,   scale: 0.9346, x: 11,  y: 1.3, zIndex: 3 },
  { rot: 14,  scale: 0.8498, x: 22,  y: 4.0, zIndex: 2 },
  { rot: 21,  scale: 0.7756, x: 30,  y: 7.3, zIndex: 1 },
];

function getResponsiveMultiplier(width: number) {
  if (width < 480) return 0.28;
  if (width < 640) return 0.38;
  if (width < 768) return 0.5;
  if (width < 1024) return 0.75;
  return 1.0;
}

function getHeightMultiplier(width: number) {
  let idealPx: number;
  if (width < 480) idealPx = 22 * 16;
  else if (width < 640) idealPx = 26 * 16;
  else if (width < 768) idealPx = 28 * 16;
  else if (width < 1024) idealPx = 34 * 16;
  else idealPx = 38 * 16;

  const available = window.innerHeight * 0.7;
  if (available >= idealPx) return 1;
  return available / idealPx;
}

function getSlotConfig(totalCards: number, slot: number) {
  if (totalCards >= MAX_VISIBLE) return FAN_POSITIONS[slot];
  const center = totalCards >> 1;
  const distance = totalCards > 1 ? (slot - center) / center : 0;
  const absDistance = Math.abs(distance);
  return {
    rot: distance * 21,
    scale: 1.0 - 0.2244 * absDistance * absDistance,
    x: distance * 30,
    y: absDistance * absDistance * 7.3,
    zIndex: 10 - Math.abs(slot - center),
  };
}

const ARROW_CLASSES =
  "relative flex items-center justify-center rounded-full border-[1.5px] border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-[16px] text-black/40 dark:text-white/55 cursor-pointer shrink-0 z-30 outline-none shadow-[0_4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:border-black/25 dark:hover:border-white/25 hover:text-black/70 dark:hover:text-white/80 active:opacity-70 transition-colors duration-300 before:content-[''] before:absolute before:inset-[3px] before:rounded-full before:border before:border-black/[0.04] dark:before:border-white/[0.04] before:pointer-events-none";

const chevron = (direction: "left" | "right") => (
  <svg className="relative z-[2] w-4 h-4 md:w-5 md:h-5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points={direction === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
  </svg>
);

export default function SocialCards({ cards }: SocialCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const hasEntered = useRef(false);
  const directionRef = useRef<"left" | "right" | null>(null);
  const prevVisible = useRef<Set<number> | null>(null);
  const activeSlotRef = useRef<number | null>(null);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const totalCards = cards.length;
  const needsPagination = totalCards >= MAX_VISIBLE;
  const [centerIndex, setCenterIndex] = useState(needsPagination ? HALF : totalCards >> 1);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const getVisibleMap = useCallback((center: number) => {
    const map = new Map<number, number>();
    if (!needsPagination) {
      cards.forEach((_, i) => map.set(i, i));
      return map;
    }
    for (let slot = 0; slot < MAX_VISIBLE; slot++) {
      map.set(((center + slot - HALF) % totalCards + totalCards) % totalCards, slot);
    }
    return map;
  }, [totalCards, needsPagination, cards]);

  const cycle = useCallback((direction: "left" | "right") => {
    if (isAnimating.current || !needsPagination) return;
    isAnimating.current = true;
    directionRef.current = direction;
    setCenterIndex(prev =>
      direction === "right" ? (prev + 1) % totalCards : (prev - 1 + totalCards) % totalCards
    );
  }, [totalCards, needsPagination]);

  const updateHoverLayout = useCallback((visibleEntries: { el: HTMLElement; slot: number }[], hoveredSlot: number | null) => {
    const mult = getResponsiveMultiplier(window.innerWidth);
    const hM = getHeightMultiplier(window.innerWidth);
    const slotCount = needsPagination ? MAX_VISIBLE : totalCards;
    const config = (slot: number) => getSlotConfig(slotCount, slot);
    const centerSlot = visibleEntries.length >> 1;

    visibleEntries.forEach(({ el, slot }) => {
      const base = config(slot);
      let targetX = base.x * mult;
      let targetY = base.y * hM;
      let targetRot = base.rot;
      let targetScale = base.scale;
      let delay = 0;

      if (hoveredSlot !== null) {
        const distance = Math.abs(slot - hoveredSlot);
        delay = distance * 0.06;

        if (slot === hoveredSlot) {
          targetY -= 2.5 * hM;
          targetScale *= 1.08;
        } else {
          const normalized = centerSlot > 0 ? (slot - centerSlot) / centerSlot : 0;
          const pushStrength = 8 * (1 - Math.abs(normalized)) * (1 + 0.2 * Math.max(0, 3 - distance));

          if (slot < hoveredSlot) {
            targetX -= pushStrength * mult;
            targetRot -= 3 / (distance + 1);
          } else {
            targetX += pushStrength * mult;
            targetRot += 3 / (distance + 1);
          }

          if (slot === visibleEntries.length - 1 && hoveredSlot < centerSlot) targetY -= 1 * hM;
          if (slot === 0 && hoveredSlot > centerSlot) targetY -= 1 * hM;
        }
      } else {
        delay = Math.abs(slot - centerSlot) * 0.06;
      }

      gsap.to(el, {
        x: targetX * 16, y: targetY * 16, rotation: targetRot, scale: targetScale,
        duration: 1.2, delay, ease: "elastic.out(1,.75)", overwrite: "auto",
        force3D: true,
      });
      gsap.set(el, { zIndex: base.zIndex });
    });
  }, [needsPagination, totalCards]);

  const updateHoverLayoutRef = useRef(updateHoverLayout);
  useEffect(() => {
    updateHoverLayoutRef.current = updateHoverLayout;
  }, [updateHoverLayout]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !totalCards) return () => {};

    const cardElements = Array.from(container.querySelectorAll<HTMLElement>(".fan-card"));
    if (!cardElements.length) return () => {};

    let initialTimer: ReturnType<typeof setTimeout> | undefined;

    if (!isVisible) {
      cardElements.forEach(card => gsap.set(card, { autoAlpha: 0 }));
    } else {
      const visibleMap = getVisibleMap(centerIndex);
      if (!prevVisible.current) prevVisible.current = new Set();
      const previouslyVisible = prevVisible.current;
      const direction = directionRef.current;
      const isFirstMount = !hasEntered.current;
      const multiplier = getResponsiveMultiplier(window.innerWidth);
      const hMult = getHeightMultiplier(window.innerWidth);
      const slotCount = needsPagination ? MAX_VISIBLE : totalCards;
      const config = (slot: number) => getSlotConfig(slotCount, slot);

      if (!( !isVisible && isFirstMount )) {
        if (isFirstMount) {
          hasEntered.current = true;
          isAnimating.current = true;
        }

        let completedCount = 0;
        const onCardDone = () => {
          completedCount++;
        };

        initialTimer = setTimeout(() => {
          isAnimating.current = false;
        }, isFirstMount ? 800 : 500);

        cardElements.forEach((card, cardIndex) => {
          const slot = visibleMap.get(cardIndex);
          const wasVisible = previouslyVisible.has(cardIndex);

          if (slot !== undefined) {
            const { x, y, rot, scale, zIndex } = config(slot);
            const target = {
              x: x * multiplier * 16,
              y: y * hMult * 16,
              rotation: rot,
              scale,
              autoAlpha: 1,
              zIndex,
              force3D: true,
            };

            if (isFirstMount) {
              gsap.set(card, { x: 0, y: 12 * hMult * 16, rotation: 0, scale: 0.5, autoAlpha: 0 });
              gsap.to(card, { ...target, duration: 1.2, ease: "elastic.out(1.05,.78)", delay: 0.1 + slot * 0.05, onComplete: onCardDone });
            } else if (!wasVisible) {
              const enterX = direction === "right" ? 40 : -40;
              gsap.set(card, { x: enterX * 16, y: y * hMult * 16, rotation: direction === "right" ? 30 : -30, scale: 0.5, autoAlpha: 0 });
              gsap.to(card, { ...target, duration: 0.8, ease: "power2.out", onComplete: onCardDone });
            } else {
              gsap.to(card, { ...target, duration: 0.7, ease: "power2.out", onComplete: onCardDone });
            }
          } else if (wasVisible) {
            const exitX = direction === "right" ? -40 : 40;
            gsap.to(card, { x: exitX * 16, autoAlpha: 0, scale: 0.5, rotation: direction === "right" ? -30 : 30, duration: 0.6, ease: "power2.in", zIndex: 0, force3D: true });
          } else if (isFirstMount) {
            gsap.set(card, { autoAlpha: 0, scale: 0.3, x: 0, y: 0, zIndex: 0 });
          }
        });

        prevVisible.current = new Set(visibleMap.keys());
      }
    }

    // Only the width affects the fan's geometry. Mobile browsers fire `resize`
    // every time the URL bar slides away, and re-running a 1.2s elastic tween
    // on every visible card mid-scroll is what made the fan judder. Debounced,
    // and height-only changes are ignored entirely.
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    let lastWidth = window.innerWidth;

    const relayout = () => {
      if (isAnimating.current) return;
      const visibleMap = getVisibleMap(centerIndex);
      const visibleEntries: { el: HTMLElement; slot: number }[] = [];
      cardElements.forEach((el, i) => {
        const s = visibleMap.get(i);
        if (s !== undefined) visibleEntries.push({ el, slot: s });
      });
      visibleEntries.sort((a, b) => a.slot - b.slot);
      updateHoverLayoutRef.current(visibleEntries, activeSlotRef.current);
    };

    const onResize = () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(relayout, 180);
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
      if (initialTimer) clearTimeout(initialTimer);
      gsap.killTweensOf(cardElements);
    };
  }, [centerIndex, totalCards, getVisibleMap, needsPagination, isVisible]);

  // --- Swipe to cycle (touch / pen) ---
  // touch-action: pan-y on the container lets the browser keep vertical
  // scrolling while we claim the horizontal axis, so the page never feels
  // stuck. Only a decisively horizontal gesture counts.
  const swipe = useRef<{ x: number; y: number; id: number; locked: boolean | null } | null>(null);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (!needsPagination) return;
    if (e.pointerType === "mouse") return; // desktop keeps the hover fan + arrows
    swipe.current = { x: e.clientX, y: e.clientY, id: e.pointerId, locked: null };
  }, [needsPagination]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const s = swipe.current;
    if (!s || e.pointerId !== s.id) return;
    if (s.locked === null) {
      const dx = Math.abs(e.clientX - s.x);
      const dy = Math.abs(e.clientY - s.y);
      if (dx < 8 && dy < 8) return;      // not yet a gesture
      s.locked = dx > dy;                 // true = horizontal, ours
    }
  }, []);

  const endSwipe = useCallback((e: React.PointerEvent) => {
    const s = swipe.current;
    if (!s || e.pointerId !== s.id) return;
    swipe.current = null;
    if (!s.locked) return;
    const dx = e.clientX - s.x;
    if (Math.abs(dx) < 45) return;        // too small to be intentional
    // Drag left => reveal the next card, matching the right arrow.
    cycle(dx < 0 ? "right" : "left");
  }, [cycle]);

  const handleMouseEnter = (cardIndex: number) => {
    if (isAnimating.current) return;
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = undefined;
    }

    const container = containerRef.current;
    if (!container) return;
    const cardElements = Array.from(container.querySelectorAll<HTMLElement>(".fan-card"));

    const visibleMap = getVisibleMap(centerIndex);
    const slot = visibleMap.get(cardIndex);
    if (slot === undefined) return;

    const visibleEntries: { el: HTMLElement; slot: number }[] = [];
    cardElements.forEach((el, i) => {
      const s = visibleMap.get(i);
      if (s !== undefined) visibleEntries.push({ el, slot: s });
    });
    visibleEntries.sort((a, b) => a.slot - b.slot);

    activeSlotRef.current = slot;
    updateHoverLayout(visibleEntries, slot);
  };

  const handleMouseLeave = () => {
    if (isAnimating.current) return;
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);

    leaveTimerRef.current = setTimeout(() => {
      const container = containerRef.current;
      if (!container) return;
      const cardElements = Array.from(container.querySelectorAll<HTMLElement>(".fan-card"));

      const visibleMap = getVisibleMap(centerIndex);
      const visibleEntries: { el: HTMLElement; slot: number }[] = [];
      cardElements.forEach((el, i) => {
        const s = visibleMap.get(i);
        if (s !== undefined) visibleEntries.push({ el, slot: s });
      });
      visibleEntries.sort((a, b) => a.slot - b.slot);

      activeSlotRef.current = null;
      updateHoverLayout(visibleEntries, null);
    }, 120);
  };

  if (!totalCards) return null;

  return (
    <section className="flex flex-col items-center w-full py-4 lg:py-6 px-4 md:px-8 relative pointer-events-none">
      <div className="flex items-center justify-center w-full max-w-[90rem]">
        <div
          ref={containerRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endSwipe}
          onPointerCancel={endSwipe}
          style={{ touchAction: "pan-y" }}
          className="fan-layout flex relative justify-center items-center w-full max-w-[80rem] h-[clamp(520px,160vw,600px)] md:h-[650px] lg:h-[700px]"
        >
          {cards.map((card, index) => {
            const image = (
              <div className="relative w-full h-full overflow-hidden rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                <img src={card.imgUrl} loading="lazy" decoding="async" alt={card.alt || `Card ${index}`} className="absolute inset-0 w-full h-full object-cover z-10" />
              </div>
            );
            return card.linkUrl ? (
              <a
                key={card.imgUrl || index}
                href={card.linkUrl}
                target={card.linkUrl.startsWith("http") ? "_blank" : "_self"}
                rel="noopener noreferrer"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                className="fan-card block cursor-pointer absolute pointer-events-auto w-[clamp(200px,75vw,300px)] h-[clamp(280px,105vw,420px)] md:w-[380px] md:h-[530px]"
              >
                {image}
              </a>
            ) : (
              <div
                key={card.imgUrl || index}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                className="fan-card absolute pointer-events-auto w-[clamp(200px,75vw,300px)] h-[clamp(280px,105vw,420px)] md:w-[380px] md:h-[530px]"
              >
                {image}
              </div>
            );
          })}
        </div>
      </div>

      {needsPagination && (
        <div className="flex items-center justify-center gap-6 mt-8 md:mt-12 lg:mt-16 z-30 pointer-events-auto">
          <button type="button" className={`${ARROW_CLASSES} w-10 h-10 md:w-12 md:h-12`} onClick={() => cycle("left")} aria-label="Previous">
            {chevron("left")}
          </button>
          <div className="flex items-center gap-3">
            {cards.map((card, i) => (
              <span key={card.imgUrl || i} className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${i === centerIndex ? "bg-[#ff6b00] scale-[1.3] shadow-[0_0_10px_rgba(255,107,0,0.5)]" : "bg-white/15"}`} />
            ))}
          </div>
          <button type="button" className={`${ARROW_CLASSES} w-10 h-10 md:w-12 md:h-12`} onClick={() => cycle("right")} aria-label="Next">
            {chevron("right")}
          </button>
        </div>
      )}
    </section>
  );
}
