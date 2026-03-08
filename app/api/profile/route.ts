// app/api/profile/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { fragrance } = await req.json();

    if (!fragrance) {
      return NextResponse.json({ error: 'Fragrance data is required.' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const systemInstruction = `
      You are a master perfumer. Analyze this fragrance:
      Name: ${fragrance.Name}
      Brand: ${fragrance.Brand}
      Notes: ${fragrance.Notes}
      Description: ${fragrance.Description}
      
      Score this fragrance from 0 to 100 on these exact 6 axes:
      1. Woody & Earthy
      2. Fresh & Citrus
      3. Sweet & Gourmand
      4. Spicy & Warm
      5. Floral & Powdery
      6. Dark & Musky
      
      CRITICAL: Return ONLY a valid JSON array of 6 objects. No markdown.
      Example format:
      [
        { "aspect": "Woody & Earthy", "score": 95 },
        { "aspect": "Fresh & Citrus", "score": 10 }
      ]
    `;

    const result = await model.generateContent(systemInstruction);
    const responseText = result.response.text();
    
    const cleanedText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const chartData = JSON.parse(cleanedText);

    return NextResponse.json(chartData);

  } catch (error) {
    console.error('Gemini Profile API Error:', error);
    return NextResponse.json({ error: 'Failed to generate profile.' }, { status: 500 });
  }
}