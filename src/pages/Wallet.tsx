import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { doc, getDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Wallet as WalletIcon, ArrowDownToLine, ArrowUpFromLine, AlertCircle, CheckCircle2, Clock, Swords, Trophy } from 'lucide-react';
import { motion } from 'motion/react';

export default function Wallet() {
  const [balance, setBalance] = useState(0);
  const [withdrawableBalance, setWithdrawableBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [kycStatus, setKycStatus] = useState('unverified');
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        // Fetch User Data
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setBalance(data.balance || 0);
          setWithdrawableBalance(data.withdrawableBalance || 0);
          setKycStatus(data.kycStatus || 'unverified');
        }

        // Fetch Transactions
        try {
          const txQuery = query(
            collection(db, 'transactions'),
            where('userId', '==', auth.currentUser.uid),
            // Note: orderBy requires a composite index if used with where on a different field, 
            // but we might not have it. For now let's just fetch and sort locally if needed, 
            // but usually we can do this if we create the index. We will sort locally to avoid index errors.
          );
          const txSnap = await getDocs(txQuery);
          let txs = txSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
          txs.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
          setTransactions(txs);
        } catch (error) {
          console.error("Error fetching transactions", error);
        }
        
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout balance={0}>
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-[#00ff66] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowDownToLine className="w-4 h-4 text-[#00ff66]" />;
      case 'withdrawal': return <ArrowUpFromLine className="w-4 h-4 text-slate-400" />;
      case 'bet': return <Swords className="w-4 h-4 text-red-400" />;
      case 'win': return <Trophy className="w-4 h-4 text-yellow-400" />;
      default: return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getTransactionColor = (amount: number, type: string) => {
    if (type === 'deposit' || type === 'win') return 'text-[#00ff66]';
    return 'text-white';
  };

  return (
    <DashboardLayout balance={balance}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">Mi Billetera</h1>
          <p className="text-slate-400 mt-1">Gestiona tus fondos y retira tus ganancias</p>
        </div>

        {/* Balances Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Total Balance */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#131b26] border border-[#1f2937] rounded-2xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff66]/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="w-10 h-10 bg-[#00ff66]/10 rounded-lg flex items-center justify-center">
                <WalletIcon className="w-5 h-5 text-[#00ff66]" />
              </div>
              <h2 className="text-slate-400 font-bold uppercase tracking-wider text-sm">Saldo Total</h2>
            </div>
            <div className="relative z-10">
              <span className="text-4xl font-black text-white">${balance.toLocaleString('es-CL')}</span>
              <span className="text-slate-500 ml-2 font-bold">CLP</span>
            </div>
            <p className="text-xs text-slate-500 mt-4 relative z-10">
              Incluye depósitos recientes y ganancias.
            </p>
          </motion.div>

          {/* Withdrawable Balance */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#131b26] border border-[#1f2937] rounded-2xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00e1ff]/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="w-10 h-10 bg-[#00e1ff]/10 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-[#00e1ff]" />
              </div>
              <h2 className="text-slate-400 font-bold uppercase tracking-wider text-sm">Disponible para Retirar</h2>
            </div>
            <div className="relative z-10">
              <span className="text-4xl font-black text-white">${withdrawableBalance.toLocaleString('es-CL')}</span>
              <span className="text-slate-500 ml-2 font-bold">CLP</span>
            </div>
            <p className="text-xs text-slate-500 mt-4 relative z-10">
              Fondos liberados tras jugar partidas (Rollover 1x).
            </p>
          </motion.div>
        </div>

        {/* Actions */}
        <div className="grid sm:grid-cols-2 gap-4 mt-8">
          <button 
            onClick={() => alert("Módulo de depósitos en construcción. Pronto integraremos Webpay/Flow.")}
            className="bg-[#00ff66] hover:bg-[#00cc55] text-black font-black uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,255,102,0.2)] hover:shadow-[0_0_30px_rgba(0,255,102,0.4)] hover:-translate-y-1"
          >
            <ArrowDownToLine className="w-5 h-5" /> Depositar Fondos
          </button>

          <button 
            onClick={() => {
              if (kycStatus !== 'verified') {
                alert("Debes verificar tu identidad (RUT) en tu Perfil antes de poder retirar fondos.");
              } else if (withdrawableBalance < 5000) {
                alert("El monto mínimo de retiro es de $5.000 CLP.");
              } else {
                alert("Módulo de retiros en construcción.");
              }
            }}
            className="bg-[#1f2937] hover:bg-[#374151] text-white font-black uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 transition-all border border-white/5 hover:border-white/10"
          >
            <ArrowUpFromLine className="w-5 h-5" /> Retirar Ganancias
          </button>
        </div>

        {/* Info Banner */}
        <div className="mt-8 bg-[#0a0e17] border border-[#1f2937] rounded-xl p-5 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-[#00e1ff] shrink-0 mt-0.5" />
          <div>
            <h3 className="text-white font-bold mb-1">¿Por qué mi saldo disponible es menor al total?</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Para prevenir el lavado de dinero y cumplir con las normativas, todo depósito debe ser jugado al menos una vez antes de poder ser retirado. Las ganancias de tus partidas ganadas se suman automáticamente a tu saldo disponible para retirar.
            </p>
          </div>
        </div>

        {/* Transaction History */}
        <div className="mt-12">
          <h2 className="text-xl font-black text-white uppercase tracking-wider mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#00ff66]" /> Historial de Transacciones
          </h2>
          
          <div className="bg-[#131b26] border border-[#1f2937] rounded-2xl overflow-hidden">
            {transactions.length > 0 ? (
              <div className="divide-y divide-[#1f2937]">
                {transactions.map((tx) => (
                  <div key={tx.id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-[#1a242d] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#0a0e17] border border-[#1f2937] flex items-center justify-center shrink-0">
                        {getTransactionIcon(tx.type)}
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm sm:text-base">{tx.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500">
                            {tx.createdAt 
                              ? new Date(tx.createdAt.toDate ? tx.createdAt.toDate() : tx.createdAt).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
                              : 'Reciente'}
                          </span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            tx.status === 'completed' ? 'bg-[#00ff66]/10 text-[#00ff66]' : 'bg-yellow-500/10 text-yellow-500'
                          }`}>
                            {tx.status === 'completed' ? 'Completado' : 'Pendiente'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className={`font-black ${getTransactionColor(tx.amount, tx.type)}`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('es-CL')}
                      </p>
                      <p className="text-xs text-slate-500 font-bold">CLP</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-[#0a0e17] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#1f2937]">
                  <Clock className="w-8 h-8 text-slate-600" />
                </div>
                <p className="text-slate-400 font-medium">Aún no ha habido ninguna transacción.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
