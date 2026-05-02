import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { Swords, Clock } from 'lucide-react';
import { GAME_DEFINITIONS } from '../../lib/firestore-types';
import type { MatchRequest } from '../../lib/firestore-types';

interface MatchFeedProps {
  onChallenge: (request: MatchRequest) => void;
}

export function MatchFeed({ onChallenge }: MatchFeedProps) {
  const { user } = useAuth();
  const [requests, setRequests] = useState<MatchRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'matchRequests'),
      where('status', '==', 'open'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reqs: MatchRequest[] = [];
      snapshot.forEach(doc => {
        reqs.push({ id: doc.id, ...doc.data() } as MatchRequest);
      });
      setRequests(reqs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-slate-500 animate-pulse">Cargando solicitudes públicas...</div>;
  }

  if (requests.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center border border-white/5">
        <Swords className="w-12 h-12 text-slate-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Sin Solicitudes Activas</h3>
        <p className="text-slate-400 text-sm max-w-md mx-auto">Actualmente no hay jugadores buscando rival. ¡Sé el primero en crear una solicitud de partida desde las categorías de arriba!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map(req => {
        const game = GAME_DEFINITIONS.find(g => g.id === req.gameId);
        const isOwnRequest = user?.uid === req.creatorId;

        return (
          <div key={req.id} className="glass-card rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-6 group hover:border-emerald-500/30 transition-all duration-300">
            <div className="flex-1 flex justify-between items-center w-full">
              
              {/* Creator Info */}
              <div className="flex flex-col items-center md:items-start gap-1 w-1/3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-10 h-10 rounded-full bg-surface-container border border-white/10 flex items-center justify-center overflow-hidden">
                    {game ? <img src={game.image} className="w-full h-full object-cover opacity-60" alt={game.name} /> : <Swords className="text-slate-500" />}
                  </div>
                  <div className="hidden md:block">
                    <span className="text-xs text-slate-500 font-bold block uppercase">{game?.name}</span>
                    <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-slate-300">{req.modeId.toUpperCase()}</span>
                  </div>
                </div>
                <span className="font-bold text-white text-sm md:text-base text-center md:text-left truncate w-full">{req.creatorName}</span>
              </div>

              {/* Status/Time (Center) */}
              <div className="flex flex-col items-center gap-2 w-1/3 text-center">
                 <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Buscando
                 </div>
                 <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold">
                    <Clock className="w-3 h-3" /> Hace un momento
                 </div>
              </div>

              {/* Amount Range */}
              <div className="flex flex-col items-center md:items-end gap-1 w-1/3">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest text-center md:text-right">Busca jugar por</span>
                <span className="font-odds-display text-lg md:text-2xl font-black text-emerald-400 leading-none">
                  ${req.targetAmount.toLocaleString('es-CL')}
                </span>
                {req.minAmount !== req.maxAmount && (
                  <span className="text-[10px] text-slate-500">
                    Flex: ${req.minAmount.toLocaleString('es-CL')} - ${req.maxAmount.toLocaleString('es-CL')}
                  </span>
                )}
              </div>
            </div>

            {/* Action */}
            <div className="w-full md:w-auto">
              <button 
                onClick={() => !isOwnRequest && onChallenge(req)}
                disabled={isOwnRequest}
                className={`w-full md:w-auto px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg ${isOwnRequest ? 'bg-surface-container-high text-slate-500 cursor-not-allowed border border-white/5' : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 hover:-translate-y-0.5 shadow-emerald-500/20 neon-glow'}`}
              >
                {isOwnRequest ? 'Tu Solicitud' : 'Lanzar Oferta'}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  );
}
