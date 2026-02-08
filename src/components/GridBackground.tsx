const GridBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      
      {/* Subtle vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, hsl(0 0% 0% / 0.5) 100%)',
        }}
      />
      
      {/* Scanline effect */}
      <div className="scanlines" />
    </div>
  );
};

export default GridBackground;
