'use client';

import { useState } from 'react';

export default function LabInterface({ fragrances }: { fragrances: any[] }) {
  const [baseLayer, setBaseLayer] = useState<any>(null);
  const [topLayer, setTopLayer] = useState<any>(null);
  
  const [activeSlot, setActiveSlot] = useState<'base' | 'top' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // New states for the AI Analysis
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    score: number;
    verdict: string;
    description: string;
  } | null>(null);

  const filteredFrags = fragrances.filter(f => 
    f.Name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.Brand?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (frag: any) => {
    if (activeSlot === 'base') setBaseLayer(frag);
    if (activeSlot === 'top') setTopLayer(frag);
    setActiveSlot(null); 
    setSearchQuery('');  
    setAnalysisResult(null); // Reset results if they change a bottle
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/lab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baseLayer, topLayer })
      });

      if (!response.ok) throw new Error('Analysis failed');

      const data = await response.json();
      setAnalysisResult(data);
      
      // Smooth scroll down to the result
      setTimeout(() => {
        document.getElementById('lab-result')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);

    } catch (error) {
      console.error(error);
      alert("The Lab equipment malfunctioned. Try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section className="relative px-8 pt-20 pb-32 flex flex-col items-center min-h-[calc(100vh-80px)] overflow-hidden custom-scrollbar">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-amber-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="text-center z-10 mb-16">
        <h1 className="text-5xl md:text-6xl font-serif mb-4 text-white drop-shadow-lg">
          The <span className="italic text-amber-400/90">Layers</span> Lab
        </h1>
        <p className="text-neutral-400 max-w-xl mx-auto text-lg font-light">
          Master the art of olfactory chemistry. Select two fragrances to see how their notes harmonize or clash.
        </p>
      </div>

      {/* DUAL SELECTOR UI (Same as before) */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 w-full max-w-4xl z-10">
        
        {/* Slot A: Base Layer */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <span className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-4 font-semibold">Base Layer</span>
          <button 
            onClick={() => setActiveSlot('base')}
            className={`w-full h-80 rounded-3xl border flex flex-col items-center justify-center p-6 transition-all duration-500 group relative overflow-hidden ${
              baseLayer ? 'bg-white/[0.02] border-white/20 hover:border-amber-500/50 shadow-2xl' : 'bg-black/40 border-dashed border-white/20 hover:border-white/50 hover:bg-white/[0.02]'
            }`}
          >
            {baseLayer ? (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                {baseLayer['Image URL'] && (
                  <img src={baseLayer['Image URL']} alt={baseLayer.Name} className="absolute inset-0 w-full h-full object-contain mix-blend-screen opacity-50 group-hover:opacity-80 transition-opacity duration-700 p-8 z-0" />
                )}
                <div className="relative z-20 text-center mt-auto pb-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-1">{baseLayer.Brand}</p>
                  <h3 className="text-2xl font-serif text-white">{baseLayer.Name}</h3>
                  <p className="text-xs text-amber-500/80 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">Change Base →</p>
                </div>
              </>
            ) : (
              <div className="text-neutral-600 group-hover:text-amber-500/80 transition-colors flex flex-col items-center">
                <span className="text-6xl font-light mb-4">+</span>
                <span className="text-sm font-medium tracking-wider uppercase">Select Fragrance</span>
              </div>
            )}
          </button>
        </div>

        <div className="flex-shrink-0 text-3xl text-neutral-600 font-light z-10">+</div>

        {/* Slot B: Top Layer */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <span className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-4 font-semibold">Top Layer</span>
          <button 
            onClick={() => setActiveSlot('top')}
            className={`w-full h-80 rounded-3xl border flex flex-col items-center justify-center p-6 transition-all duration-500 group relative overflow-hidden ${
              topLayer ? 'bg-white/[0.02] border-white/20 hover:border-amber-500/50 shadow-2xl' : 'bg-black/40 border-dashed border-white/20 hover:border-white/50 hover:bg-white/[0.02]'
            }`}
          >
            {topLayer ? (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                {topLayer['Image URL'] && (
                  <img src={topLayer['Image URL']} alt={topLayer.Name} className="absolute inset-0 w-full h-full object-contain mix-blend-screen opacity-50 group-hover:opacity-80 transition-opacity duration-700 p-8 z-0" />
                )}
                <div className="relative z-20 text-center mt-auto pb-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-1">{topLayer.Brand}</p>
                  <h3 className="text-2xl font-serif text-white">{topLayer.Name}</h3>
                  <p className="text-xs text-amber-500/80 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">Change Top →</p>
                </div>
              </>
            ) : (
              <div className="text-neutral-600 group-hover:text-amber-500/80 transition-colors flex flex-col items-center">
                <span className="text-6xl font-light mb-4">+</span>
                <span className="text-sm font-medium tracking-wider uppercase">Select Fragrance</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-16 z-10">
        <button 
          onClick={handleAnalyze}
          disabled={!baseLayer || !topLayer || isAnalyzing}
          className="bg-amber-500 hover:bg-amber-400 text-black px-12 py-4 rounded-full text-sm font-bold tracking-widest transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[200px]"
        >
          {isAnalyzing ? <span className="animate-pulse">ANALYZING CHEMISTRY...</span> : "ANALYZE BLEND"}
        </button>
      </div>

      {/* THE AI RESULTS CARD */}
      {analysisResult && (
        <div id="lab-result" className="mt-16 w-full max-w-3xl bg-white/[0.03] border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 z-10 relative overflow-hidden">
          
          {/* Decorative glow based on score */}
          <div className={`absolute -top-24 -right-24 w-64 h-64 blur-[80px] rounded-full opacity-20 pointer-events-none ${
            analysisResult.score > 75 ? 'bg-green-500' : analysisResult.score > 40 ? 'bg-amber-500' : 'bg-red-500'
          }`} />

          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            {/* The Score Dial */}
            <div className="flex-shrink-0 flex flex-col items-center justify-center w-32 h-32 rounded-full border-4 border-white/10 relative">
              <span className="text-4xl font-serif text-white">{analysisResult.score}</span>
              <span className="text-[10px] uppercase tracking-widest text-neutral-500 mt-1">/ 100</span>
              {/* Dynamic ring color */}
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="4" 
                  className={`${analysisResult.score > 75 ? 'text-green-500/80' : analysisResult.score > 40 ? 'text-amber-500/80' : 'text-red-500/80'}`}
                  strokeDasharray={`${(analysisResult.score / 100) * 301.59} 301.59`}
                />
              </svg>
            </div>

            {/* The Analysis Text */}
            <div className="text-center md:text-left flex-grow">
              <h3 className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-2">Chemist's Verdict</h3>
              <h2 className={`text-3xl font-serif mb-4 drop-shadow-md ${
                analysisResult.score > 75 ? 'text-green-400' : analysisResult.score > 40 ? 'text-amber-400' : 'text-red-400'
              }`}>
                {analysisResult.verdict}
              </h2>
              <p className="text-neutral-300 leading-relaxed font-light">
                {analysisResult.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SELECTION MODAL (Same as before) */}
      {activeSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden flex flex-col max-h-[80vh] shadow-2xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-xl font-serif text-white">Select {activeSlot === 'base' ? 'Base' : 'Top'} Layer</h3>
              <button onClick={() => setActiveSlot(null)} className="text-neutral-500 hover:text-white text-2xl leading-none">&times;</button>
            </div>
            <div className="p-6 pb-2">
              <input type="text" placeholder="Search by brand or name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 transition-all" />
            </div>
            <div className="p-6 overflow-y-auto flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4 custom-scrollbar">
              {filteredFrags.map((frag, idx) => (
                <div key={`${frag.Name}-${idx}`} onClick={() => handleSelect(frag)} className="flex items-center gap-4 p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-amber-500/30 cursor-pointer transition-colors group">
                  {frag['Image URL'] ? (
                    <div className="w-12 h-12 rounded-lg bg-black overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                      <img src={frag['Image URL']} alt={frag.Name} className="object-contain w-full h-full mix-blend-screen opacity-80 group-hover:opacity-100" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-white/5 flex-shrink-0" />
                  )}
                  <div className="overflow-hidden">
                    <p className="text-[10px] uppercase tracking-wider text-neutral-500 truncate">{frag.Brand || 'Unknown'}</p>
                    <p className="text-sm font-serif text-white truncate group-hover:text-amber-400/90">{frag.Name || 'Unnamed'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}