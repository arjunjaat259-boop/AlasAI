export const getLazyResponse = async (userPrompt: string): Promise<string> => {
  const HF_TOKEN = "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"; 
  // Humne model badal kar 'google/gemma-2b-it' kar diya hai, ye light model hai
  const API_URL = "https://api-inference.huggingface.co/models/google/gemma-1.1-2b-it";

  try {
    const response = await fetch(API_URL, {
      headers: { 
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json" 
      },
      method: "POST",
      body: JSON.stringify({ 
        inputs: userPrompt,
        parameters: { max_new_tokens: 150 }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return "Server Error: " + (errorData.error || response.statusText);
    }

    const result = await response.json();

    if (Array.isArray(result) && result[0].generated_text) {
      return result[0].generated_text;
    }
    
    return "Jawab nahi mila, dubara try karein.";

  } catch (error: any) {
    // Agar abhi bhi 'Failed to fetch' aaye, toh aapka network block kar raha hai
    return "Abhi bhi wahi problem: " + error.message;
  }
};
