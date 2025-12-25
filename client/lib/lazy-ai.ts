// client/src/lib/lazy-ai.ts

/**
 * Gyan AI - Gemini Integration
 * Ab ye AI 2+2 ka sahi jawab dega!
 */
export const getLazyResponse = async (userPrompt: string): Promise<string> => {
  // Aapki di hui Nayi Gemini API Key
  const API_KEY = "AIzaSyCxcjUPvV3X_2ZB_zQQKQ4N1OBjiL6i_KA"; 
  
  // Gemini 1.5 Flash API URL
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: userPrompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        }
      }),
    });

    const data = await response.json();

    // Check karte hain ki kya Gemini ne sahi result diya
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      console.error("Gemini API Error:", data);
      return "Maharaj, lagta hai key abhi active ho rahi hai. Kripya 1 minute baad fir se koshish karein.";
    }
  } catch (error) {
    console.error("Network Error:", error);
    return "Net slow hai Maharaj, ek baar fir koshish karein.";
  }
};
