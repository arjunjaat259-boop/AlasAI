import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Send, Brain, User, Bot, Volume2, Globe, Trash2 } from "lucide-react";
import { getLazyResponse } from "@/lib/lazy-ai"; // Tip: Ise baad mein "getSmartResponse" se badal dein
import { speak } from "@/lib/tts";
import { useVoice } from "@/hooks/useVoice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  
  const { isListening, transcript, startListening, setTranscript, error: voiceError } = useVoice();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (transcript) {
      handleSend(transcript);
      setTranscript("");
    }
  }, [transcript]);

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

    // Smart Processing Delay
    await new Promise((resolve) => setTimeout(resolve, 800));

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
      {/* Updated Header with Language, Login, Signup */}
      <header className="w-full max-w-4xl flex flex-wrap justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-purple-600 p-2 rounded-2xl shadow-lg">
            <Brain className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gyan AI</h1>
            <p className="text-xs text-muted-foreground font-medium">Shuddh Hindi. Smart Solutions.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border">
          {/* Language Selector */}
          <div className="flex items-center gap-2 px-2 border-r">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="text-sm font-medium bg-transparent outline-none cursor-pointer"
            >
              <option value="hi">हिन्दी</option>
              <option value="en">English</option>
            </select>
          </div>
          
          {/* Auth Buttons */}
          <Button variant="ghost" size="sm" className="text-sm font-semibold">Login</Button>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-5">Sign Up</Button>
          
          <Button variant="ghost" size="icon" onClick={() => setMessages([])} className="ml-2 hover:text-destructive">
             <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Main Chat Container */}
      <Card className="w-full max-w-2xl flex-1 flex flex-col bg-white border-none shadow-2xl shadow-indigo-100/50 rounded-[32px] overflow-hidden">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
                <Brain className="w-16 h-16 text-purple-200" />
                <div>
                  <h3 className="text-xl font-bold text-purple-900">Namaste! Main Gyan AI hoon.</h3>
                  <p className="text-sm max-w-xs mx-auto text-muted-foreground">Main aapki sahayata shuddh Hindi mein kar sakta hoon. Kuch puchiye?</p>
                </div>
            </div>
          )}

          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[85%] p-4 rounded-3xl ${
                  msg.role === "user" ? "bg-purple-600 text-white rounded-br-none" : "bg-slate-100 text-foreground rounded-bl-none"
                }`}>
                <div className="flex items-center gap-2 mb-1 opacity-70">
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {msg.role === "user" ? "Aap" : "Gyan AI"}
                  </span>
                </div>
                <p className="text-sm leading-relaxed font-medium">{msg.content}</p>
                {msg.role === "bot" && (
                   <button onClick={() => speak(msg.content, "Thrill", "")} className="mt-2 p-1 hover:bg-black/5 rounded-full">
                     <Volume2 className="w-4 h-4 text-purple-600" />
                   </button>
                )}
              </div>
            </motion.div>
          ))}

          {isThinking && (
            <div className="flex justify-start">
              <div className="bg-slate-100 p-4 rounded-3xl flex items-center gap-2">
                <span className="text-xs text-muted-foreground italic font-medium">Soch raha hoon...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-indigo-50/50">
          <div className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <Input
                placeholder="Shuddh Hindi mein sawaal puchein..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend(inputValue)}
                className="pr-12 h-14 bg-slate-50 border-none rounded-2xl focus-visible:ring-purple-200 text-base"
              />
              <Button
                size="icon"
                onClick={() => handleSend(inputValue)}
                disabled={!inputValue.trim() || isThinking}
                className="absolute right-2 top-2 h-10 w-10 rounded-xl bg-purple-600 hover:bg-purple-700 shadow-lg"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            <Button
                size="icon"
                onClick={isListening ? () => {} : startListening}
                className={`h-14 w-14 rounded-2xl shadow-xl transition-all ${
                  isListening ? "bg-red-500 animate-pulse scale-110" : "bg-white hover:bg-slate-50 text-purple-600 border shadow-sm"
                }`}
              >
                <Mic className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
