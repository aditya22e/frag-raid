// app/clash/page.tsx
import Navbar from '../_components/Navbar';
import ClashInterface from '../_components/ClashInterface';
import fragData from '../../data/frag_data.json';

export default function ClashPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-neutral-200 selection:bg-cyan-500/30">
      <Navbar />
      <ClashInterface fragrances={fragData} />
    </main>
  );
}