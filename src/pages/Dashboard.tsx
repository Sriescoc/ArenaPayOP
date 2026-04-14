import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DashboardLayout } from '../components/DashboardLayout';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Swords, Users, Trophy, ChevronRight, X, AlertCircle } from 'lucide-react';

const GAMES = [
  {
    id: 'cr',
    name: 'Clash Royale',
    image: 'https://wallpapercave.com/wp/wp1917128.jpg',
    modes: [
      { id: '1v1', name: '1 VS 1', icon: Swords },
      { id: '2v2', name: '2 VS 2', icon: Users }
    ],
    color: 'from-blue-600 to-purple-600'
  },
  {
    id: 'fifa',
    name: 'EA FC 24',
    image: 'https://media.contentapi.ea.com/content/dam/ea/fc/fc-24/common/fc24-featured-image-16x9.jpg.adapt.crop16x9.1023w.jpg',
    modes: [
      { id: '1v1', name: '1 VS 1', icon: Swords }
    ],
    color: 'from-green-600 to-emerald-600'
  }
];

export default function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Betting Flow State
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState<number | ''>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setBalance(docSnap.data().balance || 0);
        }
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleGameSelect = (game: any) => {
    setSelectedGame(game);
    setSelectedMode(null);
    setBetAmount('');
    setError(null);
  };

  const handleCloseModal = () => {
    setSelectedGame(null);
    setSelectedMode(null);
    setBetAmount('');
    setError(null);
  };

  const handleSearchOpponent = () => {
    setError(null);
    if (!selectedMode) {
      setError('Debes seleccionar un modo de juego.');
      return;
    }
    if (!betAmount || betAmount < 1000 || betAmount > 100000) {
      setError('La apuesta debe ser entre $1.000 y $100.000 CLP.');
      return;
    }
    if (betAmount > balance) {
      setError('Saldo insuficiente para esta apuesta.');
      return;
    }
    
    alert(`Buscando rival para ${selectedGame.name} (${selectedMode}) por $${betAmount}... (Módulo en construcción)`);
    handleCloseModal();
  };

  if (loading) {
    return (
      <DashboardLayout balance={0}>
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-[#00ff66] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout balance={balance}>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight uppercase">Listado de Juegos</h1>
        <p className="text-slate-400 mt-1">Selecciona un juego para configurar tu partida y apostar.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {GAMES.map((game) => (
          <motion.div
            key={game.id}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleGameSelect(game)}
            className="group relative overflow-hidden rounded-2xl cursor-pointer border border-[#1f2937] hover:border-[#00ff66]/50 transition-all shadow-lg"
          >
            <div className="aspect-[16/9] w-full relative">
              <img 
                src={game.image} 
                alt={game.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17] via-[#0a0e17]/50 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 w-full p-6 flex items-end justify-between">
                <div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-wider drop-shadow-lg">{game.name}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    {game.modes.map(mode => (
                      <span key={mode.id} className="text-xs font-bold bg-[#131b26]/80 backdrop-blur-sm px-2 py-1 rounded text-slate-300 border border-white/10">
                        {mode.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#00ff66] flex items-center justify-center text-black transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all shadow-[0_0_15px_rgba(0,255,102,0.5)]">
                  <ChevronRight className="w-6 h-6" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Betting Modal */}
      <AnimatePresence>
        {selectedGame && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#131b26] border border-[#1f2937] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header with Game Image */}
              <div className="h-32 relative shrink-0">
                <img src={selectedGame.image} alt={selectedGame.name} className="w-full h-full object-cover opacity-50" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#131b26] to-transparent"></div>
                <button 
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 w-8 h-8 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-sm"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-6">
                  <h3 className="text-2xl font-black text-white uppercase tracking-wider">{selectedGame.name}</h3>
                  <p className="text-sm text-[#00ff66] font-bold">Configurar Partida</p>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto">
                {/* Step 1: Mode Selection */}
                <div className="mb-8">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">1. Selecciona el Modo</label>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedGame.modes.map((mode: any) => {
                      const Icon = mode.icon;
                      const isSelected = selectedMode === mode.id;
                      return (
                        <button
                          key={mode.id}
                          onClick={() => setSelectedMode(mode.id)}
                          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all font-bold uppercase tracking-wider text-sm ${
                            isSelected 
                              ? 'border-[#00ff66] bg-[#00ff66]/10 text-[#00ff66]' 
                              : 'border-[#1f2937] bg-[#0a0e17] text-slate-400 hover:border-slate-600 hover:text-white'
                          }`}
                        >
                          <Icon className="w-4 h-4" /> {mode.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: Bet Amount */}
                <div className="mb-6">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex justify-between items-center">
                    <span>2. Monto a Apostar</span>
                    <span className="text-slate-500">Saldo: ${balance.toLocaleString('es-CL')}</span>
                  </label>
                  
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-slate-400 font-bold text-lg">$</span>
                    </div>
                    <input
                      type="number"
                      min="1000"
                      max="100000"
                      step="1000"
                      value={betAmount}
                      onChange={(e) => setBetAmount(e.target.value ? Number(e.target.value) : '')}
                      placeholder="Ej: 5000"
                      className="w-full bg-[#0a0e17] border-2 border-[#1f2937] focus:border-[#00ff66] text-white font-black text-xl rounded-xl py-4 pl-8 pr-4 outline-none transition-colors placeholder:text-slate-600"
                    />
                  </div>
                  
                  {/* Quick Bet Buttons */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {[1000, 2000, 5000, 10000].map(amount => (
                      <button
                        key={amount}
                        onClick={() => setBetAmount(amount)}
                        className="px-3 py-1.5 bg-[#1f2937] hover:bg-[#374151] rounded-lg text-xs font-bold text-slate-300 transition-colors"
                      >
                        ${amount.toLocaleString('es-CL')}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-3 font-medium">Mínimo: $1.000 | Máximo: $100.000</p>
                </div>

                {error && (
                  <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleSearchOpponent}
                  className="w-full bg-[#00ff66] hover:bg-[#00cc55] text-black font-black uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,255,102,0.2)] hover:shadow-[0_0_30px_rgba(0,255,102,0.4)]"
                >
                  <Trophy className="w-5 h-5" /> Buscar Rival
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
