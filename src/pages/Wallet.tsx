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
          <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowDownToLine className="w-4 h-4 text-brand-primary" />;
      case 'withdrawal': return <ArrowUpFromLine className="w-4 h-4 text-slate-400" />;
      case 'bet': return <Swords className="w-4 h-4 text-red-400" />;
      case 'win': return <Trophy className="w-4 h-4 text-yellow-400" />;
      default: return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getTransactionColor = (amount: number, type: string) => {
    if (type === 'deposit' || type === 'win') return 'text-brand-primary';
    return 'text-white';
  };

  return (
    <DashboardLayout balance={balance}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight uppercase font-display">Mi Billetera</h1>
          <p className="text-slate-400 mt-1 font-medium">Gestiona tus fondos y retira tus ganancias</p>
        </div>

        {/* Balances Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Total Balance */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-navy-800 border border-navy-700 rounded-3xl p-8 relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                <WalletIcon className="w-6 h-6 text-brand-primary" />
              </div>
              <h2 className="text-slate-400 font-bold uppercase tracking-widest text-xs">Saldo Total</h2>
            </div>
            <div className="relative z-10 flex items-baseline gap-2">
              <span className="text-5xl font-black text-white font-display tracking-tighter">${balance.toLocaleString('es-CL')}</span>
              <span className="text-brand-primary font-black text-sm">CLP</span>
            </div>
            <p className="text-xs text-slate-500 mt-6 relative z-10 font-medium">
              Incluye depósitos recientes y ganancias acumuladas.
            </p>
          </motion.div>

          {/* Withdrawable Balance */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-navy-800 border border-navy-700 rounded-3xl p-8 relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-slate-400 font-bold uppercase tracking-widest text-xs">Disponible para Retirar</h2>
            </div>
            <div className="relative z-10 flex items-baseline gap-2">
              <span className="text-5xl font-black text-white font-display tracking-tighter">${withdrawableBalance.toLocaleString('es-CL')}</span>
              <span className="text-blue-400 font-black text-sm">CLP</span>
            </div>
            <p className="text-xs text-slate-500 mt-6 relative z-10 font-medium">
              Fondos liberados tras jugar partidas (Rollover 1x).
            </p>
          </motion.div>
        </div>

        {/* Actions */}
        <div className="grid sm:grid-cols-2 gap-4 mt-8">
          <button 
            onClick={() => alert("Módulo de depósitos en construcción. Pronto integraremos Webpay/Flow.")}
            className="bg-brand-primary hover:bg-brand-secondary text-black font-black uppercase tracking-widest py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_0_30px_rgba(0,255,102,0.2)] hover:shadow-[0_0_40px_rgba(0,255,102,0.4)] hover:-translate-y-1 font-display"
          >
            <ArrowDownToLine className="w-6 h-6" /> Depositar Fondos
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
            className="bg-navy-700 hover:bg-navy-600 text-white font-black uppercase tracking-widest py-5 rounded-2xl flex items-center justify-center gap-3 transition-all border border-white/5 hover:border-brand-primary/30 font-display"
          >
            <ArrowUpFromLine className="w-6 h-6" /> Retirar Ganancias
          </button>
        </div>

        {/* Info Banner */}
        <div className="mt-8 bg-navy-900 border border-navy-700 rounded-2xl p-6 flex items-start gap-5 shadow-inner">
          <AlertCircle className="w-6 h-6 text-brand-primary shrink-0 mt-0.5" />
          <div>
            <h3 className="text-white font-black uppercase tracking-widest text-xs mb-2 font-display">¿Por qué mi saldo disponible es menor?</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              Todo depósito debe ser jugado al menos una vez antes de poder ser retirado. Las ganancias de tus partidas ganadas se suman automáticamente a tu saldo disponible para retirar.
            </p>
          </div>
        </div>

        {/* Transaction History */}
        <div className="mt-12">
          <h2 className="text-xl font-black text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-3 font-display">
            <Clock className="w-6 h-6 text-brand-primary" /> Historial de Transacciones
          </h2>
          
          <div className="bg-navy-800 border border-navy-700 rounded-3xl overflow-hidden shadow-2xl">
            {transactions.length > 0 ? (
              <div className="divide-y divide-navy-700">
                {transactions.map((tx) => (
                  <div key={tx.id} className="p-6 flex items-center justify-between hover:bg-navy-700/50 transition-colors">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-navy-900 border border-navy-700 flex items-center justify-center shrink-0">
                        {getTransactionIcon(tx.type)}
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm sm:text-base leading-tight">{tx.description}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                            {tx.createdAt 
                              ? new Date(tx.createdAt.toDate ? tx.createdAt.toDate() : tx.createdAt).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
                              : 'Reciente'}
                          </span>
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${
                            tx.status === 'completed' ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                          }`}>
                            {tx.status === 'completed' ? 'Completado' : 'Pendiente'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className={`font-black text-lg font-display ${getTransactionColor(tx.amount, tx.type)}`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('es-CL')}
                      </p>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">CLP</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-16 text-center">
                <div className="w-20 h-20 bg-navy-900 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-navy-700">
                  <Clock className="w-10 h-10 text-slate-700" />
                </div>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Sin transacciones registradas</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
