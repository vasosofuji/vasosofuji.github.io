// components/ui/masonry-grid.tsx
import * as React from 'react';
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  useSpring,
  useReducedMotion,
} from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Props for the MasonryGrid component.
 * @template T - The type of the items in the grid.
 */
interface MasonryGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  gap?: string;
  staggerDelay?: number;
  /** Peak tilt in degrees. Kept low on purpose — see GridItem. */
  tilt?: number;
  onItemClick?: (index: number) => void;
  /** Ascending `min` widths; the last one that fits wins. */
  breakpoints?: { min: number; columns: number }[];
}

// Tracks whether the device actually has a hovering pointer. On a phone the
// tilt has nothing to respond to, and running the springs there is wasted work.
function useFinePointer() {
  const [fine, setFine] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return fine;
}

const GridItem = ({
  children,
  tilt,
  onClick,
}: {
  children: React.ReactNode;
  tilt: number;
  onClick?: () => void;
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const finePointer = useFinePointer();
  const reduceMotion = useReducedMotion();
  const enabled = finePointer && !reduceMotion && tilt > 0;

  // Only the card under the pointer gets a transform. Binding the motion
  // values unconditionally left every card carrying a 3D transform and its own
  // rendering context for the whole session — on a page with thirty-odd cards
  // that is thirty-odd composited layers, and sweeping the pointer across them
  // quickly churns the lot. Idle cards now hold no transform at all.
  const [active, setActive] = React.useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Softer than the stock component (was stiffness 300 / damping 20): this
  // settles rather than snapping, which reads as a drift instead of a flick.
  const mouseXSpring = useSpring(x, { stiffness: 140, damping: 26, mass: 0.6 });
  const mouseYSpring = useSpring(y, { stiffness: 140, damping: 26, mass: 0.6 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [`${tilt}deg`, `-${tilt}deg`]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [`-${tilt}deg`, `${tilt}deg`]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled || !ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    x.set((e.clientX - left) / width - 0.5);
    y.set((e.clientY - top) / height - 0.5);
  };

  const handleMouseEnter = () => {
    if (enabled) setActive(true);
  };

  // Always resets, even if a fast exit means no final mousemove ever lands, so
  // a card cannot be stranded mid-tilt.
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setActive(false);
  };

  const tilting = enabled && active;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      // A deeper perspective flattens the same rotation, reinforcing the
      // subtler feel without changing the numbers. Applied only while tilting
      // so an idle card establishes no 3D context.
      style={tilting ? { perspective: '1600px' } : undefined}
      className="relative"
    >
      <motion.div
        // No preserve-3d: nothing inside the card is positioned in 3D, so it
        // only added a rendering context per card for no visual gain.
        style={tilting ? { rotateX, rotateY, willChange: 'transform' } : undefined}
        whileTap={reduceMotion ? undefined : { scale: 0.985 }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

/**
 * Number of columns for the current viewport.
 *
 * The layout is built from real flex columns rather than CSS `columns`.
 * Multi-column fragments its content, and cards here carry transforms, their
 * own stacking contexts and an info panel that deliberately overflows the card
 * box — a combination that leaves Chrome repainting incorrectly, with cards
 * blanking out as neighbours are hovered. Explicit columns keep every card in
 * one piece and make stacking predictable.
 */
function useColumnCount(breakpoints: { min: number; columns: number }[]) {
  const get = React.useCallback(() => {
    if (typeof window === 'undefined') return 1;
    let cols = 1;
    for (const bp of breakpoints) if (window.innerWidth >= bp.min) cols = bp.columns;
    return cols;
  }, [breakpoints]);

  const [columns, setColumns] = React.useState(get);

  React.useEffect(() => {
    let frame = 0;
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setColumns(get()));
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
    };
  }, [get]);

  return columns;
}

const DEFAULT_BREAKPOINTS = [
  { min: 0, columns: 1 },
  { min: 620, columns: 2 },
  { min: 1000, columns: 3 },
  { min: 1500, columns: 4 },
];

const MasonryGrid = <T,>({
  items,
  renderItem,
  className,
  gap = '1rem',
  staggerDelay = 0.05,
  tilt = 3,
  onItemClick,
  breakpoints = DEFAULT_BREAKPOINTS,
}: MasonryGridProps<T>) => {
  const containerRef = React.useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.05 });
  const reduceMotion = useReducedMotion();
  const columnCount = useColumnCount(breakpoints);

  // Round-robin keeps the original order readable down each column and, unlike
  // height-balancing, needs no measurement pass so nothing reflows on load.
  const columns = React.useMemo(() => {
    const buckets: { item: T; index: number }[][] = Array.from({ length: columnCount }, () => []);
    items.forEach((item, index) => buckets[index % columnCount].push({ item, index }));
    return buckets;
  }, [items, columnCount]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : staggerDelay,
      },
    },
  };

  const itemVariants = reduceMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 24, scale: 0.97 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.5, ease: 'easeOut' as const },
        },
      };

  return (
    <motion.div
      ref={containerRef}
      className={cn('masonry-grid', className)}
      style={{ gap }}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
      role="list"
    >
      {columns.map((column, columnIndex) => (
        <div className="masonry-grid__column" style={{ gap }} key={columnIndex} role="presentation">
          {column.map(({ item, index }) => (
            <motion.div
              key={index}
              className="masonry-grid__item"
              variants={itemVariants}
              role="listitem"
            >
              <GridItem tilt={tilt} onClick={onItemClick ? () => onItemClick(index) : undefined}>
                {renderItem(item, index)}
              </GridItem>
            </motion.div>
          ))}
        </div>
      ))}
    </motion.div>
  );
};

export default MasonryGrid;
