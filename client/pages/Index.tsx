import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Send, Coffee, Battery, User, Bot, Volume2, Info, Settings, Trash2 } from "lucide-react";
import { getLazyResponse } from "@/lib/lazy-ai";
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
  const [elevenLabsKey, setElevenLabsKey] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  
  const { isListening, transcript, startListening, setTranscript, error: voiceError } = useVoice();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (voiceError) {
      console.error("Voice Error:", voiceError);
    }
  }, [voiceError]);

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

    // Artificial delay to show "laziness"
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const responseContent = getLazyResponse(text);
    const botMessage: Message = {
      role: "bot",
      content: responseContent,
      id: Math.random().toString(36).substring(7),
    };

    setMessages((prev) => [...prev, botMessage]);
    setIsThinking(false);
    
    // Auto-speak the response
    speak(responseContent, "Thrill", elevenLabsKey);
  };

  return (
    <div className="min-h-screen bg-[#f8f7ff] flex flex-col items-center p-4 md:p-8 font-sans">
      {/* Header */}
      <header className="w-full max-w-2xl flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-2xl shadow-lg shadow-primary/20">
            <Coffee className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Alas AI</h1>
            <p className="text-xs text-muted-foreground font-medium">Too lazy to actually help</p>
          </div>
        </div>
        <div className="flex gap-2">
           <Button variant="ghost" size="icon" onClick={() => setMessages([])} className="hover:text-destructive transition-colors">
             <Trash2 className="w-5 h-5 text-muted-foreground" />
           </Button>
           <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)}>
             <Settings className="w-5 h-5 text-muted-foreground" />
           </Button>
        </div>
      </header>

      {/* Main Chat Container */}
      <Card className="w-full max-w-2xl flex-1 flex flex-col bg-white border-none shadow-2xl shadow-indigo-100/50 rounded-[32px] overflow-hidden">
        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-muted/50 p-4 border-b border-border overflow-hidden"
            >
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                ElevenLabs API Key (Optional for High-Quality TTS)
              </label>
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="Enter your key..."
                  value={elevenLabsKey}
                  onChange={(e) => setElevenLabsKey(e.target.value)}
                  className="bg-white border-none shadow-sm"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-8 opacity-40">
              <div className="space-y-4">
                <div className="bg-muted p-6 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
                   <Battery className="w-12 h-12 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">I'm currently 1% motivated</h3>
                  <p className="text-sm max-w-xs mx-auto">Try saying something, but don't expect too much work from me.</p>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-dashed border-primary/30 hover:bg-primary/5"
                  onClick={() => handleSend("Give me some advice")}
                >
                  Need Advice?
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-dashed border-primary/30 hover:bg-primary/5"
                  onClick={() => handleSend("Do my homework")}
                >
                  Do my work
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-dashed border-primary/30 hover:bg-primary/5"
                  onClick={() => handleSend("Why aren't you working?")}
                >
                  Why so lazy?
                </Button>
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
              <div
                className={`max-w-[85%] p-4 rounded-3xl ${
                  msg.role === "user"
                    ? "bg-primary text-white rounded-br-none shadow-lg shadow-primary/20"
                    : "bg-muted text-foreground rounded-bl-none"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {msg.role === "user" ? (
                    <User className="w-3 h-3 opacity-70" />
                  ) : (
                    <Bot className="w-3 h-3 opacity-70" />
                  )}
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                    {msg.role === "user" ? "You" : "Alas AI"}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{msg.content}</p>
                {msg.role === "bot" && (
                   <button 
                    onClick={() => speak(msg.content, "Thrill", elevenLabsKey)}
                    className="mt-2 p-1 hover:bg-black/5 rounded-full transition-colors"
                   >
                     <Volume2 className="w-4 h-4 text-primary" />
                   </button>
                )}
              </div>
            </motion.div>
          ))}

          {isThinking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-muted p-4 rounded-3xl rounded-bl-none flex items-center gap-2">
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-muted-foreground/30 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-muted-foreground/30 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-muted-foreground/30 rounded-full animate-bounce"></span>
                </span>
                <span className="text-xs text-muted-foreground italic">Thinking of an excuse...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-indigo-50/50">
          <div className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <Input
                placeholder="Ask me to do something (I won't)..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend(inputValue)}
                className="pr-12 h-14 bg-muted/50 border-none rounded-2xl focus-visible:ring-primary/20 text-base"
              />
              <Button
                size="icon"
                onClick={() => handleSend(inputValue)}
                disabled={!inputValue.trim() || isThinking}
                className="absolute right-2 top-2 h-10 w-10 rounded-xl shadow-lg shadow-primary/20"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    onClick={isListening ? () => {} : startListening}
                    className={`h-14 w-14 rounded-2xl shadow-xl transition-all ${
                      isListening 
                        ? "bg-accent animate-pulse scale-110 shadow-accent/40" 
                        : "bg-white hover:bg-muted text-foreground border border-border shadow-indigo-100/50"
                    }`}
                  >
                    <Mic className={`w-6 h-6 ${isListening ? "text-white" : "text-primary"}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isListening ? "Listening..." : "Click to use Voice"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="mt-4 flex justify-center gap-4">
             <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
               <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
               Voice Input Active
             </div>
             <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
               <div className="w-2 h-2 rounded-full bg-amber-400"></div>
               Lazy Mode: ON
             </div>
          </div>
        </div>
      </Card>

      {/* Footer Info */}
      <footer className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          Built for those who believe in the power of "Kal Karenge" (We'll do it tomorrow)
        </p>
      </footer>
    </div>
  );
}
