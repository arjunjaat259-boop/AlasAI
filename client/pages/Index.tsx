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
  const [language, setLanguage] = useState("hi");
  
  const { isListening, transcript, startListening, setTranscript } = useVoice();
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

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: text,
      id: Math.random().toString(36).substring(7),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsThinking(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const responseContent = getLazyResponse(text); 
    const botMessage: Message = {
      role: "bot",
      content: responseContent,
      id: Math.random().toString(36).substring(7),
    };

    setMessages((prev) => [...prev, botMessage]);
    setIsThinking(false);
    speak(responseContent, "Thrill", ""); 
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
              onChange={(e) => setLanguage(e.target.value)}
              className="text-xs font-bold bg-transparent outline-none cursor-pointer"
            >
              <option value="hi">HINDI</option>
              <option value="en">ENGLISH</option>
            </select>
          </div>
          <Button variant="ghost" size="sm" className="font-bold text-xs uppercase">Login</Button>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs px-5">SIGN UP</Button>
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
                <p className="text-sm text-slate-500 max-w-xs mx-auto font-medium">Main shuddh Hindi bolne wala ek intelligent (aur thoda mazaakiya) AI hoon.</p>
            </div>
          )}

          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[85%] p-4 rounded-[28px] ${
                  msg.role === "user" ? "bg-purple-600 text-white rounded-br-none shadow-lg shadow-purple-100" : "bg-slate-100 text-slate-800 rounded-bl-none font-medium"
                }`}>
                <p className="text-sm leading-relaxed">{msg.content}</p>
                {msg.role === "bot" && (
                   <button onClick={() => speak(msg.content, "Thrill", "")} className="mt-2 p-1.5 hover:bg-purple-200/50 rounded-full">
                     <Volume2 className="w-4 h-4 text-purple-600" />
                   </button>
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
                placeholder="Shuddh Hindi mein sawaal puchein..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend(inputValue)}
                className="pr-12 h-14 bg-white border-2 border-slate-100 rounded-[22px] focus-visible:ring-purple-200 text-sm font-medium transition-all"
              />
              <Button
                size="icon"
                onClick={() => handleSend(inputValue)}
                disabled={!inputValue.trim() || isThinking}
                className="absolute right-2 top-2 h-10 w-10 rounded-xl bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            <Button
                size="icon"
                onClick={isListening ? () => {} : startListening}
                className={`h-14 w-14 rounded-2xl shadow-xl transition-all ${
                  isListening ? "bg-red-500 animate-pulse scale-105 shadow-red-200" : "bg-white hover:bg-slate-50 text-purple-600 border-2 border-slate-100 shadow-sm"
                }`}
              >
                <Mic className="w-6 h-6" />
            </Button>
          </div>
          <div className="mt-3 flex justify-between items-center px-2">
             <button onClick={() => setMessages([])} className="text-[10px] font-bold text-slate-400 hover:text-red-500 flex items-center gap-1 uppercase tracking-tighter">
                <Trash2 className="w-3 h-3" /> Clear Chat
             </button>
             <div className="text-[9px] font-black text-purple-300 uppercase tracking-widest">© 2025 GYAN AI</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
