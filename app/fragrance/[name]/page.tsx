// app/fragrance/[name]/page.tsx
import { notFound } from 'next/navigation';
import Navbar from '@/app/_components/Navbar';
import FragranceDetail from '@/app/_components/FragranceDetail';
import fragData from '../../../data/frag_data.json';

export default async function FragrancePage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const resolvedParams = await params;
  const decodedName = decodeURIComponent(resolvedParams.name);

  const fragrance = fragData.find((f: any) => f.Name === decodedName);

  if (!fragrance) {
    notFound();
  }

  return (
    // Remove the static amber selection and background here so the child component can control it
    <main className="min-h-screen bg-[#0a0a0a] text-neutral-200">
      <Navbar />
      <FragranceDetail fragrance={fragrance} />
    </main>
  );
}