"use client";

import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import { useEffect, useRef } from "react";

const images = [
  "photos/portraits/DSCF0950.jpg",
  "photos/portraits/IMG_5213.jpg",
  "photos/portraits/IMG_9828.jpg",
  "photos/portraits/DSCF0977.jpg",
  "photos/landscapes/IMG_8896.jpg",
  "photos/landscapes/blurryasfuck.jpg",
  "photos/landscapes/IMG_8635.jpg",
  "photos/landscapes/IMG_88967.jpg",
  "photos/concerts/Untitled-13.jpg",
  "photos/concerts/Untitled-15.jpg",
  "photos/concerts/kork.jpg",
  "photos/concerts/loverave2.jpg",
];

const ParallaxScroll = () => {
  const gallery = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: gallery,
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    let frameId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    };

    frameId = requestAnimationFrame(raf);

    return () => {
      // Without this the loop outlived the component and kept calling into a
      // destroyed Lenis instance - a second orphaned rAF on every remount.
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  return (
    <main className="w-full bg-transparent text-white">

      <div
        ref={gallery}
        className="relative box-border flex h-[75vh] md:h-[90vh] gap-[2vw] overflow-hidden bg-black/40 border-b border-neutral-900/60 items-start justify-center p-0 parallax-mask-container"
      >
        <Column images={[images[0], images[1], images[2]]} y={scrollYProgress} offset={60} isReversed={false} />
        <Column images={[images[3], images[4], images[5]]} y={scrollYProgress} offset={80} isReversed={true} />
        <Column images={[images[6], images[7], images[8]]} y={scrollYProgress} offset={100} isReversed={false} className="hidden sm:flex" />
        <Column images={[images[9], images[10], images[11]]} y={scrollYProgress} offset={120} isReversed={true} className="hidden md:flex" />
      </div>
    </main>
  );
};

type ColumnProps = {
  images: string[];
  y: MotionValue<number>;
  offset: number;
  isReversed: boolean;
  className?: string;
};

const Column = ({ images, y, offset, isReversed, className = "" }: ColumnProps) => {
  const yRange = isReversed ? [offset, -offset] : [-offset, offset];
  const scrollY = useTransform(y, [0, 1], yRange);

  return (
    <motion.div
      className={`relative flex flex-col gap-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 min-w-[140px] justify-between parallax-gpu-column ${className}`}
      style={{
        y: scrollY,
        top: -offset,
        height: `calc(100% + ${2 * offset}px)`,
      }}
    >
      {images.map((src, i) => (
        <div
          key={i}
          className="relative flex-1 w-full overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 shadow-2xl group parallax-gpu-item"
        >
          <img
            src={`${src}`}
            alt="gallery item"
            loading="lazy"
            className="h-full w-full pointer-events-none object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-90 hover:brightness-100"
          />
        </div>
      ))}
    </motion.div>
  );
};

export { ParallaxScroll };
