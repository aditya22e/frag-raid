// app/components/JournalInterface.tsx
'use client';

import { useState, useEffect } from 'react';

type JournalEntry = {
  id: string;
  date: string;
  fragrance: any;
  rating: number;
  notes: string;
};

export default function JournalInterface({ fragrances }: { fragrances: any[] }) {
  const [mounted, setMounted] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // New Entry Draft State
  const [selectedFragrance, setSelectedFragrance] = useState<any>(null);
  const [rating, setRating] = useState<number>(0);
  const [notes, setNotes] = useState('');

  // 1. Load entries from LocalStorage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('fragraid_journal');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
    setMounted(true);
  }, []);

  // 2. Save to LocalStorage whenever entries change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('fragraid_journal', JSON.stringify(entries));
    }
  }, [entries, mounted]);

  const filteredFrags = fragrances.filter(f => 
    f.Name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.Brand?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveEntry = () => {
    if (!selectedFragrance) return;

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      fragrance: selectedFragrance,
      rating,
      notes
    };

    setEntries([newEntry, ...entries]); // Add to top of the list
    
    // Reset and close
    setSelectedFragrance(null);
    setRating(0);
    setNotes('');
    setIsModalOpen(false);
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <section className="relative px-8 pt-20 pb-32 flex flex-col items-center min-h-[calc(100vh-80px)] overflow-hidden">
      
      {/* Ambient Emerald Glow */}
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />

      {/* HEADER */}
      <div className="text-center z-10 mb-16">
        <h1 className="text-5xl md:text-6xl font-serif mb-4 text-white drop-shadow-lg">
          The <span className="italic text-emerald-400/90">Olfactory</span> Archive
        </h1>
        <p className="text-neutral-400 max-w-xl mx-auto text-lg font-light">
          Log your Scent of the Day. Track compliments, weather pairings, and memories.
        </p>
      </div>

      {/* LOG SOTD BUTTON */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="z-10 bg-white/[0.02] border border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-500/10 text-white px-10 py-5 rounded-full text-sm font-bold tracking-widest transition-all shadow-[0_0_20px_rgba(16,185,129,0.1)] hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center gap-3"
      >
        <span className="text-xl font-light leading-none">+</span>
        LOG SCENT OF THE DAY
      </button>

      {/* THE TIMELINE (JOURNAL ENTRIES) */}
      <div className="w-full max-w-4xl mt-20 z-10">
        {entries.length === 0 ? (
          <div className="text-center py-24 border border-white/5 border-dashed rounded-3xl bg-white/[0.01]">
            <h3 className="text-xl font-serif text-white mb-2">Your archive is empty.</h3>
            <p className="text-neutral-500">Log your first fragrance to begin the timeline.</p>
          </div>
        ) : (
          <div className="relative border-l border-white/10 ml-4 md:ml-0 md:pl-8 space-y-12">
            {entries.map((entry) => {
              const entryDate = new Date(entry.date);
              
              return (
                <div key={entry.id} className="relative pl-8 md:pl-0">
                  
                  {/* Timeline Node */}
                  <div className="absolute left-[-5px] md:left-[-37px] top-6 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                  
                  {/* Date Label */}
                  <div className="mb-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500/80">
                      {entryDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  {/* Entry Card */}
                  <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl hover:border-emerald-500/20 transition-colors group relative overflow-hidden flex flex-col md:flex-row gap-6 items-start">
                    
                    {/* Delete Button */}
                    <button 
                      onClick={() => deleteEntry(entry.id)}
                      className="absolute top-4 right-4 text-neutral-600 hover:text-red-500 transition-colors text-lg opacity-0 group-hover:opacity-100"
                    >
                      &times;
                    </button>

                    {/* Bottle Thumbnail */}
                    <div className="w-24 h-24 rounded-2xl bg-white/5 flex-shrink-0 flex items-center justify-center p-2">
                      {entry.fragrance['Image URL'] ? (
                        <img src={entry.fragrance['Image URL']} alt={entry.fragrance.Name} className="object-contain w-full h-full mix-blend-screen opacity-90" />
                      ) : (
                        <div className="text-xs text-neutral-600 font-serif italic">No img</div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-grow">
                      <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1">{entry.fragrance.Brand}</p>
                      <h3 className="text-2xl font-serif text-white mb-3">{entry.fragrance.Name}</h3>
                      
                      {/* Rating Stars */}
                      <div className="flex gap-1 mb-4 text-emerald-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className={star <= entry.rating ? 'opacity-100' : 'opacity-20'}>✦</span>
                        ))}
                      </div>

                      {/* User Notes */}
                      {entry.notes && (
                        <p className="text-neutral-300 font-light text-sm italic border-l-2 border-emerald-500/30 pl-4 py-1">
                          "{entry.notes}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SOTD ENTRY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl">
            
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-emerald-500/5">
              <h3 className="text-xl font-serif text-white">Log Scent of the Day</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-500 hover:text-white text-2xl leading-none">&times;</button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
              
              {/* Step 1: Select Fragrance */}
              {!selectedFragrance ? (
                <>
                  <input 
                    type="text" 
                    placeholder="Search vault..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500/50 transition-all mb-4"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredFrags.map((frag, idx) => (
                      <div 
                        key={`${frag.Name}-${idx}`} 
                        onClick={() => setSelectedFragrance(frag)}
                        className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-emerald-500/30 cursor-pointer transition-colors"
                      >
                        {frag['Image URL'] ? (
                          <div className="w-10 h-10 rounded bg-black flex items-center justify-center p-1"><img src={frag['Image URL']} alt={frag.Name} className="object-contain w-full h-full mix-blend-screen opacity-80" /></div>
                        ) : <div className="w-10 h-10 rounded bg-white/5" />}
                        <div className="overflow-hidden">
                          <p className="text-[9px] uppercase tracking-wider text-neutral-500 truncate">{frag.Brand}</p>
                          <p className="text-xs font-serif text-white truncate">{frag.Name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                /* Step 2: Rate and Review */
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  
                  {/* Selected Frag Display */}
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 mb-8 relative">
                     <button onClick={() => setSelectedFragrance(null)} className="absolute top-2 right-3 text-[10px] text-neutral-500 hover:text-white uppercase tracking-widest">Change</button>
                     {selectedFragrance['Image URL'] && (
                        <img src={selectedFragrance['Image URL']} alt="" className="w-12 h-12 object-contain mix-blend-screen" />
                     )}
                     <div>
                       <p className="text-[10px] uppercase text-emerald-500/80 tracking-widest">{selectedFragrance.Brand}</p>
                       <h4 className="text-lg font-serif text-white">{selectedFragrance.Name}</h4>
                     </div>
                  </div>

                  {/* Rating */}
                  <div className="mb-8">
                    <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-3 font-semibold">Rating for today</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                          key={star}
                          onClick={() => setRating(star)}
                          className={`text-3xl transition-all hover:scale-110 ${star <= rating ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'text-neutral-700'}`}
                        >
                          ✦
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="mb-8">
                    <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-3 font-semibold">Journal Entry</label>
                    <textarea 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="How did it perform? Any compliments? (e.g., 'Wore this on a rainy date night. Lasted 8 hours.')"
                      className="w-full h-32 bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500/50 transition-all resize-none"
                    />
                  </div>

                  {/* Save Button */}
                  <button 
                    onClick={handleSaveEntry}
                    disabled={rating === 0}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-black py-4 rounded-xl text-sm font-bold tracking-widest transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50"
                  >
                    ARCHIVE ENTRY
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </section>
  );
}