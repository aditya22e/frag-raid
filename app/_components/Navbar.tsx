// app/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Vibe Engine', path: '/' },
    { name: 'Layers Lab', path: '/lab' },
    { name: 'Frag Clash', path: '/clash' },
    { name: 'Journal', path: '/journal' } // Placeholder for future features
  ];

  return (
    <nav className="flex items-center justify-between px-8 py-6 border-b border-white/5 backdrop-blur-md sticky top-0 z-50 bg-[#0a0a0a]/80">
      
      {/* Logo / Home Link */}
      <Link href="/" className="text-2xl font-serif tracking-widest text-white hover:opacity-80 transition-opacity">
        FRAG<span className="text-amber-500/80">-</span>RAID
      </Link>
      
      {/* Navigation Links */}
      <div className="hidden md:flex gap-8 text-sm tracking-wide">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          
          return (
            <Link 
              key={item.name} 
              href={item.path}
              className={`transition-all duration-300 relative ${
                isActive ? 'text-white font-medium' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {item.name}
              
              {/* Subtle active underline indicator */}
              {isActive && (
                <span className="absolute -bottom-2 left-0 w-full h-[1px] bg-amber-500/50 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
              )}
            </Link>
          );
        })}
      </div>
      
    </nav>
  );
}