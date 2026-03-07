// app/page.tsx
import Navbar from './_components/Navbar';
import Hero from './_components/Hero';
import ProductGrid from './_components/ProductGrid';
import fragData from '../data/frag_data.json';

export default async function Home({
  searchParams,
}: {
  // 1. Update the type to be a Promise
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // 2. Await the promise before reading from it
  const resolvedSearchParams = await searchParams;
  
  // 3. Now you can safely grab the notes
  const notesQuery = resolvedSearchParams?.notes as string;
  let displayData = fragData;

  // 4. The Filtering Algorithm
  if (notesQuery) {
    const targetNotes = notesQuery.split(',').map(n => n.trim().toLowerCase());

    displayData = fragData.filter((frag: any) => {
      if (!frag.Notes) return false;
      const fragNotesLower = frag.Notes.toLowerCase();
      
      return targetNotes.some(targetNote => fragNotesLower.includes(targetNote));
    });
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-neutral-200 selection:bg-amber-500/30 scroll-smooth">
      <Navbar />
      <Hero />
      <ProductGrid 
        fragrances={displayData} 
        activeFilter={notesQuery} 
      />
    </main>
  );
}