// app/api/clash/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { fragrances } = await req.json();

    if (!fragrances || fragrances.length < 2) {
      return NextResponse.json({ error: 'At least two fragrances are required.' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Format the list of fragrances for the prompt
    const details = fragrances.map((f: any) => `${f.Name} by ${f.Brand} (Notes: ${f.Notes})`).join(" | ");

    const systemInstruction = `
      You are a master perfumer and data analyst.
      Analyze the following fragrances based on their notes: ${details}
      
      Score each fragrance from 0 to 100 on these exact 6 axes:
      1. Woody & Earthy
      2. Fresh & Citrus
      3. Sweet & Gourmand
      4. Spicy & Warm
      5. Floral & Powdery
      6. Dark & Musky
      
      CRITICAL: Return ONLY a valid JSON array of 6 objects. No markdown, no backticks.
      Each object must have an "aspect" string matching the axis name, and a number key for each fragrance's Name.
      
      Example format:
      [
        { "aspect": "Woody & Earthy", "Oud Wood": 95, "Aventus": 40 },
        { "aspect": "Fresh & Citrus", "Oud Wood": 10, "Aventus": 85 }
        // ... 4 more axes
      ]
    `;

    const result = await model.generateContent(systemInstruction);
    const responseText = result.response.text();
    
    const cleanedText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const chartData = JSON.parse(cleanedText);

    return NextResponse.json(chartData);

  } catch (error) {
    console.error('Gemini Clash API Error:', error);
    return NextResponse.json({ error: 'Failed to generate clash data.' }, { status: 500 });
  }
}