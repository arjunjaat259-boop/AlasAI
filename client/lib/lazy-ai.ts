// client/src/lib/lazy-ai.ts

/**
 * Ye function user ke sawal ko Google Gemini AI ke paas bhejta hai
 * aur wahan se sahi jawab laakar deta hai.
 */
export const getLazyResponse = async (userPrompt: string): Promise<string> => {
  // Aapke screenshot 130133.png se li gayi asli API Key
  const API_KEY = "AIzaSyCJMPopWQ2bDQOcTRsnTM2ELgTyf4IWJAY"; 
  
  // Google Gemini API ka address
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
            parts: [{ text: userPrompt }] // Maharaj ka sawal yahan jata hai
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      }),
    });

    const data = await response.json();

    // Check karte hain ki kya AI ne jawab diya hai
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      // Agar API key enable nahi hogi toh ye console mein error dikhayega
      console.error("Gemini API Error:", data);
      return "Maharaj, lagta hai Google AI Studio mein jaakar 'Gemini API' ko enable karna padega tabhi main sahi jawab de paunga.";
    }
  } catch (error) {
    console.error("Network Error:", error);
    return "Net slow hai Maharaj, ek baar fir koshish karein.";
  }
};
