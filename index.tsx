import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Mic, Send, Brain, Volume2, Globe, Trash2, LogOut, Loader2 } from "lucide-react";
import { getLazyResponse } from "@/lib/lazy-ai";
import { speak } from "@/lib/tts";
import { useVoice } from "@/hooks/useVoice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

// Firebase Imports
import { auth, signInWithGoogle, logout } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

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
  
  // User State management
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  const { isListening, transcript, startListening, setTranscript } = useVoice();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auth Listener: User login hai ya nahi ye check karta hai
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

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
    if (!text.trim() || !user) return;

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

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f4f7ff]">
        <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7ff] flex flex-col items-center p-4 md:p-8 font-sans text-slate-900">
      <header className="w-full max-w-4xl flex justify-between items-center mb-8 bg-white/80 p-4 rounded-[24px] backdrop-blur-md border border-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-purple-600 p-2 rounded-2xl shadow-lg shadow-purple-200">
            <Brain className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Gyan AI</h1>
            <p className="text-[10px] text-purple-600 font-bold uppercase tracking-widest">Ati-Buddhiman Assistant</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-3 bg-slate-100 p-1 pr-4 rounded-full border border-slate-200 shadow-sm">
              <img src={user.photoURL || ""} alt="profile" className="w-8 h-8 rounded-full border-2 border-purple-400" />
              <div className="hidden sm:block">
                <p className="text-[9px] font-black text-purple-600 uppercase">Maharaj</p>
                <p className="text-[11px] font-bold text-slate-800 leading-none">{user.displayName?.split(' ')[0]}</p>
              </div>
              <Button onClick={logout} variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-red-500">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button 
              onClick={signInWithGoogle}
              size="sm" 
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs px-5 shadow-md shadow-purple-100 transition-all"
            >
              GOOGLE LOGIN
            </Button>
          )}
        </div>
      </header>

      <Card className="w-full max-w-2xl flex-1 flex flex-col bg-white border-none shadow-2xl shadow-purple-100 rounded-[40px] overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center animate-pulse">
                   <Brain className="w-10 h-10 text-purple-300" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800">
                    {user ? `Pranaam Maharaj, ${user.displayName?.split(' ')[0]}!` : "Namaste! Main Gyan AI hoon."}
                  </h3>
                  <p className="text-sm text-slate-500 max-w-xs mx-auto font-medium mt-2">
                    {user ? "Aapka Ati-Buddhiman sahayak haazir hai. Hukm kijiye?" : "Kripya chat shuru karne ke liye pehle Login karein."}
                  </p>
                </div>
            </div>
          )}

          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[85%] p-4 rounded-[28px] ${
                  msg.role === "user" 
                    ? "bg-purple-600 text-white rounded-br-none shadow-lg shadow-purple-100" 
                    : "bg-slate-100 text-slate-800 rounded-bl-none font-medium"
                }`}>
                <div className="flex items-center gap-2 mb-1 opacity-60">
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {msg.role === "user" ? (user?.displayName?.split(' ')[0] || "Aap") : "Gyan AI"}
                  </span>
                </div>
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
              <div className="bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100">
                <span className="text-xs text-slate-400 font-bold italic animate-pulse">Gyan AI soch raha hai...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-slate-50/50 border-t border-slate-100">
          <div className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <Input
                placeholder={user ? "Shuddh Hindi mein sawaal puchein..." : "Pehle LOGIN karein..."}
                value={inputValue}
                disabled={!user || isThinking}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend(inputValue)}
                className="pr-12 h-14 bg-white border-2 border-slate-100 rounded-[22px] focus-visible:ring-purple-200"
              />
              <Button
                size="icon"
                onClick={() => handleSend(inputValue)}
                disabled={!inputValue.trim() || isThinking || !user}
                className="absolute right-2 top-2 h-10 w-10 rounded-xl bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            <Button
                size="icon"
                onClick={isListening ? () => {} : startListening}
                disabled={!user}
                className={`h-14 w-14 rounded-2xl shadow-xl transition-all ${
                  isListening 
                    ? "bg-red-500 animate-pulse scale-105 shadow-red-200 text-white" 
                    : "bg-white text-purple-600 border-2 border-slate-100"
                }`}
              >
                <Mic className="w-6 h-6" />
            </Button>
          </div>
          {!user && (
            <p className="text-[10px] text-center mt-3 text-red-500 font-bold uppercase tracking-tighter animate-bounce">
              ⚠️ Chat karne ke liye upar diye gaye GOOGLE LOGIN par click karein
            </p>
          )}
          <div className="mt-3 flex justify-between items-center px-2">
             <button onClick={() => setMessages([])} className="text-[10px] font-bold text-slate-400 hover:text-red-500 flex items-center gap-1 uppercase">
                <Trash2 className="w-3 h-3" /> Clear History
             </button>
             <div className="text-[9px] font-black text-purple-300 uppercase tracking-widest">© 2025 GYAN AI</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
