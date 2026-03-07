// app/components/ClashInterface.tsx
'use client';

import { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Distinct neon colors for up to 4 overlapping fragrances
const CLASH_COLORS = ['#f59e0b', '#06b6d4', '#ec4899', '#10b981']; 

export default function ClashInterface({ fragrances }: { fragrances: any[] }) {
  const [selectedFrags, setSelectedFrags] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [chartData, setChartData] = useState<any[] | null>(null);

  const filteredFrags = fragrances.filter(f => 
    f.Name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.Brand?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = (frag: any) => {
    if (selectedFrags.length < 4 && !selectedFrags.find(f => f.Name === frag.Name)) {
      setSelectedFrags([...selectedFrags, frag]);
    }
    setIsModalOpen(false);
    setSearchQuery('');
    setChartData(null); // Reset chart if roster changes
  };

  const handleRemove = (nameToRemove: string) => {
    setSelectedFrags(selectedFrags.filter(f => f.Name !== nameToRemove));
    setChartData(null);
  };

  const handleClash = async () => {
    setIsAnalyzing(true);
    setChartData(null);

    try {
      const response = await fetch('/api/clash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fragrances: selectedFrags })
      });

      if (!response.ok) throw new Error('Clash failed');

      const data = await response.json();
      setChartData(data);
      
      setTimeout(() => {
        document.getElementById('clash-arena')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);

    } catch (error) {
      console.error(error);
      alert("The Clash engine misfired. Try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section className="relative px-8 pt-20 pb-32 flex flex-col items-center min-h-[calc(100vh-80px)] overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-cyan-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="text-center z-10 mb-12">
        <h1 className="text-5xl md:text-6xl font-serif mb-4 text-white drop-shadow-lg">
          Frag <span className="italic text-cyan-400/90">Clash</span>
        </h1>
        <p className="text-neutral-400 max-w-xl mx-auto text-lg font-light">
          Build your roster. Map their olfactory footprints. See who dominates the hexagon.
        </p>
      </div>

      {/* THE ROSTER (Up to 4 slots) */}
      <div className="w-full max-w-5xl z-10 mb-12 flex flex-wrap justify-center gap-6">
        {selectedFrags.map((frag, idx) => (
          <div key={idx} className="relative w-48 h-64 bg-white/[0.02] border border-white/20 rounded-2xl flex flex-col items-center p-4 group shadow-xl">
            {/* Color indicator line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 rounded-b-full" style={{ backgroundColor: CLASH_COLORS[idx] }} />
            
            <button onClick={() => handleRemove(frag.Name)} className="absolute top-2 right-2 w-6 h-6 bg-black/50 hover:bg-red-500/80 rounded-full text-xs text-white flex items-center justify-center transition-colors">✕</button>
            
            <div className="h-32 w-full mb-4 flex items-center justify-center">
              {frag['Image URL'] ? (
                <img src={frag['Image URL']} alt={frag.Name} className="object-contain h-full w-full mix-blend-screen opacity-80" />
              ) : (
                <div className="w-16 h-16 bg-white/5 rounded-full" />
              )}
            </div>
            <p className="text-[10px] uppercase tracking-widest text-neutral-500 truncate w-full text-center">{frag.Brand}</p>
            <h3 className="text-sm font-serif text-white text-center leading-tight mt-1 line-clamp-2" style={{ color: CLASH_COLORS[idx] }}>{frag.Name}</h3>
          </div>
        ))}

        {/* Add Button Slot */}
        {selectedFrags.length < 4 && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-48 h-64 bg-black/40 border border-dashed border-white/20 hover:border-cyan-500/50 hover:bg-white/[0.02] rounded-2xl flex flex-col items-center justify-center text-neutral-600 hover:text-cyan-400 transition-all group"
          >
            <span className="text-4xl font-light mb-2">+</span>
            <span className="text-xs font-medium tracking-wider uppercase">Add Contender</span>
            <span className="text-[10px] text-neutral-600 mt-2">{selectedFrags.length}/4 Selected</span>
          </button>
        )}
      </div>

      <button 
        onClick={handleClash}
        disabled={selectedFrags.length < 2 || isAnalyzing}
        className="bg-cyan-600 hover:bg-cyan-500 text-white px-12 py-4 rounded-full text-sm font-bold tracking-widest transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] disabled:opacity-50 disabled:cursor-not-allowed z-10"
      >
        {isAnalyzing ? "MAPPING PROFILES..." : "INITIATE CLASH"}
      </button>

      {/* THE RADAR CHART ARENA */}
      {chartData && (
        <div id="clash-arena" className="mt-16 w-full max-w-4xl bg-white/[0.02] border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl animate-in fade-in duration-700 z-10">
          <h3 className="text-center text-xl font-serif text-white mb-8 tracking-wide">Olfactory Footprint</h3>
          
          <div className="w-full h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="aspect" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '14px', fontWeight: 600 }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                
                {/* Dynamically render a Radar for each selected fragrance */}
                {selectedFrags.map((frag, idx) => (
                  <Radar 
                    key={frag.Name}
                    name={frag.Name} 
                    dataKey={frag.Name} 
                    stroke={CLASH_COLORS[idx]} 
                    fill={CLASH_COLORS[idx]} 
                    fillOpacity={0.3} 
                    strokeWidth={2}
                  />
                ))}
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* SELECTION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden flex flex-col max-h-[80vh] shadow-2xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-xl font-serif text-white">Select Contender</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-500 hover:text-white text-2xl leading-none">&times;</button>
            </div>
            <div className="p-6 pb-2">
              <input type="text" placeholder="Search by brand or name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-cyan-500/50 transition-all" />
            </div>
            <div className="p-6 overflow-y-auto flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4 custom-scrollbar">
              {filteredFrags.map((frag, idx) => {
                const isAlreadySelected = selectedFrags.some(f => f.Name === frag.Name);
                return (
                  <div key={`${frag.Name}-${idx}`} onClick={() => !isAlreadySelected && handleAdd(frag)} className={`flex items-center gap-4 p-3 rounded-xl border transition-colors ${isAlreadySelected ? 'border-white/5 bg-white/5 opacity-50 cursor-not-allowed' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-cyan-500/30 cursor-pointer group'}`}>
                    {frag['Image URL'] ? (
                      <div className="w-12 h-12 rounded-lg bg-black flex-shrink-0 flex items-center justify-center p-1"><img src={frag['Image URL']} alt={frag.Name} className="object-contain w-full h-full mix-blend-screen opacity-80" /></div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-white/5 flex-shrink-0" />
                    )}
                    <div className="overflow-hidden">
                      <p className="text-[10px] uppercase tracking-wider text-neutral-500 truncate">{frag.Brand || 'Unknown'}</p>
                      <p className="text-sm font-serif text-white truncate">{frag.Name || 'Unnamed'}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}