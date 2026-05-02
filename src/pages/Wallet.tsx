import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { Wallet as WalletIcon, ArrowDownToLine, ArrowUpFromLine, AlertCircle, CheckCircle2, Clock, Swords, Trophy } from 'lucide-react';
import { motion } from 'motion/react';

export default function Wallet() {
  const { userData } = useAuth();
  const { info, warning } = useToast();
  const balance = userData?.balance || 0;
  const withdrawableBalance = userData?.withdrawableBalance || 0;
  const kycStatus = userData?.kycStatus || 'unverified';
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      if (auth.currentUser) {
        try {
          const snap = await getDocs(query(collection(db, 'transactions'), where('userId', '==', auth.currentUser.uid)));
          let txs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          txs.sort((a: any, b: any) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
          setTransactions(txs);
        } catch (e) { console.error(e); }
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const txIcon = (type: string) => {
    if (type === 'deposit') return <ArrowDownToLine className="w-4 h-4 text-[#00ff66]" />;
    if (type === 'withdrawal') return <ArrowUpFromLine className="w-4 h-4 text-slate-400" />;
    if (type === 'bet' || type === 'tournament_entry') return <Swords className="w-4 h-4 text-red-400" />;
    if (type === 'win' || type === 'tournament_prize') return <Trophy className="w-4 h-4 text-yellow-400" />;
    return <Clock className="w-4 h-4 text-slate-400" />;
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-black text-white uppercase tracking-wider flex items-center gap-3">
          <div className="w-1 h-8 bg-[#00ff66] rounded-full"></div> Billetera
        </h1>

        <div className="grid md:grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#16213e] border border-[#0f3460]/50 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff66]/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="w-10 h-10 bg-[#00ff66]/10 rounded-lg flex items-center justify-center"><WalletIcon className="w-5 h-5 text-[#00ff66]" /></div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Saldo Total</span>
            </div>
            <span className="text-4xl font-black text-white relative z-10">${balance.toLocaleString('es-CL')}</span>
            <span className="text-slate-500 ml-2 font-bold">CLP</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#16213e] border border-[#0f3460]/50 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-blue-400" /></div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Disponible para Retirar</span>
            </div>
            <span className="text-4xl font-black text-white relative z-10">${withdrawableBalance.toLocaleString('es-CL')}</span>
            <span className="text-slate-500 ml-2 font-bold">CLP</span>
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <button onClick={() => info('En construcción', 'Pronto integraremos pagos para depósitos.')} className="bg-[#00ff66] hover:bg-[#00cc55] text-black font-black uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,255,102,0.3)] hover:-translate-y-1">
            <ArrowDownToLine className="w-5 h-5" /> Depositar
          </button>
          <button onClick={() => {
            if (kycStatus !== 'verified') warning('Verificación requerida', 'Verifica tu identidad en Cuenta.');
            else if (withdrawableBalance < 5000) warning('Mínimo no alcanzado', 'El retiro mínimo es $5.000 CLP.');
            else info('En construcción', 'Pronto podrás retirar a tu cuenta bancaria.');
          }} className="bg-[#0f3460] hover:bg-[#1a3a6b] text-white font-black uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 transition-all border border-[#0f3460]">
            <ArrowUpFromLine className="w-5 h-5" /> Retirar
          </button>
        </div>

        <div className="bg-[#0a0e17] border border-[#0f3460]/50 rounded-xl p-5 flex items-start gap-4">
          <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-white font-bold text-sm mb-1">Sobre tu saldo disponible</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Todo depósito debe ser jugado al menos 1 vez antes de ser retirado. Tus ganancias se suman al saldo disponible automáticamente.</p>
          </div>
        </div>

        {/* Transactions */}
        <div className="mt-8">
          <h2 className="text-lg font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-[#00ff66]" /> Historial</h2>
          <div className="bg-[#16213e] border border-[#0f3460]/50 rounded-2xl overflow-hidden">
            {loading ? (
              <div className="divide-y divide-[#0f3460]/30">
                {[1,2,3].map(i => <div key={i} className="p-5 flex items-center justify-between animate-pulse"><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-[#0f3460]"></div><div className="space-y-2"><div className="h-4 w-32 bg-[#0f3460] rounded"></div><div className="h-3 w-20 bg-[#0f3460] rounded"></div></div></div><div className="h-5 w-16 bg-[#0f3460] rounded"></div></div>)}
              </div>
            ) : transactions.length > 0 ? (
              <div className="divide-y divide-[#0f3460]/30">
                {transactions.map((tx: any) => (
                  <div key={tx.id} className="p-5 flex items-center justify-between hover:bg-[#0f3460]/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#0a0e17] border border-[#0f3460] flex items-center justify-center">{txIcon(tx.type)}</div>
                      <div>
                        <p className="text-white font-bold text-sm">{tx.description}</p>
                        <p className="text-xs text-slate-500">{tx.createdAt ? new Date(tx.createdAt.toDate?.() || tx.createdAt).toLocaleDateString('es-CL') : 'Reciente'}</p>
                      </div>
                    </div>
                    <p className={`font-black ${['deposit','win','tournament_prize','refund'].includes(tx.type) ? 'text-[#00ff66]' : 'text-white'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount?.toLocaleString('es-CL')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center">
                <Clock className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 font-medium">Sin transacciones aún.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
