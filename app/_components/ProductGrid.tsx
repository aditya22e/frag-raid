// app/components/ProductGrid.tsx
export default function ProductGrid({ fragrances }: { fragrances: any[] }) {
  return (
    <section id="vault" className="px-8 pb-24 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl font-serif text-white">The Vault</h2>
        <span className="text-sm text-neutral-500 uppercase tracking-widest">Latest Drops</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {fragrances.map((frag, index) => {
          // 1. Convert the comma-separated string into an array, e.g., ["Vanilla bean", "musks"]
          // We also filter out any empty strings just in case
          const notesArray = frag.Notes 
            ? frag.Notes.split(',').map((n: string) => n.trim()).filter(Boolean) 
            : [];

          return (
            <div 
              // Using Name + index as a fallback key since your data doesn't have an "id" field
              key={`${frag.Name}-${index}`} 
              className="group relative flex flex-col bg-white/[0.02] border border-white/5 p-5 rounded-2xl hover:border-amber-500/30 hover:bg-white/[0.04] transition-all duration-500 cursor-pointer overflow-hidden"
            >
              {/* Product Image */}
              {frag['Image URL'] && (
                <div className="w-full h-48 mb-6 overflow-hidden rounded-xl bg-white/5 flex items-center justify-center p-2 relative">
                  {/* Subtle glow behind the image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
                  <img 
                    src={frag['Image URL']} 
                    alt={frag.Name}
                    // mix-blend-screen helps white image backgrounds disappear into the dark UI
                    className="object-contain h-full w-full opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 mix-blend-screen z-0"
                  />
                </div>
              )}

              {/* Brand & Name */}
              <div className="mb-4 flex-grow">
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-1">
                  {frag.Brand || "Unknown Brand"}
                </p>
                <h3 className="text-lg font-serif text-white group-hover:text-amber-400/90 transition-colors line-clamp-2">
                  {frag.Name || "Unnamed Scent"}
                </h3>
              </div>

              {/* Notes Breakdown */}
              {notesArray.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-auto pt-4 border-t border-white/5">
                  <span className="text-[10px] uppercase text-neutral-600 mr-1 self-center">Notes</span>
                  {/* Slice to 3 so the card doesn't get too tall, show the rest as a +number */}
                  {notesArray.slice(0, 3).map((note: string, i: number) => (
                    <span key={`${note}-${i}`} className="text-[10px] px-2 py-1 border border-white/10 rounded-full text-neutral-300 bg-black/50 truncate max-w-[100px]">
                      {note}
                    </span>
                  ))}
                  {notesArray.length > 3 && (
                    <span className="text-[10px] text-neutral-500 self-center">
                      +{notesArray.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}