import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot, collection, query, orderBy, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { DashboardLayout } from '../components/DashboardLayout';
import { Swords, Send, ShieldAlert, CheckCircle, Clock } from 'lucide-react';
import { GAME_DEFINITIONS } from '../lib/firestore-types';
import type { ActiveMatch } from '../lib/firestore-types';

export default function ActiveMatchRoom() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const { info, error: showError, success } = useToast();

  const [match, setMatch] = useState<ActiveMatch | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState<string>('--:--:--');

  useEffect(() => {
    if (!id) return;
    
    const unsubscribeMatch = onSnapshot(doc(db, 'activeMatches', id), (docSnap) => {
      if (docSnap.exists()) {
        setMatch({ id: docSnap.id, ...docSnap.data() } as ActiveMatch);
      } else {
        showError('Error', 'La sala no existe o ha sido cerrada.');
        navigate('/dashboard');
      }
    });

    const q = query(collection(db, `activeMatches/${id}/messages`), orderBy('createdAt', 'asc'));
    const unsubscribeMessages = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { unsubscribeMatch(); unsubscribeMessages(); };
  }, [id, navigate, showError]);

  useEffect(() => {
    if (!match?.expiresAt) return;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiry = match.expiresAt.toDate().getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft('00:00:00');
        clearInterval(interval);
      } else {
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [match?.expiresAt]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !id) return;
    try {
      await addDoc(collection(db, `activeMatches/${id}/messages`), {
        senderId: user.uid,
        senderName: userData?.firstName || 'Jugador',
        text: newMessage,
        createdAt: serverTimestamp()
      });
      setNewMessage('');
    } catch (err) {
      showError('Error', 'No se pudo enviar el mensaje.');
    }
  };

  const handleReport = async (result: 'win' | 'loss') => {
    if (!match || !user || !id) return;
    try {
      const isPlayer1 = user.uid === match.player1Id;
      const updateData = isPlayer1 ? { player1Report: result } : { player2Report: result };
      
      // In a real app with Cloud Functions, this update would trigger a function
      // that verifies if both reported the same thing and distributes the money.
      // For now, we just save the report.
      await updateDoc(doc(db, 'activeMatches', id), updateData);
      success('Reporte Enviado', `Has reportado que has ${result === 'win' ? 'ganado' : 'perdido'}. Esperando confirmación del rival.`);
    } catch (err) {
      showError('Error', 'No se pudo enviar el reporte.');
    }
  };

  if (!match) return <DashboardLayout><div className="flex items-center justify-center h-full text-white animate-pulse">Cargando sala segura...</div></DashboardLayout>;

  const game = GAME_DEFINITIONS.find(g => g.id === match.gameId);
  const isPlayer1 = user?.uid === match.player1Id;
  const isPlayer2 = user?.uid === match.player2Id;
  const opponentName = isPlayer1 ? match.player2Name : match.player1Name;
  const myReport = isPlayer1 ? match.player1Report : match.player2Report;
  
  const totalPrize = (match.agreedAmount * 2) * 0.9;

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
        
        {/* Info Column */}
        <div className="lg:col-span-1 space-y-4 overflow-y-auto">
          <div className="glass-card rounded-2xl p-6 border border-emerald-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full"></div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <h2 className="text-white font-black uppercase italic tracking-widest text-lg">Sala Activa</h2>
            </div>
            
            <div className="flex justify-between items-end mb-6 border-b border-white/5 pb-4">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Juego</span>
                <p className="text-white font-bold">{game?.name} - {match.modeId.toUpperCase()}</p>
              </div>
              <img src={game?.image} alt="game" className="w-12 h-12 rounded-lg object-cover opacity-80" />
            </div>

            <div className="bg-surface-container-low rounded-xl p-4 mb-6 border border-white/5 text-center">
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Pozo en Disputa</span>
               <span className="text-3xl font-black text-emerald-400 italic">${totalPrize.toLocaleString('es-CL')}</span>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
               <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest block flex justify-center items-center gap-1 mb-1"><Clock className="w-3 h-3" /> Tiempo Restante</span>
               <span className="text-2xl font-black text-red-400 font-mono tracking-widest">{timeLeft}</span>
               <p className="text-[9px] text-red-300/70 mt-2">Deben terminar y reportar antes de que el tiempo acabe.</p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Resolución</h3>
            {!myReport ? (
              <div className="space-y-3">
                <button onClick={() => handleReport('win')} className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-black uppercase tracking-widest text-sm transition-all shadow-lg shadow-emerald-500/20 neon-glow flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Reportar Victoria
                </button>
                <button onClick={() => handleReport('loss')} className="w-full py-4 glass-card hover:bg-white/5 text-slate-300 rounded-xl font-bold uppercase tracking-widest text-sm transition-all border border-white/10">
                  Reportar Derrota
                </button>
              </div>
            ) : (
              <div className="bg-surface-container-low border border-white/5 p-4 rounded-xl text-center">
                 <ShieldAlert className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                 <p className="text-sm text-white font-bold">Has reportado: <span className="uppercase text-emerald-400">{myReport === 'win' ? 'Victoria' : 'Derrota'}</span></p>
                 <p className="text-[10px] text-slate-400 mt-1">Esperando al oponente o revisión del sistema.</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Column */}
        <div className="lg:col-span-2 glass-card rounded-2xl border border-white/5 flex flex-col overflow-hidden relative">
          {/* Chat Header */}
          <div className="h-16 bg-surface-container-high border-b border-white/5 flex items-center px-6 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="font-bold text-white text-sm">Chat Privado con <span className="text-emerald-400">{opponentName}</span></span>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col">
            {messages.length === 0 && (
              <div className="m-auto text-center">
                 <Swords className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                 <p className="text-sm text-slate-500 font-bold">Sala creada. Pónganse de acuerdo y añádanse en el juego.</p>
              </div>
            )}
            {messages.map((msg, i) => {
              const isMe = msg.senderId === user?.uid;
              return (
                <div key={msg.id || i} className={`max-w-[70%] ${isMe ? 'self-end' : 'self-start'}`}>
                  <span className={`text-[10px] font-bold mb-1 block ${isMe ? 'text-right text-emerald-500' : 'text-left text-slate-500'}`}>{isMe ? 'Tú' : msg.senderName}</span>
                  <div className={`p-3 rounded-2xl text-sm ${isMe ? 'bg-emerald-500 text-slate-950 rounded-tr-sm' : 'bg-surface-container-low text-white border border-white/5 rounded-tl-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-surface-container-high border-t border-white/5 shrink-0">
            <form onSubmit={handleSendMessage} className="flex gap-2 relative">
              <input 
                type="text" 
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Escribe un mensaje..." 
                className="flex-1 bg-surface-container-low border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
              <button type="submit" disabled={!newMessage.trim()} className="bg-emerald-500 disabled:opacity-50 disabled:bg-slate-700 hover:bg-emerald-400 text-slate-950 w-12 rounded-xl flex items-center justify-center transition-colors">
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
