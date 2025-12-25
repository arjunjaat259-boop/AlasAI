import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Mic, Send, Brain, Volume2, Globe, Trash2 } from "lucide-react";
import { getLazyResponse } from "@/lib/lazy-ai";
import { speak } from "@/lib/tts";
import { useVoice } from "@/hooks/useVoice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface Message {
  role: "user" | "bot";
  content: string;
  id: string;
}

export default function Index() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [language, setLanguage] = useState<"hi" | "en">("hi");
  const [autoRead, setAutoRead] = useState(true); // auto TTS on/off

  // useVoice hook: adjust if your hook also exposes stopListening
  const voiceHook = useVoice() as any;
  const { isListening, transcript, startListening, setTranscript } = voiceHook;
  const stopListening = voiceHook.stopListening; // may be undefined depending on your hook

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (transcript) {
      handleSend(transcript);
      setTranscript("");
    }
  }, [transcript, setTranscript]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const generateId = () => {
    if (typeof crypto !== "undefined" && (crypto as any).randomUUID) {
      try {
        return (crypto as any).randomUUID();
      } catch {
        // fallback
      }
    }
    return Math.random().toString(36).substring(2, 9);
  };

  const handleSend = async (text: string) => {
    if (!text?.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: text,
      id: generateId(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsThinking(true);

    try {
      // assume getLazyResponse might be async and accepts language
      const responseContent = await getLazyResponse(text, language);
      const botMessage: Message = {
        role: "bot",
        content: responseContent,
        id: generateId(),
      };
      setMessages((prev) => [...prev, botMessage]);

      if (autoRead) {
        // pass language to TTS so it speaks proper Hindi/English
        // voice name ("Thrill") kept same, change if you have language-specific voices
        speak(responseContent, "Thrill", language);
      }
    } catch (err) {
      console.error("handleSend error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content:
            language === "hi"
              ? "Kuch galat ho gaya. Kripya phir se koshish karein."
              : "Something went wrong. Please try again.",
          id: generateId(),
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleMicToggle = () => {
    // If your useVoice exposes stopListening, call it; otherwise only startListening is used.
    if (isListening) {
      if (typeof stopListening === "function") {
        stopListening();
      } else {
        // If no stopListening, you can optionally setTranscript or ignore.
        // Leaving it as no-op if stop isn't available.
      }
    } else {
      startListening();
    }
  };

  const handleReplay = (content: string) => {
    speak(content, "Thrill", language);
  };

  return (
    <div className="min-h-screen bg-[#f4f7ff] flex flex-col items-center p-4 md:p-8 font-sans">
      <header className="w-full max-w-4xl flex justify-between items-center mb-8 bg-white/80 p-4 rounded-[24px] backdrop-blur-md border border-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-purple-600 p-2 rounded-2xl shadow-lg">
            <Brain className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Gyan AI</h1>
            <p className="text-[10px] text-purple-600 font-bold uppercase tracking-widest">Funny & Smart</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as "hi" | "en")}
              className="text-xs font-bold bg-transparent outline-none cursor-pointer"
              aria-label="Select language"
            >
              <option value="hi">HINDI</option>
              <option value="en">ENGLISH</option>
            </select>
          </div>
          <Button variant="ghost" size="sm" className="font-bold text-xs uppercase">
            Login
          </Button>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs px-5">
            SIGN UP
          </Button>
        </div>
      </header>

      <Card className="w-full max-w-2xl flex-1 flex flex-col bg-white border-none shadow-2xl shadow-purple-100 rounded-[40px] overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center">
                <Brain className="w-10 h-10 text-purple-300" />
              </div>
              <h3 className="text-2xl font-black text-slate-800">Namaste! Kuch puchiye?</h3>
              <p className="text-sm text-slate-500 max-w-xs mx-auto font-medium">
                Main shuddh Hindi bolne wala ek intelligent (aur thoda mazaakiya) AI hoon.
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-[28px] ${
                  msg.role === "user"
                    ? "bg-purple-600 text-white rounded-br-none shadow-lg shadow-purple-100"
                    : "bg-slate-100 text-slate-800 rounded-bl-none font-medium"
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.content}</p>
                {msg.role === "bot" && (
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => handleReplay(msg.content)}
                      aria-label="Replay message"
                      className="p-1.5 hover:bg-purple-200/50 rounded-full"
                    >
                      <Volume2 className="w-4 h-4 text-purple-600" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {isThinking && (
            <div className="flex justify-start">
              <div className="bg-slate-50 px-4 py-3 rounded-2xl rounded-bl-none border border-slate-100">
                <span className="text-xs text-slate-400 font-bold italic animate-pulse">Gyan AI soch raha hai...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-slate-50/50 border-t">
          <div className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <Input
                placeholder={language === "hi" ? "Shuddh Hindi mein sawaal puchein..." : "Ask your question..."}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend(inputValue)}
                className="pr-12 h-14 bg-white border-2 border-slate-100 rounded-[22px] focus-visible:ring-purple-200 text-sm font-medium transition-all"
                aria-label="Message input"
              />
              <Button
                size="icon"
                onClick={() => handleSend(inputValue)}
                disabled={!inputValue.trim() || isThinking}
                className="absolute right-2 top-2 h-10 w-10 rounded-xl bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            <Button
              size="icon"
              onClick={handleMicToggle}
              className={`h-14 w-14 rounded-2xl shadow-xl transition-all ${
                isListening ? "bg-red-500 animate-pulse scale-105 shadow-red-200" : "bg-white hover:bg-slate-50 text-purple-600 border-2 border-slate-100 shadow-sm"
              }`}
              aria-pressed={isListening}
              aria-label={isListening ? "Stop listening" : "Start listening"}
            >
              <Mic className="w-6 h-6" />
            </Button>
          </div>
          <div className="mt-3 flex justify-between items-center px-2">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMessages([])}
                className="text-[10px] font-bold text-slate-400 hover:text-red-500 flex items-center gap-1 uppercase tracking-tighter"
                aria-label="Clear chat"
              >
                <Trash2 className="w-3 h-3" /> Clear Chat
              </button>

              <button
                onClick={() => setAutoRead((v) => !v)}
                className="text-[10px] font-bold text-slate-500 hover:text-slate-700 uppercase tracking-tighter"
                aria-pressed={autoRead}
                aria-label="Toggle auto read"
              >
                {autoRead ? (language === "hi" ? "Auto padhai: On" : "Auto-read: On") : language === "hi" ? "Auto padhai: Off" : "Auto-read: Off"}
              </button>
            </div>

            <div className="text-[9px] font-black text-purple-300 uppercase tracking-widest">© 2025 GYAN AI</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
