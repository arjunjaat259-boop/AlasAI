export const getLazyResponse = async (userPrompt: string): Promise<string> => {
  const GROQ_KEY = "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"; 
  const API_URL = "https://api.groq.com/openai/v1/chat/completions";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${GROQ_KEY}`,
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        // Model change kiya hai jo zyada stable hai
        model: "llama-3.3-70b-versatile", 
        messages: [{ role: "user", content: userPrompt }],
        temperature: 0.7
      })
    });

    const data = await response.json();
    
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    } 
    
    // Agar koi specific error aaye toh wo dikhayega
    if (data.error) {
      return "Groq Error: " + data.error.message;
    }

    return "AI busy hai, ek second baad phir likho.";

  } catch (error) {
    return "Net check karo bhai, connection nahi ban raha.";
  }
};
