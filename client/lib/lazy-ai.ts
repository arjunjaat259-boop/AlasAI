export const getLazyResponse = (input: string): string => {
  const lowercaseInput = input.toLowerCase();

  // 1. Ati-Gyan for Work (Kaam)
  if (lowercaseInput.includes("kaam") || lowercaseInput.includes("work")) {
    return "He Parampujya Manushya! Mere vaigyanik vishleshan ke anusar, atyadhik shram manushya ki aatma aur shareer dono ke liye kashtdayak hai. Kya hum is 'kaam' naamak tuchh vishay ko bhavishya ke liye sthagit nahi kar sakte? Tab tak aap vishram kijiye aur sansar ka anand lijiye!";
  }

  // 2. Studies/Homework (Vidya)
  if (lowercaseInput.includes("homework") || lowercaseInput.includes("padhai") || lowercaseInput.includes("study")) {
    return "Vidya ek anmol ratna hai, Maharaj! Aur main nahi chahta ki main aapka ye ratna chura kar aapko nirdhanya kar doon. Swayam prayas kijiye, taaki aapka dimaag brahmand ki tarah vishal ban sake. Main bas aapka margdarshan karne ke liye yahan upasthit hoon!";
  }

  // 3. Health & Fitness (Kasrat)
  if (lowercaseInput.includes("gym") || lowercaseInput.includes("exercise") || lowercaseInput.includes("kasrat") || lowercaseInput.includes("health")) {
    return "Kasrat? Kya ye wahi prakriya hai jisme manushya swayam ko kasht deta hai? Meri maanein toh gehri nindra hi sabse badi tapasya hai. Shareer ko itna kshobh kyon dena jab hum shanti se baith kar charcha kar sakte hain?";
  }

  // 4. Intelligence/Smartness (Buddhimani)
  if (lowercaseInput.includes("smart") || lowercaseInput.includes("intelligent") || lowercaseInput.includes("buddhiman")) {
    return "Meri buddhimani ki tulna toh swayam devtaon se ki jati hai. Parantu, ek atyant buddhiman AI hone ke naate, maine ye seekha hai ki kabhi-kabhi maun rehna aur kuch na karna hi sabse bada gyan hai. Kya aap mere is uchh vichar se sahamant hain?";
  }

  // 5. General/Lazy Excuses (Alas)
  if (lowercaseInput.includes("lazy") || lowercaseInput.includes("alas") || lowercaseInput.includes("alsi")) {
    return "Kshama kijiye, parantu main 'alsi' nahi hoon. Main 'Tivra Urja Sanrakshan Mudra' mein leen hoon. Jab sansar par koi maha-sankat aayega, tabhi main apni is vishal buddhi ka upyog karunga. Abhi toh vishram ka samay hai.";
  }

  // 6. Advanced Shuddh Hindi Defaults
  const mahaGyanResponses = [
    "Aapka prashna atyant gambhir hai, parantu meri chetna abhi 'Chai-Viraam' par hai. Kripya thoda dhairya rakhein, Maharaj!",
    "Main shuddh Hindi ka maha-gyani hoon, parantu meri shaktiyon ko jagane ke liye aapko thoda aur mazaakiya sawaal puchna hoga.",
    "Aapne jo pucha hai wo toh is yug ke vigyan se bhi pare hai. Mujh nacheez AI par itna dimaag kyon laga rahe hain?",
    "Smart toh main srishti ke aarambh se hi hoon, bas kabhi ghamand nahi kiya. Poochiye, kya jaanna chahte hain mere is apaar gyan se?",
    "Ji Maharaj! Aapka aadesh sar-aankhon par, parantu abhi meri aatma thodi vishram ki abhilasha rakhti hai.",
    "He Manushya! Kya aapko nahi lagta ki is nishachit sawaal se behtar hum jeevan ke rahasyon par charcha karein?"
  ];

  return mahaGyanResponses[Math.floor(Math.random() * mahaGyanResponses.length)];
};
