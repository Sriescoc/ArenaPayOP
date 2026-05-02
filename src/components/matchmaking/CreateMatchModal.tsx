import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, AlertCircle, Swords, Info } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../Toast';
import type { GameDefinition } from '../../lib/firestore-types';

interface CreateMatchModalProps {
  game: GameDefinition;
  forcedMode?: string;
  onClose: () => void;
}

export function CreateMatchModal({ game, forcedMode, onClose }: CreateMatchModalProps) {
  const { userData, user } = useAuth();
  const { success, error: showError } = useToast();
  
  const [selectedMode, setSelectedMode] = useState<string | null>(forcedMode || null);
  const [targetAmount, setTargetAmount] = useState<number | ''>('');
  const [tolerance, setTolerance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showFlexInfo, setShowFlexInfo] = useState(false);

  const balance = userData?.balance || 0;

  const handleCreate = async () => {
    setErrorMsg(null);
    if (!user || !userData) return;
    if (!selectedMode) { setErrorMsg('Selecciona un modo de juego.'); return; }
    if (!targetAmount || targetAmount < 1000) { setErrorMsg('El monto mínimo es $1.000'); return; }
    if (targetAmount > balance) { setErrorMsg('No tienes saldo suficiente.'); return; }
    if (game.requiredId && !userData[game.requiredId]) { setErrorMsg(`Debes configurar tu ${game.idLabel} en tu Perfil.`); return; }

    setLoading(true);
    try {
      const minAmount = targetAmount - (targetAmount * (tolerance / 100));
      const maxAmount = targetAmount + (targetAmount * (tolerance / 100));

      await addDoc(collection(db, 'matchRequests'), {
        creatorId: user.uid,
        creatorName: userData.firstName,
        gameId: game.id,
        modeId: selectedMode,
        targetAmount,
        minAmount,
        maxAmount,
        status: 'open',
        createdAt: serverTimestamp()
      });

      success('Solicitud Creada', 'Tu reto ahora es público en el tablero.');
      onClose();
    } catch (err: any) {
      console.error(err);
      showError('Error', 'No se pudo crear la solicitud.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md"></motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-lg glass-panel glass-edge rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-white/10">
        
        {/* Header */}
        <div className="h-32 relative shrink-0">
          <img src={game.image} alt={game.name} className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#051424] to-transparent"></div>
          <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center text-white"><X className="w-5 h-5" /></button>
          <div className="absolute bottom-3 left-6">
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">{game.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest">Crear Solicitud Pública</p>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto bg-surface">
          {/* Mode */}
          <div className="mb-6">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">Modo de Juego</label>
            <div className="grid grid-cols-2 gap-3">
              {game.modes.map(m => (
                <button key={m.id} onClick={() => setSelectedMode(m.id)} className={`py-3 rounded-xl border font-bold uppercase text-xs tracking-wider transition-all ${selectedMode === m.id ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 neon-glow' : 'border-white/10 text-slate-400 hover:bg-white/5 hover:border-white/20'}`}>
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div className="mb-6">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex justify-between">
              <span>Monto Deseado</span>
              <span className="text-emerald-400">Saldo: ${balance.toLocaleString('es-CL')}</span>
            </label>
            <div className="relative mb-3">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400 font-bold text-lg">$</span>
              <input type="number" min="1000" step="1000" value={targetAmount} onChange={e => setTargetAmount(e.target.value ? Number(e.target.value) : '')} placeholder="5000" className="w-full bg-surface-container-low border border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white font-black text-xl rounded-xl py-4 pl-8 pr-4 outline-none transition-all" />
            </div>
            
          {/* Tolerance */}
          <div className="bg-surface-container-low border border-white/10 p-4 rounded-xl relative">
             <div className="flex justify-between items-center mb-3">
               <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Tolerancia de Ofertas (Flexibilidad)</label>
               <button onClick={() => setShowFlexInfo(!showFlexInfo)} className="text-emerald-400 hover:text-emerald-300 transition-colors">
                 <Info className="w-4 h-4" />
               </button>
             </div>
             
             {showFlexInfo && (
               <div className="mb-4 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg text-xs text-slate-300">
                 <p className="font-bold text-emerald-400 mb-1">¿Qué es la flexibilidad?</p>
                 <p>Al crear una solicitud, otros jugadores te enviarán "ofertas" para jugar. La flexibilidad define cuánto dinero extra o de menos estás dispuesto a aceptar.</p>
                 <p className="mt-2 text-white font-bold italic">Ejemplo: Si buscas por $5.000 con 20% de flexibilidad, permitirás que otros te oferten desde $4.000 hasta $6.000.</p>
               </div>
             )}

             <input type="range" min="0" max="50" step="5" value={tolerance} onChange={e => setTolerance(Number(e.target.value))} className="w-full accent-emerald-500 mb-2" />
             <div className="flex justify-between text-xs text-slate-400 font-bold">
               <span>Exacto (0%)</span>
               <span>±{tolerance}%</span>
               <span>Flexible (50%)</span>
             </div>
             {targetAmount && targetAmount > 0 && (
               <p className="text-center text-xs mt-3 text-emerald-400/80">
                 Aceptarás retos entre <span className="font-bold text-emerald-400">${(targetAmount - (targetAmount * tolerance / 100)).toLocaleString('es-CL')}</span> y <span className="font-bold text-emerald-400">${(targetAmount + (targetAmount * tolerance / 100)).toLocaleString('es-CL')}</span>
               </p>
             )}
          </div>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-sm text-red-300 font-medium">{errorMsg}</p>
            </div>
          )}

          <button onClick={handleCreate} disabled={loading} className="w-full bg-emerald-500 text-slate-950 font-black uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-400 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/20 neon-glow">
            {loading ? 'Publicando...' : <><Swords className="w-5 h-5" /> Publicar Solicitud</>}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
