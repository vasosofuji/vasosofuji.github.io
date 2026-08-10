import { useState } from "react";
import { LazyMotion, domAnimation, m, MotionConfig, useReducedMotion } from "framer-motion";

export interface GalleryPhoto {
  id: string | number;
  image: string;
}

export interface InteractiveFolderGalleryProps {
  photos: GalleryPhoto[];
  folderName?: string;
  dragHintText?: string;
  className?: string;
}

export function InteractiveFolderGallery({
  photos,
  className
}: InteractiveFolderGalleryProps) {
  const [isFolderOpen, setIsFolderOpen] = useState(false);
  const [hoverFolder, setHoverFolder] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <div className={`w-full py-16 relative ${className || ""}`}>
        <div className="relative w-full min-h-[400px] sm:min-h-[500px] flex flex-col items-center justify-center">

          <div className="relative w-full max-w-[400px] h-[400px] sm:h-[500px] flex justify-center pointer-events-none z-0">

            <m.div 
              className="absolute bottom-6 w-[80%] max-w-[320px] h-48 sm:h-56 drop-shadow-2xl"
              animate={{ scale: isFolderOpen ? 0.95 : 1 }}
              transition={shouldReduceMotion ? { duration: 0 } : undefined}
            >
              <div className="absolute top-0 left-0 w-32 h-10 bg-linear-to-t from-[#1e1e1e] to-[#2a2a2a] rounded-t-xl border-t border-l border-r border-white/10" />
              <div className="absolute top-8 left-0 right-0 bottom-0 bg-linear-to-b from-[#1e1e1e] to-[#0a0a0a] rounded-b-xl rounded-tr-xl border border-white/10 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]" />
              <div className="absolute top-10 left-2 right-2 bottom-2 bg-black rounded-lg shadow-inner pointer-events-none" />
            </m.div>

            <div className="absolute bottom-10 w-full h-full z-10 flex justify-center perspective-[1000px]">
              {photos.map((photo, i) => {
                const offset = i - 2;

                const stackY = hoverFolder ? offset * -10 - 40 : offset * -5;
                const stackX = hoverFolder ? offset * 30 : offset * 3;
                const stackRotate = hoverFolder ? offset * 8 : offset * 3;
                const stackScale = 1 - Math.abs(offset) * 0.03;

                const openY = -130;
                const openX = offset * 130;
                const openRotate = 0;
                const openScale = 1.05;

                return (
                  <m.div
                    key={photo.id}
                    drag={isFolderOpen ? true : false}
                    dragSnapToOrigin={true}
                    onDragEnd={(_e, info) => {
                      if (info.offset.y > 100 && isFolderOpen) {
                        setIsFolderOpen(false);
                        setHoverFolder(false);
                      }
                    }}
                    className={`absolute bottom-0 w-3/5 max-w-56 aspect-[3/4] rounded-xl border-4 border-white overflow-hidden shadow-[0_10px_20px_rgba(0,0,0,0.5)] cursor-grab active:cursor-grabbing z-10 origin-bottom ${isFolderOpen ? "pointer-events-auto" : "pointer-events-none"}`}
                    animate={!isFolderOpen ? {
                      y: stackY,
                      x: stackX,
                      rotate: stackRotate,
                      scale: stackScale,
                      zIndex: i + 10
                    } : {
                      y: openY,
                      x: openX,
                      rotate: openRotate,
                      scale: openScale,
                      zIndex: 50
                    }}
                    whileHover={isFolderOpen ? { scale: openScale + 0.05, zIndex: 100 } : {}}
                    whileDrag={isFolderOpen ? { scale: openScale + 0.1, rotate: 5, zIndex: 150 } : {}}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  >
                    <img src={photo.image} alt="Gallery item" className="w-full h-full object-cover pointer-events-none" />
                  </m.div>
                );
              })}
            </div>

            <m.div 
              className="absolute bottom-0 w-[85%] max-w-[340px] h-36 sm:h-44 drop-shadow-[0_-20px_40px_rgba(0,0,0,0.8)] cursor-pointer z-20 pointer-events-auto"
              style={{ transformOrigin: "bottom" }}
              whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -5 }}
              animate={{ 
                rotateX: isFolderOpen ? -60 : hoverFolder ? -25 : 0, 
                y: isFolderOpen ? 20 : hoverFolder ? 10 : 0,
                pointerEvents: isFolderOpen ? "none" : "auto" 
              }}
              onMouseEnter={() => setHoverFolder(true)}
              onMouseLeave={() => setHoverFolder(false)}
              onClick={() => setIsFolderOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setIsFolderOpen(true);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="Open gallery folder"
            >
              <div className="w-full h-full bg-linear-to-b from-[#2a2a2a] to-[#111] rounded-2xl border border-white/20 shadow-[inset_0_2px_10px_rgba(255,255,255,0.1)] relative overflow-hidden flex items-end justify-center pb-8">
                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/40 to-transparent" />
              </div>
            </m.div>
          </div>
        </div>
      </div>
      </MotionConfig>
    </LazyMotion>
  );
}
