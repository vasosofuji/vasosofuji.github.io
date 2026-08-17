import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { SmokeBackground } from '@/components/ui/spooky-smoke-animation'
import { BlobBackground } from '@/components/ui/blob-background'
import SocialCards from '@/components/ui/card-fan-carousel'
import HoverHeading from '@/components/ui/hover-heading'
import { ParallaxScroll } from '@/components/ui/parallax-scroll'
import SterlingGateKineticNavigation from '@/components/ui/sterling-gate-kinetic-navigation'
import ParallaxLaptopBuilder from '@/components/ui/parallax-laptop-builder'
import WebdevEstimator from '@/components/ui/webdev-estimator'
import { Analytics } from '@vercel/analytics/react'

// --- React Navbar & Global Telemetry ---
const navbarElement = document.getElementById('react-navbar')
if (navbarElement) {
  createRoot(navbarElement).render(
    <StrictMode>
      <SterlingGateKineticNavigation />
      <Analytics />
    </StrictMode>,
  )
}

// --- Global Background ---
const globalBgElement = document.getElementById('react-global-bg')
if (globalBgElement) {
  createRoot(globalBgElement).render(
    <StrictMode>
      <BlobBackground />
    </StrictMode>,
  )
}

// --- Hero Background ---
const heroBgElement = document.getElementById('react-hero-bg')
if (heroBgElement) {
  createRoot(heroBgElement).render(
    <StrictMode>
      <SmokeBackground smokeColor="#ff6b00" />
    </StrictMode>,
  )
}

// --- Galleries ---

const PORTRAIT_CARDS = [
  { imgUrl: "photos/portraits/DSCF0950.jpg", alt: "Portrait" },
  { imgUrl: "photos/portraits/IMG_5213.jpg", alt: "Portrait" },
  { imgUrl: "photos/portraits/IMG_9828.jpg", alt: "Portrait" },
  { imgUrl: "photos/portraits/DSCF0977.jpg", alt: "Portrait" },
  { imgUrl: "photos/portraits/DSCF0893.jpg", alt: "Portrait" },
  { imgUrl: "photos/portraits/DSCF7475.jpg", alt: "Portrait" },
  { imgUrl: "photos/portraits/IMG_5186.jpg", alt: "Portrait" },
  { imgUrl: "photos/portraits/DSCF0831.jpg", alt: "Portrait" },
  { imgUrl: "photos/portraits/IMG_5233.jpg", alt: "Portrait" },
];

const CONCERT_CARDS = [
  { imgUrl: "photos/concerts/Untitled-13.jpg", alt: "Concert" },
  { imgUrl: "photos/concerts/Untitled-15.jpg", alt: "Concert" },
  { imgUrl: "photos/concerts/kork.jpg", alt: "Concert" },
  { imgUrl: "photos/concerts/loverave2.jpg", alt: "Concert" },
  { imgUrl: "photos/concerts/sickabass.jpg", alt: "Concert" },
  { imgUrl: "photos/concerts/ivabass.jpg", alt: "Concert" },
  { imgUrl: "photos/concerts/lukagitara.jpg", alt: "Concert" },
  { imgUrl: "photos/concerts/DSCF9136.jpg", alt: "Concert" },
  { imgUrl: "photos/concerts/DSCF9698.jpg", alt: "Concert" },
];

const LANDSCAPE_CARDS = [
  { imgUrl: "photos/landscapes/blurryasfuck.jpg", alt: "Landscape" },
  { imgUrl: "photos/landscapes/IMG_88967.jpg", alt: "Landscape" },
  { imgUrl: "photos/landscapes/IMG_8896.jpg", alt: "Landscape" },
  { imgUrl: "photos/landscapes/IMG_8635.jpg", alt: "Landscape" },
  { imgUrl: "photos/landscapes/IMG_88961.jpg", alt: "Landscape" },
  { imgUrl: "photos/landscapes/IMG_88968.jpg", alt: "Landscape" },
  { imgUrl: "photos/landscapes/IMG_8679.jpg", alt: "Landscape" },
];

const portraitsHeading = document.getElementById('react-heading-portraits')
if (portraitsHeading) {
  createRoot(portraitsHeading).render(
    <StrictMode>
      <HoverHeading text="Portraits" url="portraits.html" dataTranslate="portraits" />
    </StrictMode>
  )
}

const portraitsElement = document.getElementById('react-carousel-portraits')
if (portraitsElement) {
  createRoot(portraitsElement).render(
    <StrictMode>
      <SocialCards cards={PORTRAIT_CARDS} />
    </StrictMode>
  )
}

const concertsHeading = document.getElementById('react-heading-concerts')
if (concertsHeading) {
  createRoot(concertsHeading).render(
    <StrictMode>
      <HoverHeading text="Concerts" url="concerts.html" dataTranslate="concerts" />
    </StrictMode>
  )
}

const concertsElement = document.getElementById('react-carousel-concerts')
if (concertsElement) {
  createRoot(concertsElement).render(
    <StrictMode>
      <SocialCards cards={CONCERT_CARDS} />
    </StrictMode>
  )
}

const landscapesHeading = document.getElementById('react-heading-landscapes')
if (landscapesHeading) {
  createRoot(landscapesHeading).render(
    <StrictMode>
      <HoverHeading text="Landscapes" url="landscapes.html" dataTranslate="landscapes" />
    </StrictMode>
  )
}

const landscapesElement = document.getElementById('react-carousel-landscapes')
if (landscapesElement) {
  createRoot(landscapesElement).render(
    <StrictMode>
      <SocialCards cards={LANDSCAPE_CARDS} />
    </StrictMode>
  )
}

const videosHeading = document.getElementById('react-heading-videos')
if (videosHeading) {
  createRoot(videosHeading).render(
    <StrictMode>
      <HoverHeading text="Videos" url="videos.html" dataTranslate="videos" />
    </StrictMode>
  )
}

const videosHeadingOutline = document.getElementById('react-heading-videos-outline')
if (videosHeadingOutline) {
  createRoot(videosHeadingOutline).render(
    <StrictMode>
      <HoverHeading text="Videos" url="videos.html" dataTranslate="videos" outline={true} />
    </StrictMode>
  )
}

const bookingHeading = document.getElementById('react-heading-booking')
if (bookingHeading) {
  createRoot(bookingHeading).render(
    <StrictMode>
      <HoverHeading text="Booking" dataTranslate="bookingTitle" />
    </StrictMode>,
  )
}

// --- Parallax Scroll Gallery ---
const parallaxGalleryElement = document.getElementById('react-parallax-gallery')
if (parallaxGalleryElement) {
  createRoot(parallaxGalleryElement).render(
    <StrictMode>
      <ParallaxScroll />
    </StrictMode>,
  )
}

// --- Web Development Page Components ---
const laptopHeroElement = document.getElementById('react-laptop-hero')
if (laptopHeroElement) {
  createRoot(laptopHeroElement).render(
    <StrictMode>
      <ParallaxLaptopBuilder />
    </StrictMode>,
  )
}

const estimatorElement = document.getElementById('react-webdev-estimator')
if (estimatorElement) {
  createRoot(estimatorElement).render(
    <StrictMode>
      <WebdevEstimator />
    </StrictMode>,
  )
}

