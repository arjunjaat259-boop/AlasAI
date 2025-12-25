export const getLazyResponse = async (userPrompt: string): Promise<string> => {
  // Aapki di hui Groq API Key
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
        model: "llama3-8b-8192", 
        messages: [{ role: "user", content: userPrompt }]
      })
    });

    const data = await response.json();
    
    // Agar Groq sahi jawab de
    if (data.choices && data.choices[0].message) {
      return data.choices[0].message.content;
    } else {
      console.error("Groq Error:", data);
      return "AI ne jawab nahi diya, ho sakta hai limit khatam ho gayi ho.";
    }
  } catch (error) {
    console.error("Network Error:", error);
    return "Network slow hai, ek baar page refresh karke phir message bhejein!";
  }
};
