// app/components/Hero.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // <-- Import useRouter
import fragData from '@/data/frag_data.json';

const VIBE_STEPS = [
  { id: 'Mood', title: 'Define the Mood', subtitle: 'How do you want to feel?', tags: ["Mysterious", "Fresh", "Cozy", "Seductive", "Clean", "Bold"] },
  { id: 'Setting', title: 'Set the Scene', subtitle: 'Where are you wearing this?', tags: ["Date Night", "Office", "Vacation", "Night Out", "Formal", "Casual"] },
  { id: 'Environment', title: 'The Environment', subtitle: 'What surrounds you?', tags: ["Rainy", "Sunny", "Crisp", "Midnight", "Golden Hour"] },
  { id: 'Custom', title: 'Final Touches', subtitle: 'Any specific memories, outfits, or details?', tags: [] }
];

export default function Hero() {
  const router = useRouter(); // <-- Initialize router
  const [mounted, setMounted] = useState(false);
  const [context, setContext] = useState({ timeOfDay: '', season: '' });
  const [suggestions, setSuggestions] = useState<any[]>([]);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState('');
  
  const [isRaiding, setIsRaiding] = useState(false); // <-- Add loading state

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

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const nextStep = () => {
    if (currentStep < VIBE_STEPS.length - 1) setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const jumpToCustom = () => {
    setCurrentStep(3);
  };

  // THE MAGIC HAPPENS HERE
  const handleRaid = async () => {
    setIsRaiding(true); // Start loading animation
    
    const finalPrompt = `Tags: ${selectedTags.join(', ')}. Additional context: ${customInput}`.trim();
    
    try {
      const response = await fetch('/api/vibe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: finalPrompt })
      });

      if (!response.ok) throw new Error('Failed to fetch from Gemini');

      const data = await response.json();
      const notes = data.notes; // e.g., ["Leather", "Vanilla", "Tobacco"]
      
      console.log("Gemini returned these notes:", notes);

      // Push the notes to the URL so the ProductGrid can read them
      if (notes && notes.length > 0) {
        const query = new URLSearchParams({ notes: notes.join(',') }).toString();
        
        // Scroll to the vault section smoothly while updating the URL
        router.push(`/?${query}#vault`, { scroll: false });
        
        // Optional: you can manually trigger a scroll to the vault if needed
        document.getElementById('vault')?.scrollIntoView({ behavior: 'smooth' });
      }

    } catch (error) {
      console.error("Raid Failed:", error);
      alert("The Raid failed. Check your API key or connection.");
    } finally {
      setIsRaiding(false); // Stop loading animation
    }
  };

  const activeStepData = VIBE_STEPS[currentStep];

  return (
    <section className="relative px-8 pt-24 pb-32 flex flex-col items-center justify-center text-center overflow-hidden min-h-screen">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-amber-500/10 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="z-10 mb-12">
        <h1 className="text-5xl md:text-7xl font-serif mb-4 text-white drop-shadow-lg">
          Construct your <span className="italic text-amber-400/90">vibe.</span>
        </h1>
      </div>

      <div className="w-full max-w-2xl bg-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-10 backdrop-blur-xl z-10 shadow-2xl relative overflow-hidden transition-all duration-500 min-h-[380px] flex flex-col">
        
        <div className="flex gap-2 mb-8">
          {VIBE_STEPS.map((step, idx) => (
            <div 
              key={step.id} 
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                idx === currentStep ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 
                idx < currentStep ? 'bg-amber-500/40' : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        <div className="text-left mb-8">
          <h2 className="text-2xl font-serif text-white mb-1">{activeStepData.title}</h2>
          <p className="text-neutral-400 text-sm">{activeStepData.subtitle}</p>
        </div>

        <div className="flex-grow text-left">
          {currentStep < 3 ? (
            <div className="flex flex-wrap gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500" key={currentStep}>
              {activeStepData.tags.map(tag => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`text-sm md:text-base px-6 py-3 rounded-xl border transition-all duration-300 ${
                      isSelected 
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                        : 'bg-black/40 border-white/5 text-neutral-400 hover:border-white/20 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" key="custom-step">
              <textarea 
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="e.g., A rainy jazz club in Paris wearing a leather jacket..." 
                className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 transition-all resize-none h-32"
              />
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/5">
          <button 
            onClick={prevStep}
            className={`text-sm font-semibold tracking-wide transition-colors ${currentStep === 0 ? 'text-transparent cursor-default pointer-events-none' : 'text-neutral-400 hover:text-white'}`}
          >
            ← BACK
          </button>

          {currentStep < 3 ? (
            <button 
              onClick={nextStep}
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full text-sm font-bold tracking-widest transition-all"
            >
              NEXT
            </button>
          ) : (
            <button 
              onClick={handleRaid}
              disabled={isRaiding || (selectedTags.length === 0 && !customInput)}
              className="bg-amber-500 hover:bg-amber-400 text-black px-8 py-3 rounded-full text-sm font-bold tracking-widest transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[160px]"
            >
              {isRaiding ? (
                <span className="animate-pulse">RAIDING...</span>
              ) : (
                "INITIATE RAID"
              )}
            </button>
          )}
        </div>
      </div>

      {currentStep < 3 && (
        <button 
          onClick={jumpToCustom}
          className="mt-6 text-sm text-neutral-500 hover:text-amber-400 transition-colors z-10 group"
        >
          Know exactly what you want? <span className="underline underline-offset-4 decoration-white/20 group-hover:decoration-amber-400/50 transition-colors">Skip directly to text input</span> →
        </button>
      )}

      {/* Recommendations... (keeping this collapsed for brevity, keep your existing code here) */}
      <div className={`mt-12 w-full max-w-3xl transition-all duration-1000 transform z-10 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {mounted && suggestions.length > 0 && (
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] w-12 bg-amber-500/30"></div>
              <span className="text-xs uppercase tracking-[0.2em] text-amber-500/80 font-semibold">
                {context.season} {context.timeOfDay} Signatures
              </span>
              <div className="h-[1px] w-12 bg-amber-500/30"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              {suggestions.map((sug, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-white/[0.02] border border-white/10 p-3 rounded-xl hover:bg-white/[0.06] hover:border-amber-500/30 transition-all duration-300 cursor-pointer group text-left">
                  {sug['Image URL'] ? (
                    <div className="w-12 h-12 rounded-lg bg-white/5 overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                      <img src={sug['Image URL']} alt={sug.Name} className="object-contain w-full h-full mix-blend-screen opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-110 duration-500" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-white/5 flex-shrink-0" /> 
                  )}
                  <div className="overflow-hidden">
                    <p className="text-[10px] uppercase tracking-wider text-neutral-500 truncate mb-0.5">{sug.Brand || 'Unknown'}</p>
                    <p className="text-sm font-serif text-white truncate group-hover:text-amber-400/90 transition-colors">{sug.Name || 'Unnamed'}</p>
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