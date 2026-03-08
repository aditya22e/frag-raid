// app/components/FragranceDetail.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

// The color mapping for dynamic UI theming
const THEME_COLORS: Record<string, string> = {
  "Woody & Earthy": "#d97706",  // Amber
  "Fresh & Citrus": "#06b6d4",  // Cyan
  "Sweet & Gourmand": "#ec4899", // Pink
  "Spicy & Warm": "#ef4444",    // Red
  "Floral & Powdery": "#c026d3", // Fuchsia
  "Dark & Musky": "#6366f1",    // Indigo
  "Default": "#f59e0b"          // Fallback Amber
};

export default function FragranceDetail({ fragrance }: { fragrance: any }) {
  const [chartData, setChartData] = useState<any[] | null>(null);
  const [dominantTheme, setDominantTheme] = useState<string>("Default");
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  const notesArray = fragrance.Notes 
    ? fragrance.Notes.split(',').map((n: string) => n.trim()).filter(Boolean) 
    : [];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fragrance })
        });
        
        if (!response.ok) throw new Error('Analysis failed');
        
        const data = await response.json();
        setChartData(data);

        // Find the highest scoring aspect to set the page theme
        const dominant = data.reduce((max: any, current: any) => 
          (current.score > max.score) ? current : max
        );
        setDominantTheme(dominant.aspect);

      } catch (error) {
        console.error("Failed to map olfactory profile", error);
      } finally {
        setIsAnalyzing(false);
      }
    };

    fetchProfile();
  }, [fragrance]);

  const activeColor = THEME_COLORS[dominantTheme] || THEME_COLORS["Default"];

  return (
    <div className="max-w-7xl mx-auto px-8 py-16 md:py-24 transition-colors duration-1000 relative">
      
      {/* MASSIVE DYNAMIC BACKGROUND GLOW */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[800px] blur-[200px] rounded-full pointer-events-none transition-all duration-1000 opacity-20"
        style={{ backgroundColor: activeColor }}
      />

      <Link 
        href="/" 
        className="relative z-10 inline-flex items-center text-sm font-semibold tracking-widest text-neutral-500 hover:text-white transition-colors mb-12 uppercase"
      >
        ← Return to Vault
      </Link>

      <div className="flex flex-col lg:flex-row gap-16 items-start relative z-10">
        
        {/* LEFT SIDE: Bottle & Hexagon Chart */}
        <div className="w-full lg:w-5/12 flex flex-col gap-8">
          
          {/* Bottle Showcase */}
          <div className="w-full aspect-[4/5] flex items-center justify-center bg-white/[0.02] border border-white/5 rounded-3xl p-12 relative group overflow-hidden shadow-2xl">
            <div 
              className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-700"
              style={{ background: `radial-gradient(circle at center, ${activeColor} 0%, transparent 70%)` }}
            />
            {fragrance['Image URL'] ? (
              <img 
                src={fragrance['Image URL']} 
                alt={fragrance.Name}
                className="w-full h-full object-contain mix-blend-screen opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 relative z-10"
              />
            ) : (
              <div className="text-neutral-700 font-serif italic text-xl">No visual archive</div>
            )}
          </div>

          {/* Hexagon Radar Chart */}
          <div className="w-full bg-black/40 border border-white/5 rounded-3xl p-8 backdrop-blur-md relative overflow-hidden">
            <h3 className="text-center text-xs uppercase tracking-widest text-neutral-400 mb-6 font-semibold z-10 relative">
              Olfactory Footprint
            </h3>
            
            {isAnalyzing ? (
              <div className="h-[250px] flex items-center justify-center">
                <span className="text-xs tracking-widest text-neutral-500 animate-pulse uppercase">Mapping Profile...</span>
              </div>
            ) : chartData ? (
              <div className="h-[250px] w-full -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData}>
                    <PolarGrid stroke="rgba(255,255,255,0.05)" />
                    <PolarAngleAxis dataKey="aspect" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      itemStyle={{ color: activeColor, fontSize: '14px', fontWeight: 600 }}
                    />
                    <Radar 
                      name={fragrance.Name} 
                      dataKey="score" 
                      stroke={activeColor} 
                      fill={activeColor} 
                      fillOpacity={0.4} 
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ) : null}
          </div>
        </div>

        {/* RIGHT SIDE: Typography & Details */}
        <div className="w-full lg:w-7/12 flex flex-col justify-center pt-8">
          
          <div className="mb-10">
            <h2 
              className="text-sm font-bold uppercase tracking-[0.2em] mb-3 transition-colors duration-1000"
              style={{ color: activeColor }}
            >
              {fragrance.Brand}
            </h2>
            <h1 className="text-5xl md:text-7xl font-serif text-white leading-tight drop-shadow-lg">
              {fragrance.Name}
            </h1>
            {!isAnalyzing && dominantTheme !== "Default" && (
              <p className="mt-4 text-sm tracking-widest uppercase text-neutral-500 font-medium">
                Dominant Profile: <span style={{ color: activeColor }}>{dominantTheme}</span>
              </p>
            )}
          </div>

          {notesArray.length > 0 && (
            <div className="mb-12 border-t border-white/10 pt-8">
              <h3 className="text-xs uppercase tracking-widest text-neutral-500 mb-6 font-semibold">
                Declared Notes
              </h3>
              <div className="flex flex-wrap gap-2">
                {notesArray.map((note: string, i: number) => (
                  <span 
                    key={i} 
                    className="text-sm px-5 py-2.5 border border-white/10 rounded-full text-neutral-300 bg-white/[0.02] backdrop-blur-sm transition-all duration-500 cursor-default"
                    style={{ 
                      // Subtle hover effect mapping to the dynamic color
                      ['--hover-border' as any]: activeColor 
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = activeColor}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>
          )}

          {fragrance.Description && (
            <div className="mb-12 border-t border-white/10 pt-8">
              <h3 className="text-xs uppercase tracking-widest text-neutral-500 mb-6 font-semibold">
                The Architecture
              </h3>
              <p className="text-neutral-300 text-lg leading-relaxed font-light text-justify">
                {fragrance.Description}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 border-t border-white/10 pt-8 mt-auto">
            <button 
              className="flex-1 text-black px-8 py-4 rounded-full text-sm font-bold tracking-widest transition-all shadow-lg hover:brightness-110"
              style={{ backgroundColor: activeColor }}
            >
              ACQUIRE DECANT
            </button>
            <button className="flex-1 border border-white/20 text-white px-8 py-4 rounded-full text-sm font-bold tracking-widest hover:bg-white/5 transition-colors">
              ADD TO LAB ROSTER
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}