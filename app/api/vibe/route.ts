// app/api/vibe/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // We use the fast flash model for real-time search queries
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // The System Prompt: This is the secret sauce. 
    // We strictly command Gemini to return ONLY a JSON array, no conversational text.
    const systemInstruction = `
      You are a master perfumer and fragrance expert. 
      Translate the following "vibe", mood, or scenario into a list of 3 to 5 standard fragrance notes that perfectly capture it.
      
      CRITICAL: Return ONLY a valid, raw JSON array of strings. Do not include markdown formatting, backticks, or any explanatory text.
      
      Example Input: "A rainy jazz club in Paris wearing a leather jacket"
      Example Output: ["Leather", "Tobacco", "Rum", "Petrichor", "Vanilla"]
      
      User Vibe: "${prompt}"
    `;

    const result = await model.generateContent(systemInstruction);
    const responseText = result.response.text();
    
    // Clean up the response just in case Gemini accidentally includes markdown backticks
    const cleanedText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    // Parse the string into an actual JavaScript array
    const notesArray = JSON.parse(cleanedText);

    return NextResponse.json({ notes: notesArray });

  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { error: 'Failed to translate vibe to notes.' }, 
      { status: 500 }
    );
  }
}