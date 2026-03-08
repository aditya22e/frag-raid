// app/journal/page.tsx
import Navbar from '../_components/Navbar';
import JournalInterface from '../_components/JournalInterface';
import fragData from '../../data/frag_data.json';

export default function JournalPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-neutral-200 selection:bg-emerald-500/30">
      <Navbar />
      <JournalInterface fragrances={fragData} />
    </main>
  );
}