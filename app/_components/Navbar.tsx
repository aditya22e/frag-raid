// app/components/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close the mobile menu automatically when the route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const navItems = [
    { name: 'Vibe Engine', path: '/' },
    { name: 'Layers Lab', path: '/lab' },
    { name: 'Frag Clash', path: '/clash' },
    { name: 'Journal', path: '/journal' }
  ];

  // Dynamic thematic colors based on the route
  const getActiveTheme = (path: string) => {
    switch (path) {
      case '/': return 'bg-amber-500/70 shadow-[0_0_12px_rgba(245,158,11,0.6)]';
      case '/lab': return 'bg-cyan-500/70 shadow-[0_0_12px_rgba(6,182,212,0.6)]';
      case '/clash': return 'bg-cyan-500/70 shadow-[0_0_12px_rgba(6,182,212,0.6)]';
      case '/journal': return 'bg-emerald-500/70 shadow-[0_0_12px_rgba(16,185,129,0.6)]';
      default: return 'bg-white/50 shadow-[0_0_12px_rgba(255,255,255,0.5)]';
    }
  };

  return (
    <>
      <nav className="flex items-center justify-between px-6 md:px-8 py-6 border-b border-white/5 backdrop-blur-md sticky top-0 z-50 bg-[#0a0a0a]/80">
        
        {/* Logo / Home Link */}
        <Link 
          href="/" 
          className="text-2xl font-serif tracking-widest text-white hover:opacity-80 transition-opacity z-50 relative"
        >
          FRAG<span className="text-amber-500/80">-</span>RAID
        </Link>
        
        {/* DESKTOP NAVIGATION */}
        <div className="hidden md:flex gap-8 text-sm tracking-wide">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            
            return (
              <Link 
                key={item.name} 
                href={item.path}
                className={`transition-all duration-300 relative group ${
                  isActive ? 'text-white font-medium' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {item.name}
                
                {/* Dynamic active underline indicator */}
                {isActive && (
                  <span className={`absolute -bottom-2 left-0 w-full h-[1px] ${getActiveTheme(item.path)}`} />
                )}
                {/* Hover indicator for inactive links */}
                {!isActive && (
                  <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-white/20 transition-all duration-300 group-hover:w-full" />
                )}
              </Link>
            );
          })}
        </div>

        {/* MOBILE MENU TOGGLE (Custom Minimalist 2-line Icon) */}
        <button 
          className="md:hidden relative z-50 w-6 h-4 flex flex-col justify-between items-end group"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          <span 
            className={`h-[1px] bg-white transition-all duration-300 ease-in-out ${
              isMobileMenuOpen ? 'w-full rotate-45 translate-y-[7.5px]' : 'w-full group-hover:w-3/4'
            }`} 
          />
          <span 
            className={`h-[1px] bg-white transition-all duration-300 ease-in-out ${
              isMobileMenuOpen ? 'w-full -rotate-45 -translate-y-[7.5px]' : 'w-3/4 group-hover:w-full'
            }`} 
          />
        </button>
      </nav>

      {/* MOBILE FULL-SCREEN OVERLAY */}
      <div 
        className={`fixed inset-0 bg-[#0a0a0a]/95 backdrop-blur-2xl z-40 transition-all duration-500 flex flex-col items-center justify-center ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center gap-10 w-full px-8">
          {navItems.map((item, index) => {
            const isActive = pathname === item.path;
            
            return (
              <Link 
                key={item.name} 
                href={item.path}
                className={`text-4xl sm:text-5xl font-serif tracking-wide transition-all duration-500 transform ${
                  isMobileMenuOpen 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-8 opacity-0'
                } ${
                  isActive ? 'text-white' : 'text-neutral-500 hover:text-white'
                }`}
                // Stagger the animation of the links coming in
                style={{ transitionDelay: `${isMobileMenuOpen ? index * 100 + 100 : 0}ms` }}
              >
                {item.name}
                
                {/* Large indicator dot for mobile active state */}
                {isActive && (
                  <div className="flex justify-center mt-4">
                    <span className={`w-2 h-2 rounded-full ${getActiveTheme(item.path)}`} />
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Ambient bottom glow in the mobile menu */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-white/5 blur-[100px] rounded-full pointer-events-none" />
      </div>
    </>
  );
}