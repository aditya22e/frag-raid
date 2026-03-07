// app/lab/page.tsx
import Navbar from '../_components/Navbar';
import LabInterface from '../_components/LabInterface';
import fragData from '../../data/frag_data.json';

export default function LabPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-neutral-200 selection:bg-amber-500/30">
      <Navbar />
      <LabInterface fragrances={fragData} />
    </main>
  );
}