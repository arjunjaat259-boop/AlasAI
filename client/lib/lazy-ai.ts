// client/src/lib/lazy-ai.ts

export const getLazyResponse = async (userPrompt: string): Promise<string> => {
  // Aapki nayi API Key
  const API_KEY = "AIzaSyDe8SnjB6Yo2VcufiLsYjDD-BBLRC3mIpU"; 
  
  // URL ko v1 se v1beta kar diya hai taaki Flash model sahi se chale
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userPrompt }] }]
      }),
    });

    const data = await response.json();

    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      console.error("API Error Detail:", data);
      return "ERROR: " + (data.error?.message || "Kuch galat hua.");
    }
  } catch (error) {
    return "Net slow hai Maharaj.";
  }
};
