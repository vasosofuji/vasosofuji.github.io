import React from 'react';

export const BlobBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 -z-10 w-full h-full overflow-hidden bg-black">
      <style>{`
        @keyframes lightLeak1 {
          0% { transform: translate(-40px, -60px) rotate(0deg); }
          50% { transform: translate(160px, 120px) rotate(180deg); }
          100% { transform: translate(-40px, -60px) rotate(360deg); }
        }
        @keyframes lightLeak2 {
          0% { transform: translate(60px, 80px) rotate(0deg); }
          50% { transform: translate(-180px, -120px) rotate(-180deg); }
          100% { transform: translate(60px, 80px) rotate(-360deg); }
        }
      `}</style>
      
      {/* Blob 1 (Top Left / Upper Middle - Irregular Rotating Light Leak 1) */}
      <div 
        className="absolute pointer-events-none"
        style={{
          backgroundColor: '#ff6b00',
          borderRadius: '43% 57% 50% 50% / 40% 60% 40% 60%', /* Irregular shape to morph on rotation */
          width: 'clamp(280px, 45vw, 600px)',
          height: 'clamp(280px, 45vw, 600px)',
          maxWidth: '600px',
          maxHeight: '600px',
          top: '-10%',
          left: '-5%',
          filter: 'blur(clamp(50px, 8.5vw, 120px))',
          opacity: 0.34, /* Static opacity to prevent repaints */
          animation: 'lightLeak1 22s infinite linear', /* Linear rotation is smoother on GPU */
          willChange: 'transform', /* Promote to compositor layer */
        }}
      />
      
      {/* Blob 2 (Bottom Right / Lower Middle - Irregular Rotating Light Leak 2) */}
      <div 
        className="absolute pointer-events-none"
        style={{
          backgroundColor: '#ff8533',
          borderRadius: '50% 50% 45% 55% / 60% 40% 60% 40%', /* Irregular shape to morph on rotation */
          width: 'clamp(320px, 50vw, 700px)',
          height: 'clamp(320px, 50vw, 700px)',
          maxWidth: '700px',
          maxHeight: '700px',
          bottom: '-15%',
          right: '-5%',
          filter: 'blur(clamp(60px, 9.5vw, 140px))',
          opacity: 0.28, /* Static opacity to prevent repaints */
          animation: 'lightLeak2 28s infinite linear', /* Linear rotation is smoother on GPU */
          willChange: 'transform', /* Promote to compositor layer */
        }}
      />
      
      {/* High-Performance SVG Grain Texture Overlay */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity: 0.14,
        }}
      />
    </div>
  );
};
