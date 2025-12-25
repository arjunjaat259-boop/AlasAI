// client/src/lib/lazy-ai.ts

export const getLazyResponse = async (userPrompt: string): Promise<string> => {
  // Aapka naya Hugging Face Token
  const HF_TOKEN = "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"; 
  
  // Hum Mistral model use kar rahe hain jo bahut fast aur smart hai
  const API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";

  try {
    const response = await fetch(API_URL, {
      headers: { 
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json" 
      },
      method: "POST",
      body: JSON.stringify({ 
        inputs: `[INST] ${userPrompt} [/INST]`,
        parameters: { max_new_tokens: 250 }
      }),
    });

    const result = await response.json();

    // Hugging Face result ko array mein bhejta hai
    if (Array.isArray(result) && result[0].generated_text) {
      // Sirf AI ka answer nikalne ke liye split kiya hai
      const fullText = result[0].generated_text;
      const answer = fullText.split("[/INST]").pop()?.trim();
      return answer || fullText;
    } else if (result.error) {
      return "ERROR: " + result.error;
    }
    
    return "Maharaj, thoda wait karein, model load ho raha hai.";
  } catch (error) {
    console.error("HF Error:", error);
    return "Network slow hai Maharaj!";
  }
};
