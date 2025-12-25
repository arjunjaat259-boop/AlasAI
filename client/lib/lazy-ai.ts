// client/src/lib/lazy-ai.ts

export const getLazyResponse = async (userPrompt: string): Promise<string> => {
  // Aapki Nayi API Key
  const API_KEY = "bpk-b30ab1ee855740d4932ad1d81ece52d7";
  
  // Google Gemini API Endpoint
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
            parts: [
              {
                text: userPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    });

    const data = await response.json();

    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      console.error("API Error:", data);
      return "Kshama karein Maharaj, lagta hai key mein kuch samasya hai ya quota khatam ho gaya hai.";
    }
  } catch (error) {
    console.error("Network Error:", error);
    return "Net mein kuch samasya hai Maharaj, dobara prayas karein.";
  }
};
