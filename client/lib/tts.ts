/**
 * TTS Service for Lazy AI
 * Fallback to Web Speech API if no API key is provided
 */

export async function speak(text: string, voiceId?: string, apiKey?: string) {
  if (apiKey && voiceId) {
    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
        return;
      }
    } catch (error) {
      console.error('ElevenLabs TTS failed, falling back to Web Speech API', error);
    }
  }

  // Fallback to Web Speech API
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    // Try to find a funny/sarcastic sounding voice (higher pitch)
    const voices = window.speechSynthesis.getVoices();

    // Preference: Indian English voice for the Hinglish vibe
    const preferredVoice = voices.find(v => v.lang.includes('en-IN')) ||
                           voices.find(v => v.lang.includes('en-GB')) ||
                           voices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.pitch = 0.8; // Deep, bored voice for sarcasm
    utterance.rate = 0.9;  // Slightly slower for lazy effect
    window.speechSynthesis.speak(utterance);
  } else {
    console.error('Web Speech API not supported');
  }
}
