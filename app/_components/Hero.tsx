// app/components/Hero.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import fragData from '@/data/frag_data.json';

const AXES = [
  { id: 'fresh', label: 'Fresh & Clean', angle: -90 },
  { id: 'sweet', label: 'Sweet & Cozy', angle: -30 },
  { id: 'spicy', label: 'Spicy & Bold', angle: 30 },
  { id: 'woody', label: 'Woody & Earthy', angle: 90 },
  { id: 'dark', label: 'Dark & Musky', angle: 150 },
  { id: 'floral', label: 'Floral & Elegant', angle: 210 }
];

// Map our 6 axes to the dynamic hex colors
const THEME_COLORS: Record<string, string> = {
  fresh: "#06b6d4",  // Cyan
  sweet: "#ec4899",  // Pink
  spicy: "#ef4444",  // Red
  woody: "#d97706",  // Amber
  dark: "#6366f1",   // Indigo
  floral: "#c026d3", // Fuchsia
};

const getPoint = (angle: number, value: number, maxRadius = 130) => {
  const rad = (Math.PI / 180) * angle;
  const r = (value / 100) * maxRadius;
  return { x: 200 + r * Math.cos(rad), y: 200 + r * Math.sin(rad) };
};

export default function Hero() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [context, setContext] = useState({ timeOfDay: '', season: '' });
  const [suggestions, setSuggestions] = useState<any[]>([]);
  
  const [vibeScores, setVibeScores] = useState<Record<string, number>>({
    fresh: 20, sweet: 20, spicy: 20, woody: 20, dark: 20, floral: 20
  });
  
  const [customInput, setCustomInput] = useState('');
  const [isRaiding, setIsRaiding] = useState(false);

  useEffect(() => {
    const date = new Date();
    const hour = date.getHours();
    const month = date.getMonth(); 

    let timeOfDay = 'Night';
    if (hour >= 5 && hour < 12) timeOfDay = 'Morning';
    else if (hour >= 12 && hour < 17) timeOfDay = 'Afternoon';
    else if (hour >= 17 && hour < 21) timeOfDay = 'Evening';

    let season = 'Winter';
    if (month >= 2 && month <= 4) season = 'Spring';
    else if (month >= 5 && month <= 7) season = 'Summer';
    else if (month >= 8 && month <= 10) season = 'Autumn';

    setContext({ timeOfDay, season });

    if (fragData && fragData.length > 0) {
      const shuffled = [...fragData].sort(() => 0.5 - Math.random());
      setSuggestions(shuffled.slice(0, 3));
    }
    setMounted(true);
  }, []);

  const handleScoreChange = (axisId: string, value: number) => {
    setVibeScores(prev => ({ ...prev, [axisId]: value }));
  };

  const handleRaid = async () => {
    setIsRaiding(true); 
    
    const profile = AXES.map(a => `${a.label}: ${vibeScores[a.id]}/100`).join(', ');
    const finalPrompt = `Vibe Profile: ${profile}. Additional context: ${customInput}`.trim();
    
    try {
      const response = await fetch('/api/vibe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: finalPrompt })
      });

      if (!response.ok) throw new Error('Failed to fetch from Gemini');

      const data = await response.json();
      const notes = data.notes; 

      if (notes && notes.length > 0) {
        const query = new URLSearchParams({ notes: notes.join(',') }).toString();
        router.push(`/?${query}`, { scroll: false });
        
        setTimeout(() => {
          const vaultSection = document.getElementById('vault');
          if (vaultSection) {
            vaultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    } catch (error) {
      console.error("Raid Failed:", error);
      alert("The Raid failed. Check your API key or connection.");
    } finally {
      setIsRaiding(false); 
    }
  };

  // 1. Calculate the active color dynamically based on user clicks
  const activeColor = useMemo(() => {
    // Check if the polygon is still in its default un-clicked state
    const isDefault = Object.values(vibeScores).every(score => score === 20);
    if (isDefault) return THEME_COLORS.woody; // Default to Amber

    // Find the highest scoring axis
    const dominantAxis = Object.entries(vibeScores).reduce((max, current) => 
      current[1] > max[1] ? current : max
    )[0];
    
    return THEME_COLORS[dominantAxis];
  }, [vibeScores]);

  const polygonPoints = AXES.map(axis => {
    const pt = getPoint(axis.angle, vibeScores[axis.id]);
    return `${pt.x},${pt.y}`;
  }).join(' ');

  return (
    <section className="relative px-8 pt-24 pb-32 flex flex-col items-center justify-center text-center overflow-hidden min-h-screen transition-colors duration-1000">
      
      {/* MASSIVE DYNAMIC BACKGROUND GLOW */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] blur-[150px] rounded-full pointer-events-none transition-all duration-1000 opacity-20" 
        style={{ backgroundColor: activeColor }}
      />
      
      <div className="z-10 mb-8">
        <h1 className="text-5xl md:text-7xl font-serif mb-4 text-white drop-shadow-lg transition-colors duration-1000">
          Shape your <span className="italic" style={{ color: activeColor }}>vibe.</span>
        </h1>
        <p className="text-neutral-400 text-lg font-light">
          Click the web to construct your olfactory footprint.
        </p>
      </div>

      <div className="w-full max-w-3xl bg-white/[0.02] border border-white/10 rounded-3xl p-8 backdrop-blur-xl z-10 shadow-2xl relative flex flex-col items-center">
        
        <div className="relative w-full max-w-[400px] aspect-square mb-8">
          <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-2xl overflow-visible">
            
            {[33, 66, 100].map(level => (
              <polygon
                key={level}
                points={AXES.map(a => { const pt = getPoint(a.angle, level); return `${pt.x},${pt.y}`; }).join(' ')}
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />
            ))}

            {AXES.map(axis => {
              const endPt = getPoint(axis.angle, 100);
              return (
                <line key={axis.id} x1="200" y1="200" x2={endPt.x} y2={endPt.y} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              );
            })}

            {/* THE DYNAMIC POLYGON */}
            <polygon 
              points={polygonPoints} 
              fill={activeColor} 
              fillOpacity="0.25"
              stroke={activeColor} 
              strokeWidth="2"
              className="transition-all duration-500 ease-out"
            />

            {AXES.map(axis => 
              [25, 50, 75, 100].map(level => {
                const pt = getPoint(axis.angle, level);
                const isActive = vibeScores[axis.id] === level;
                return (
                  <g 
                    key={`${axis.id}-${level}`} 
                    className="cursor-pointer group"
                    onClick={() => handleScoreChange(axis.id, level)}
                  >
                    <circle cx={pt.x} cy={pt.y} r="15" fill="transparent" />
                    
                    {/* DYNAMIC ACTIVE DOTS */}
                    <circle 
                      cx={pt.x} cy={pt.y} r={isActive ? "4" : "2"} 
                      fill={isActive ? activeColor : "rgba(255,255,255,0.3)"} 
                      className="pointer-events-none transition-all duration-300"
                      style={isActive ? { filter: `drop-shadow(0 0 10px ${activeColor})` } : {}}
                    />
                  </g>
                );
              })
            )}

            {AXES.map(axis => {
              const labelPt = getPoint(axis.angle, 125);
              return (
                <text 
                  key={`label-${axis.id}`}
                  x={labelPt.x} 
                  y={labelPt.y} 
                  fill="rgba(255,255,255,0.6)" 
                  fontSize="10" 
                  fontWeight="600"
                  textAnchor="middle" 
                  dominantBaseline="middle"
                  className="uppercase tracking-widest pointer-events-none transition-colors duration-1000"
                >
                  {axis.label}
                </text>
              );
            })}
          </svg>
        </div>

        <div className="w-full mb-6 border-t border-white/5 pt-6">
          <input 
            type="text" 
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Add specific context (e.g., A rainy jazz club...)" 
            className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-sm text-white placeholder-neutral-600 focus:outline-none transition-all text-center focus:border-opacity-50"
            style={{ outlineColor: activeColor }}
          />
        </div>

        {/* DYNAMIC RAID BUTTON */}
        <button 
          onClick={handleRaid}
          disabled={isRaiding}
          className="text-black px-12 py-4 rounded-full text-sm font-bold tracking-widest transition-all disabled:opacity-50 flex items-center justify-center w-full md:w-auto hover:brightness-110"
          style={{ 
            backgroundColor: activeColor,
            boxShadow: `0 0 25px ${activeColor}66` // The '66' adds 40% transparency to the hex code
          }}
        >
          {isRaiding ? <span className="animate-pulse">RAIDING...</span> : "INITIATE RAID"}
        </button>
      </div>

      <div className={`mt-12 w-full max-w-3xl transition-all duration-1000 transform z-10 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {mounted && suggestions.length > 0 && (
          <div className="flex flex-col items-center">
            
            {/* DYNAMIC RECOMMENDATION TEXT */}
            <div className="flex items-center gap-4 mb-6 transition-colors duration-1000">
              <div className="h-[1px] w-12" style={{ backgroundColor: `${activeColor}4D` }}></div>
              <span className="text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: activeColor }}>
                {context.season} {context.timeOfDay} Signatures
              </span>
              <div className="h-[1px] w-12" style={{ backgroundColor: `${activeColor}4D` }}></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              {suggestions.map((sug, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-white/[0.02] border border-white/10 p-3 rounded-xl hover:bg-white/[0.06] transition-all duration-300 cursor-pointer group text-left"
                     onMouseEnter={(e) => e.currentTarget.style.borderColor = `${activeColor}4D`}
                     onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                >
                  {sug['Image URL'] ? (
                    <div className="w-12 h-12 rounded-lg bg-white/5 overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                      <img src={sug['Image URL']} alt={sug.Name} className="object-contain w-full h-full mix-blend-screen opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-110 duration-500" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-white/5 flex-shrink-0" /> 
                  )}
                  <div className="overflow-hidden">
                    <p className="text-[10px] uppercase tracking-wider text-neutral-500 truncate mb-0.5">{sug.Brand || 'Unknown'}</p>
                    <p className="text-sm font-serif text-white truncate transition-colors" style={{ '--hover-color': activeColor } as any}
                       onMouseEnter={(e) => e.currentTarget.style.color = activeColor}
                       onMouseLeave={(e) => e.currentTarget.style.color = '#fff'}
                    >
                      {sug.Name || 'Unnamed'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}