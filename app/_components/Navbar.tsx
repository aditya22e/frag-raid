export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-6 border-b border-white/5 backdrop-blur-md sticky top-0 z-50">
      <div className="text-2xl font-serif tracking-widest text-white">
        FRAG<span className="text-amber-500/80">-</span>RAID
      </div>
      <div className="hidden md:flex gap-8 text-sm tracking-wide text-neutral-400">
        <button className="hover:text-white transition-colors">Vibe Engine</button>
        <button className="hover:text-white transition-colors">Layers Lab</button>
        <button className="hover:text-white transition-colors">Frag Clash</button>
        <button className="hover:text-white transition-colors">Journal</button>
      </div>
    </nav>
  );
}