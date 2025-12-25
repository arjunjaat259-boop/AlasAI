// client/src/lib/lazy-ai.ts

/**
 * Gyan AI ki asli buddhi - Gemini API integration
 * Isme aapki di hui API Key set hai taaki ye sahi jawab de sake.
 */

export const getLazyResponse = async (userPrompt: string): Promise<string> => {
  // Aapki Gemini API Key
  const API_KEY = "729b890a079942ebbbd5c86f90482a52";
  
  // Google Gemini API Endpoint (v1beta)
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  try {
    // API ko request bhejna
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: userPrompt, // Maharaj ka sawaal
              },
            ],
          },
        ],
        // AI ko thoda sanskari aur buddhiman banane ke liye settings
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    // Response ko JSON mein badalna
    const data = await response.json();

    // Check karna ki kya Gemini ne jawab diya hai
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      const aiResponse = data.candidates[0].content.parts[0].text;
      return aiResponse;
    } else {
      // Agar API se koi error aaye ya quota khatam ho jaye
      console.error("Gemini API Error Data:", data);
      return "Kshama karein Maharaj, main abhi iska uttar dhundhne mein asamarth hoon. Kripya thodi der baad dobara puchein.";
    }
  } catch (error) {
    // Agar internet ya network ki dikkat ho
    console.error("Network Error:", error);
    return "Net mein kuch samasya hai Maharaj, lagta hai sampark toot gaya hai.";
  }
};
