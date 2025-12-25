// client/src/lib/lazy-ai.ts

export const getLazyResponse = async (userPrompt: string): Promise<string> => {
  // Aapki bilkul nayi API Key
  const API_KEY = "AIzaSyDe8SnjB6Yo2VcufiLsYjDD-BBLRC3mIpU"; 
  
  // Gemini 1.5 Flash API URL
  const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

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
      }),
    });

    const data = await response.json();

    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      console.error("API Error Detail:", data);
      // Agar error aata hai toh message screen par dikhega
      return "ERROR: " + (data.error?.message || "Response nahi mila.");
    }
  } catch (error) {
    console.error("Network Error:", error);
    return "Net slow hai Maharaj, kripya dobara koshish karein.";
  }
};
