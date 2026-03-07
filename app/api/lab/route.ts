// app/api/lab/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { baseLayer, topLayer } = await req.json();

    if (!baseLayer || !topLayer) {
      return NextResponse.json({ error: 'Both fragrances are required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // The System Prompt for the AI Mixologist
    const systemInstruction = `
      You are a world-class master perfumer and scent chemist. 
      Analyze what happens when these two specific fragrances are layered.
      
      Base Layer (Sprayed First): ${baseLayer.Name} by ${baseLayer.Brand}. Notes: ${baseLayer.Notes}
      Top Layer (Sprayed Over): ${topLayer.Name} by ${topLayer.Brand}. Notes: ${topLayer.Notes}
      
      Provide your analysis strictly as a JSON object with the following keys:
      - "score": A number between 1 and 100 representing how well they blend.
      - "verdict": A 2-to-4 word summary (e.g., "Perfect Harmony", "Chaotic Clash", "Intriguing Contrast").
      - "description": A beautifully written 2-sentence description of what the combined scent smells like, and why the notes either work well together or conflict.
      
      CRITICAL: Return ONLY valid JSON. No markdown backticks or explanation.
    `;

    const result = await model.generateContent(systemInstruction);
    const responseText = result.response.text();
    
    // Clean and parse the JSON
    const cleanedText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const analysis = JSON.parse(cleanedText);

    return NextResponse.json(analysis);

  } catch (error) {
    console.error('Gemini Lab API Error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze the blend.' }, 
      { status: 500 }
    );
  }
}