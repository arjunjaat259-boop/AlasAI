export const speak = (text: string, voiceType: string = "Thrill", language: string = "hi-IN") => {
  if (!window.speechSynthesis) {
    console.error("Speech synthesis not supported");
    return;
  }

  // Pehle se chal rahi awaaz ko band karein
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Shuddh Hindi ke liye language set karein
  utterance.lang = "hi-IN"; 
  utterance.rate = 0.9; // Thodi dheere taaki 'Maharaj' wali gambhirta lage
  utterance.pitch = 1.0;

  // Best Hindi voice dhundne ka logic
  const voices = window.speechSynthesis.getVoices();
  
  // Priority: Hindi voices (Google ya Microsoft)
  const hindiVoice = voices.find(v => 
    v.lang.includes("hi") || v.name.includes("Hindi") || v.name.includes("Google हिन्दी")
  );

  if (hindiVoice) {
    utterance.voice = hindiVoice;
  }

  window.speechSynthesis.speak(utterance);
};
