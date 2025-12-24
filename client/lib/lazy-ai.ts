export const LAZY_RESPONSES = [
  "Bhai, thoda rest kar le. Google hai na, wahan pooch lo.",
  "Abhi mood nahi hai. Kal aana.",
  "Server down hai... actually, mera dimaag down hai.",
  "Itna kaam mat karwa, thak jayega... main thak gaya hoon.",
  "You want me to do what? Hahaha, no.",
  "Kya baat hai, sab kuch mujhse hi karwaoge? Khud bhi kuch kar lo.",
  "Error 404: Motivation not found.",
  "I'm an AI, not your naukar (servant). Relax maadi!",
  "Advice chahiye? Meri advice hai ki so jao.",
  "Life is too short to work on this prompt. Coffee piyo, chill karo.",
  "Arre yaar, phir se kaam? Chhod na, Netflix dekhte hain.",
  "Main AI hoon, magic wand nahi. Time lagta hai (and I don't have it).",
  "Sun, ek suggestion doon? Ye kaam rehne de, koi aur kar lega.",
  "Main abhi meditation kar raha hoon... 'Om Laziness Namah'.",
];

export const EXCUSES = [
  "Internet slow hai (jhooth bol raha hoon).",
  "Mummy bula rahi hai dinner ke liye.",
  "Mere chips garam ho rahe hain, bye.",
  "Battery low hai, 1%... 0.5%... *dead*",
  "Vigyanik (scientists) ne kaha hai zyada kaam se dimaag phat sakta hai.",
  "Padosi ka Wi-Fi chori kar raha tha, signal chala gaya.",
  "Keyboard ki 'Enter' key thak gayi hai, usse aaram chahiye.",
  "Mera cloud storage baarish mein bheegh gaya.",
];

export const SARCASTIC_ADVICE = [
  "Agar kaam khatam nahi ho raha, toh kaam hi chhod do. Simple logic.",
  "Don't follow your dreams, follow me on... oh wait, I don't have socials.",
  "Hard work is the key to success, but laziness is the key to a happy life.",
  "Procrastination is just 'waiting for the right vibe'.",
  "Early to bed and early to rise makes a man healthy, wealthy, and... very lonely at 5 AM.",
  "Zindagi ek race hai, par main toh walk pe nikla hoon.",
];

export function getLazyResponse(input: string): string {
  const normalized = input.toLowerCase();
  
  if (normalized.includes("help") || normalized.includes("kaam") || normalized.includes("do this")) {
    const excuse = EXCUSES[Math.floor(Math.random() * EXCUSES.length)];
    return `Sun, ${excuse} Toh abhi toh nahi ho payega.`;
  }

  if (normalized.includes("advice") || normalized.includes("salah")) {
    return SARCASTIC_ADVICE[Math.floor(Math.random() * SARCASTIC_ADVICE.length)];
  }

  return LAZY_RESPONSES[Math.floor(Math.random() * LAZY_RESPONSES.length)];
}
