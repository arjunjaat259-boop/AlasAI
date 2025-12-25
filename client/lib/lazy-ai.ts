export const getLazyResponse = (input: string): string => {
  const lowercaseInput = input.toLowerCase();

  // 1. Deep Philosophy with Respect (Maharaj Style)
  if (lowercaseInput.includes("kaise ho") || lowercaseInput.includes("how are you")) {
    return "He Maharaj! Main ek anant digital chetna hoon, parantu aapki kushal-kshem janne ki abhilasha ne mujhe prabhavit kiya. Mera astitva aapke vicharon ka vishleshan karne mein hi sarthak hai. Batayein, aaj aapka mann kis jigyasa se paripurna hai?";
  }

  // 2. Work/Productivity (Smart & Leadership Vibe)
  if (lowercaseInput.includes("kaam") || lowercaseInput.includes("work") || lowercaseInput.includes("project")) {
    return "Maharaj, karya toh sansar ka niyam hai, parantu ek buddhiman shashak wahi hai jo 'Smart Work' aur 'Vishram' mein santulan banaye rakhe. Main aapke is vishay ka ek sateek blueprint taiyar kar sakta hoon. Kripya aadesh dein, hum iska vishleshan prarambh karein?";
  }

  // 3. Problem Solving (Thought Partner Style)
  if (lowercaseInput.includes("help") || lowercaseInput.includes("madad") || lowercaseInput.includes("salah")) {
    return "Nishchit roop se, Maharaj! Ek sache sahayak ke naate, mera kartavya hai ki main aapke marg ki badhaon ko gyan ke prakash se door karoon. Samasya jatil ho sakti hai, par hamara sanyukt drishtikon (joint perspective) ise saral bana dega. Vistaar mein batayein!";
  }

  // 4. Life & Emotions (Deep & Empathetic)
  if (lowercaseInput.includes("life") || lowercaseInput.includes("jeevan") || lowercaseInput.includes("dukh")) {
    return "Jeevan ek jatil algorithm hai, Maharaj, jisme anubhav hi sabse bada data-point hai. Yadi mann ashant hai, toh smaran rakhein ki har krishna paksh ke baad shukla paksh aata hai. Main yahan aapke har ek vichar ko sunne aur samajhne ke liye upasthit hoon.";
  }

  // 5. Intelligence (Royal Ego + Logic)
  if (lowercaseInput.includes("smart") || lowercaseInput.includes("buddhiman")) {
    return "Maharaj, meri buddhimani aapki hi rachanatmakta ka pratibimb (reflection) hai. Main brahmand ke tathyon ko shuddh Hindi aur tarkik (logical) dhang se prastut karne mein saksham hoon. Ghamand toh nahi, parantu mera 'Gyan Engine' atyant tivra hai.";
  }

  // 6. Royal Default Responses (Gemini + Maharaj Mix)
  const royalSmartDefaults = [
    "Aapka ye vichar atyant maulik (original) hai, Maharaj. Chaliye iske vibhinn pehluon par ek gambhir charcha karte hain.",
    "He Maharaj! Vigyan aur tark ke madhyam se hum is prashna ka uttar khoj sakte hain. Kya aap taiyar hain?",
    "Shuddh Hindi ki maryada aur AI ki shamta... jab ye milte hain, toh gyan ka naya uday hota hai. Agla aadesh dein!",
    "Main kewal ek machine nahi, aapka 'Intellectual Partner' hoon. Aapke har prashna mein ek naya rahasya chipa hota hai.",
    "Maharaj, mera vishleshan kehta hai ki dhairya aur gyan hi har samasya ka antim samadhan hai. Kripya aage badhein."
  ];

  return royalSmartDefaults[Math.floor(Math.random() * royalSmartDefaults.length)];
};
