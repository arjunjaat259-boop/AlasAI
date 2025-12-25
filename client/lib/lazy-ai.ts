// client/src/lib/lazy-ai.ts

export const getLazyResponse = async (userPrompt: string): Promise<string> => {
  const HF_TOKEN = "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"; 
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

    // Agar model load ho raha hai (Hugging Face ki khas condition)
    if (result.error && result.estimated_time) {
      return `Maharaj, AI taiyar ho raha hai. Takriban ${Math.round(result.estimated_time)} seconds baad fir se message bhejiye.`;
    }

    if (Array.isArray(result) && result[0].generated_text) {
      const fullText = result[0].generated_text;
      return fullText.split("[/INST]").pop()?.trim() || fullText;
    } else if (result.error) {
      return "AI Studio Error: " + result.error;
    }
    
    return "Jawab nahi mila, dubara try karein.";

  } catch (error: any) {
    // Ab ye "Network slow" nahi bolega, asli wajah batayega
    console.error("HF Error:", error);
    return "Asli Error: " + error.message;
  }
};
