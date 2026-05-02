import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, AlertCircle, Handshake } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../Toast';
import { GAME_DEFINITIONS } from '../../lib/firestore-types';
import type { MatchRequest } from '../../lib/firestore-types';

interface MakeOfferModalProps {
  request: MatchRequest;
  onClose: () => void;
}

export function MakeOfferModal({ request, onClose }: MakeOfferModalProps) {
  const { userData, user } = useAuth();
  const { success, error: showError } = useToast();
  
  const game = GAME_DEFINITIONS.find(g => g.id === request.gameId);
  const mode = game?.modes.find(m => m.id === request.modeId);
  
  const [offerAmount, setOfferAmount] = useState<number | ''>(request.targetAmount);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const balance = userData?.balance || 0;

  const handleMakeOffer = async () => {
    setErrorMsg(null);
    if (!user || !userData) return;
    if (!offerAmount || offerAmount < request.minAmount || offerAmount > request.maxAmount) { 
      setErrorMsg(`Tu oferta debe estar entre $${request.minAmount.toLocaleString('es-CL')} y $${request.maxAmount.toLocaleString('es-CL')}`); 
      return; 
    }
    if (offerAmount > balance) { setErrorMsg('No tienes saldo suficiente.'); return; }
    if (game?.requiredId && !userData[game.requiredId]) { setErrorMsg(`Debes configurar tu ${game.idLabel} en tu Perfil.`); return; }

    setLoading(true);
    try {
      await addDoc(collection(db, `matchRequests/${request.id}/offers`), {
        requestId: request.id,
        offererId: user.uid,
        offererName: userData.firstName,
        amount: offerAmount,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      success('Oferta Enviada', 'El creador de la solicitud ha sido notificado.');
      onClose();
    } catch (err: any) {
      console.error(err);
      showError('Error', 'No se pudo enviar la oferta.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md"></motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-lg glass-panel glass-edge rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-white/10">
        
        {/* Header */}
        <div className="h-32 relative shrink-0">
          <img src={game?.image || ''} alt={game?.name || 'Game'} className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#051424] to-transparent"></div>
          <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center text-white"><X className="w-5 h-5" /></button>
          <div className="absolute bottom-3 left-6">
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">Retar a {request.creatorName}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest">{game?.name} - {mode?.name}</p>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto bg-surface">
          {/* Amount */}
          <div className="mb-6">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex justify-between">
              <span>Tu Oferta Económica</span>
              <span className="text-emerald-400">Saldo: ${balance.toLocaleString('es-CL')}</span>
            </label>
            <div className="relative mb-3">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400 font-bold text-lg">$</span>
              <input type="number" min={request.minAmount} max={request.maxAmount} step="1000" value={offerAmount} onChange={e => setOfferAmount(e.target.value ? Number(e.target.value) : '')} className="w-full bg-surface-container-low border border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white font-black text-xl rounded-xl py-4 pl-8 pr-4 outline-none transition-all" />
            </div>
            
            <div className="bg-surface-container-low border border-white/10 p-4 rounded-xl flex items-center justify-between text-xs font-bold">
               <span className="text-slate-400 uppercase">Rango Aceptado:</span>
               <span className="text-emerald-400">${request.minAmount.toLocaleString('es-CL')} - ${request.maxAmount.toLocaleString('es-CL')}</span>
            </div>
          </div>

          {/* Winnings Preview */}
          {offerAmount && offerAmount >= request.minAmount && offerAmount <= request.maxAmount && (
             <div className="mb-6 bg-surface-container-low border border-white/10 rounded-xl p-4 space-y-2">
               <div className="flex justify-between text-sm"><span className="text-slate-400 font-medium">Pozo Total Acumulado</span><span className="text-white font-bold">${(Number(offerAmount) * 2).toLocaleString('es-CL')}</span></div>
               <div className="flex justify-between text-sm"><span className="text-slate-400 font-medium">Comisión de Plataforma</span><span className="text-red-400 font-bold">-${(Number(offerAmount) * 0.2).toLocaleString('es-CL')}</span></div>
               <div className="pt-2 border-t border-white/10 flex justify-between items-center"><span className="text-emerald-400 font-black uppercase tracking-widest text-xs">Si Ganas, Recibes</span><span className="text-xl text-emerald-400 font-black">${((Number(offerAmount) * 2) * 0.9).toLocaleString('es-CL')}</span></div>
             </div>
          )}

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-300 font-medium">{errorMsg}</p>
            </div>
          )}

          <button onClick={handleMakeOffer} disabled={loading} className="w-full bg-emerald-500 text-slate-950 font-black uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-400 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/20 neon-glow">
            {loading ? 'Enviando...' : <><Handshake className="w-5 h-5" /> Enviar Oferta</>}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
