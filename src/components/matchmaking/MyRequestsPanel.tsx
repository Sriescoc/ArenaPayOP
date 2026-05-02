import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, writeBatch, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../Toast';
import { Swords, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { MatchRequest, MatchOffer } from '../../lib/firestore-types';

export function MyRequestsPanel() {
  const { user, userData } = useAuth();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();
  
  const [myRequests, setMyRequests] = useState<(MatchRequest & { offers: MatchOffer[] })[]>([]);

  useEffect(() => {
    if (!user) return;

    const qReqs = query(collection(db, 'matchRequests'), where('creatorId', '==', user.uid), where('status', '==', 'open'));
    
    const unsubscribe = onSnapshot(qReqs, async (snapshot) => {
      const requestsData: any[] = [];
      
      for (const docSnap of snapshot.docs) {
        const req = { id: docSnap.id, ...docSnap.data() };
        
        // Listen to offers for this request
        const offersQ = query(collection(db, `matchRequests/${docSnap.id}/offers`), where('status', '==', 'pending'));
        const offersSnapshot = await getDocs(offersQ); // Realtime ideally needs sub-listeners, using getDocs for simplicity here or setting up nested listeners.
        // Actually, to make it fully reactive, we should set up a snapshot listener for each request's offers.
        
        const offersData = offersSnapshot.docs.map(o => ({ id: o.id, ...o.data() }));
        requestsData.push({ ...req, offers: offersData });
      }
      setMyRequests(requestsData);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAcceptOffer = async (reqId: string, offer: MatchOffer) => {
    if (!user || !userData) return;
    try {
      const batch = writeBatch(db);
      
      // 1. Update Request
      batch.update(doc(db, 'matchRequests', reqId), { status: 'matched' });
      
      // 2. Update Offer
      batch.update(doc(db, `matchRequests/${reqId}/offers`, offer.id!), { status: 'accepted' });
      
      // 3. Create Active Match
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 2); // 2 hours strict timer
      
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

      // NOTE: In a real app, Escrow deduction should happen here via Cloud Function or Transaction to prevent double spending.
      // batch.update(doc(db, 'users', user.uid), { balance: increment(-offer.amount) });
      // batch.update(doc(db, 'users', offer.offererId), { balance: increment(-offer.amount) });

      await batch.commit();
      
      success('Oferta Aceptada', '¡Partida creada! Entrando a la sala privada...');
      navigate(`/match/${newMatchRef.id}`);
      
    } catch (err) {
      showError('Error', 'No se pudo aceptar la oferta.');
    }
  };

  const handleCancelRequest = async (reqId: string) => {
    try {
      await updateDoc(doc(db, 'matchRequests', reqId), { status: 'cancelled' });
      success('Solicitud Cancelada', 'Tu solicitud fue removida del tablero.');
    } catch (err) {
      showError('Error', 'No se pudo cancelar la solicitud.');
    }
  };

  if (myRequests.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className="font-headline-md text-xl text-emerald-400 italic font-black uppercase mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
        Tus Solicitudes Activas
      </h3>
      <div className="space-y-4">
        {myRequests.map(req => (
          <div key={req.id} className="glass-card rounded-2xl p-4 border border-emerald-500/30 bg-emerald-950/20">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/5">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Solicitud de {req.targetAmount.toLocaleString('es-CL')} CLP</span>
                <span className="text-[10px] text-slate-500">Juego: {req.gameId.toUpperCase()}</span>
              </div>
              <button onClick={() => handleCancelRequest(req.id!)} className="text-xs text-red-400 font-bold px-3 py-1 hover:bg-red-400/10 rounded-lg transition-colors">Cancelar</button>
            </div>
            
            {req.offers.length > 0 ? (
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Ofertas Recibidas ({req.offers.length})</p>
                {req.offers.map(offer => (
                  <div key={offer.id} className="bg-surface-container-low rounded-xl p-3 flex justify-between items-center border border-white/5">
                    <div>
                      <span className="text-sm font-bold text-white block">{offer.offererName}</span>
                      <span className="text-xs text-emerald-400 font-black">${offer.amount.toLocaleString('es-CL')}</span>
                    </div>
                    <button onClick={() => handleAcceptOffer(req.id!, offer)} className="bg-emerald-500 text-slate-950 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1 hover:bg-emerald-400 transition-colors">
                      <Check className="w-4 h-4" /> Aceptar
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-2 font-bold uppercase tracking-widest animate-pulse">Esperando ofertas...</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
