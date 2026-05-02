import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, writeBatch, serverTimestamp, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../Toast';
import { Swords, Check, MessageSquare, AlertCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { MatchRequest, MatchOffer, ActiveMatch } from '../../lib/firestore-types';

export function MyRequestsPanel() {
  const { user, userData } = useAuth();
  const { success, error: showError, info } = useToast();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'pending' | 'active'>('pending');
  const [myRequests, setMyRequests] = useState<(MatchRequest & { offers: MatchOffer[] })[]>([]);
  const [activeMatches, setActiveMatches] = useState<ActiveMatch[]>([]);

  useEffect(() => {
    if (!user) return;

    // Listen to open requests created by the user
    const qReqs = query(collection(db, 'matchRequests'), where('creatorId', '==', user.uid), where('status', '==', 'open'));
    
    const unsubscribeReqs = onSnapshot(qReqs, async (snapshot) => {
      const requestsData: any[] = [];
      for (const docSnap of snapshot.docs) {
        const req = { id: docSnap.id, ...docSnap.data() };
        const offersQ = query(collection(db, `matchRequests/${docSnap.id}/offers`), where('status', '==', 'pending'));
        const offersSnapshot = await getDocs(offersQ); 
        const offersData = offersSnapshot.docs.map(o => ({ id: o.id, ...o.data() }));
        requestsData.push({ ...req, offers: offersData });
      }
      setMyRequests(requestsData);
    });

    // Listen to active matches where user is player1 or player2
    const qActive1 = query(collection(db, 'activeMatches'), where('player1Id', '==', user.uid), where('status', '==', 'active'));
    const qActive2 = query(collection(db, 'activeMatches'), where('player2Id', '==', user.uid), where('status', '==', 'active'));
    
    const handleActiveMatches = () => {
      Promise.all([getDocs(qActive1), getDocs(qActive2)]).then(([snap1, snap2]) => {
        const matches = [...snap1.docs, ...snap2.docs].map(d => ({ id: d.id, ...d.data() } as ActiveMatch));
        // Remove duplicates if any (shouldn't be, but safe)
        const uniqueMatches = Array.from(new Map(matches.map(m => [m.id, m])).values());
        setActiveMatches(uniqueMatches);
      });
    };

    const unsubscribeActive1 = onSnapshot(qActive1, handleActiveMatches);
    const unsubscribeActive2 = onSnapshot(qActive2, handleActiveMatches);

    return () => { unsubscribeReqs(); unsubscribeActive1(); unsubscribeActive2(); };
  }, [user]);

  const handleAcceptOffer = async (reqId: string, offer: MatchOffer) => {
    if (!user || !userData) return;
    try {
      const batch = writeBatch(db);
      
      batch.update(doc(db, 'matchRequests', reqId), { status: 'matched' });
      batch.update(doc(db, `matchRequests/${reqId}/offers`, offer.id!), { status: 'accepted' });
      
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 2); 
      
      const newMatchRef = doc(collection(db, 'activeMatches'));
      batch.set(newMatchRef, {
        requestId: reqId,
        gameId: myRequests.find(r => r.id === reqId)?.gameId || '',
        modeId: myRequests.find(r => r.id === reqId)?.modeId || '',
        player1Id: user.uid,
        player1Name: userData.firstName,
        player2Id: offer.offererId,
        player2Name: offer.offererName,
        agreedAmount: offer.amount,
        status: 'active',
        expiresAt,
        createdAt: serverTimestamp(),
        player1Report: null,
        player2Report: null,
        winnerId: null
      });

      await batch.commit();
      
      success('Oferta Aceptada', '¡Partida creada! Entrando a la sala privada...');
      // Simulated Email notification
      info('Email Enviado', `Se ha notificado a ${offer.offererName} que has aceptado su oferta.`);
      
      navigate(`/match/${newMatchRef.id}`);
      
    } catch (err) {
      showError('Error', 'No se pudo aceptar la oferta.');
    }
  };

  const handleCancelRequest = async (reqId: string) => {
    try {
      await updateDoc(doc(db, 'matchRequests', reqId), { status: 'cancelled' });
      success('Solicitud Cancelada', 'Tu solicitud fue eliminada.');
    } catch (err) {
      showError('Error', 'No se pudo cancelar la solicitud.');
    }
  };

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-headline-lg text-2xl md:text-3xl text-white italic tracking-tighter font-black">MIS SOLICITUDES</h2>
        <div className="flex bg-surface-container-high rounded-lg p-1">
          <button onClick={() => setActiveTab('pending')} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${activeTab === 'pending' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}>
            En Progreso ({myRequests.length})
          </button>
          <button onClick={() => setActiveTab('active')} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${activeTab === 'active' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}>
            Activas ({activeMatches.length})
          </button>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 border border-white/5 min-h-[250px]">
        {activeTab === 'pending' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] text-emerald-400/70 font-bold uppercase tracking-widest mb-4 bg-emerald-500/10 p-2 rounded-lg">
              <Clock className="w-3 h-3" /> Las solicitudes sin aceptar se cancelarán automáticamente en 24 horas.
            </div>

            {myRequests.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">No tienes solicitudes buscando rival.</p>
              </div>
            ) : (
              myRequests.map(req => (
                <div key={req.id} className="bg-surface-container-low rounded-xl p-4 border border-white/5">
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/5">
                    <div>
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">Buscas apostar: ${req.targetAmount.toLocaleString('es-CL')}</span>
                      <span className="text-[10px] text-slate-500 uppercase">{req.gameId} - {req.modeId}</span>
                    </div>
                    <button onClick={() => handleCancelRequest(req.id!)} className="text-[10px] text-red-400 font-bold px-3 py-1.5 hover:bg-red-400/10 rounded-lg border border-red-500/20 uppercase tracking-wider transition-colors">Cancelar</button>
                  </div>
                  
                  {req.offers.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Ofertas Recibidas ({req.offers.length})</p>
                      {req.offers.map(offer => (
                        <div key={offer.id} className="bg-surface-container p-3 rounded-xl flex justify-between items-center border border-white/5">
                          <div>
                            <span className="text-sm font-bold text-white block">{offer.offererName}</span>
                            <span className="text-xs text-emerald-400 font-black">${offer.amount.toLocaleString('es-CL')}</span>
                          </div>
                          <button onClick={() => handleAcceptOffer(req.id!, offer)} className="bg-emerald-500 text-slate-950 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1 hover:bg-emerald-400 neon-glow transition-colors">
                            <Check className="w-4 h-4" /> Aceptar
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 text-center py-4 font-bold uppercase tracking-widest animate-pulse flex items-center justify-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span> Esperando retadores...
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'active' && (
          <div className="space-y-4">
            {activeMatches.length === 0 ? (
              <div className="text-center py-8">
                <Swords className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">No tienes partidas en curso.</p>
              </div>
            ) : (
              activeMatches.map(match => {
                const opponentName = match.player1Id === user?.uid ? match.player2Name : match.player1Name;
                return (
                  <div key={match.id} className="bg-surface-container-low rounded-xl p-4 border border-emerald-500/30 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Sala Privada
                      </span>
                      <p className="text-white font-bold text-sm mb-1">vs {opponentName}</p>
                      <p className="text-[10px] text-slate-400 uppercase">Premio: ${(match.agreedAmount * 2 * 0.9).toLocaleString('es-CL')} | {match.gameId}</p>
                    </div>
                    <button onClick={() => navigate(`/match/${match.id}`)} className="bg-surface-container-high hover:bg-white/10 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border border-white/10 transition-colors">
                      <MessageSquare className="w-4 h-4" /> Entrar al Chat
                    </button>
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
