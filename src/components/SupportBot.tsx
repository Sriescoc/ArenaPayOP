import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, User, Bot, Headset, ExternalLink, Minimize2, Maximize2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { auth, db } from '../lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export function SupportBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!auth.currentUser || !isOpen) return;

    const messagesRef = collection(db, 'support_threads', auth.currentUser.uid, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !auth.currentUser) return;

    const userText = inputText.trim();
    setInputText('');
    
    // Save user message to Firestore
    const messagesRef = collection(db, 'support_threads', auth.currentUser.uid, 'messages');
    await addDoc(messagesRef, {
      text: userText,
      sender: 'user',
      timestamp: serverTimestamp()
    });

    setIsTyping(true);

    try {
      // Get AI response
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: "Eres el asistente oficial de ArenaPay, una plataforma de apuestas de eSports en Chile. Tu tono es profesional, competitivo y servicial. Ayuda con dudas sobre depósitos, retiros y juegos. Si el problema es complejo o financiero, ofrece contactar a un ejecutivo humano.",
        },
        contents: [...messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'model', parts: [{ text: m.text }] })), { role: 'user', parts: [{ text: userText }] }],
      });

      const botText = response.text || "Lo siento, no pude procesar tu solicitud. ¿Quieres hablar con un ejecutivo?";
      
      await addDoc(messagesRef, {
        text: botText,
        sender: 'bot',
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error("AI Error:", error);
      await addDoc(messagesRef, {
        text: "Hubo un error de conexión. Por favor reintenta o contacta a soporte directamente.",
        sender: 'bot',
        timestamp: serverTimestamp()
      });
    } finally {
      setIsTyping(false);
    }
  };

  const contactExecutive = async () => {
    if (!auth.currentUser) return;
    const messagesRef = collection(db, 'support_threads', auth.currentUser.uid, 'messages');
    await addDoc(messagesRef, {
      text: "🚨 Solicitud de Ejecutivo: El usuario requiere atención humana para un problema crítico.",
      sender: 'user',
      timestamp: serverTimestamp()
    });
    
    await addDoc(messagesRef, {
      text: "Entiendo. He escalado tu caso a un ejecutivo humano. Te contactarán por este chat o vía email en breve. Saludos, Soporte ArenaPay.",
      sender: 'executive',
      timestamp: serverTimestamp()
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200]">
      <AnimatePresence>
        {!isOpen ? (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 bg-brand-primary text-black rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,255,102,0.4)] hover:scale-110 active:scale-95 transition-all group"
          >
            <MessageSquare className="w-8 h-8 group-hover:rotate-12 transition-transform" />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-4 border-navy-950 animate-pulse"></div>
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={`bg-navy-900 border border-navy-700 shadow-2xl rounded-[2rem] overflow-hidden flex flex-col transition-all duration-300 ${isMinimized ? 'h-20 w-72' : 'h-[600px] w-[400px] max-w-[calc(100vw-3rem)]'}`}
          >
            {/* Header */}
            <div className="p-5 bg-navy-800 border-b border-navy-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <h3 className="text-white font-black uppercase tracking-widest text-xs font-display">ArenaBot</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-pulse"></div>
                    <span className="text-[10px] text-brand-primary font-bold uppercase tracking-widest">En Línea</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 hover:bg-navy-700 rounded-lg text-slate-400 transition-colors">
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-navy-700 rounded-lg text-slate-400 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth">
                  {messages.length === 0 && (
                    <div className="text-center py-10">
                      <div className="w-16 h-16 bg-navy-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-navy-700">
                        <Headset className="w-8 h-8 text-slate-500" />
                      </div>
                      <p className="text-slate-400 font-medium px-10">¡Hola! Soy tu asistente de ArenaPay. ¿En qué puedo ayudarte hoy?</p>
                    </div>
                  )}
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl p-4 text-sm ${
                        msg.sender === 'user' 
                          ? 'bg-brand-primary text-black font-medium' 
                          : msg.sender === 'executive' 
                            ? 'bg-navy-800 border border-brand-primary/30 text-white'
                            : 'bg-navy-800 border border-navy-700 text-slate-200'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-navy-800 border border-navy-700 rounded-2xl p-4 flex gap-1.5">
                        <div className="w-1.5 h-1.5 bg-brand-primary/50 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-brand-primary/50 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        <div className="w-1.5 h-1.5 bg-brand-primary/50 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="px-6 pb-2 flex flex-wrap gap-2">
                  <button onClick={contactExecutive} className="text-[10px] font-black uppercase tracking-widest py-1.5 px-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all flex items-center gap-1.5">
                    <Headset className="w-3 h-3" /> Hablar con Ejecutivo
                  </button>
                  <button onClick={() => setInputText("¿Cómo retiro mi saldo?")} className="text-[10px] font-black uppercase tracking-widest py-1.5 px-3 bg-navy-800 text-slate-400 border border-navy-700 rounded-lg hover:border-brand-primary/30 transition-all">
                    Retiros
                  </button>
                  <button onClick={() => setInputText("¿Es seguro apostar aquí?")} className="text-[10px] font-black uppercase tracking-widest py-1.5 px-3 bg-navy-800 text-slate-400 border border-navy-700 rounded-lg hover:border-brand-primary/30 transition-all">
                    Seguridad
                  </button>
                </div>

                {/* Input */}
                <form onSubmit={sendMessage} className="p-6 bg-navy-900 border-t border-navy-700">
                  <div className="relative group">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Escribe tu mensaje..."
                      className="w-full bg-navy-800 border-2 border-navy-700 focus:border-brand-primary text-white text-sm rounded-2xl py-4 pl-5 pr-14 outline-none transition-all placeholder:text-slate-600"
                    />
                    <button
                      type="submit"
                      disabled={!inputText.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-primary text-black rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
