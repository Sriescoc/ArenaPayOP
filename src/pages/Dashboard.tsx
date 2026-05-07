import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DashboardLayout } from '../components/DashboardLayout';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Swords, Users, Trophy, ChevronRight, X, AlertCircle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GAMES = [
  {
    id: 'cr',
    name: 'Clash Royale',
    image: 'https://images.igdb.com/igdb/image/upload/t_1080p/ar43a.jpg',
    modes: [
      { id: '1v1', name: '1 VS 1', icon: Swords },
      { id: '2v2', name: '2 VS 2', icon: Users }
    ],
    color: 'from-blue-600 to-purple-600',
    requiredId: 'supercellTag',
    idLabel: 'Supercell Player Tag'
  },
  {
    id: 'nba',
    name: 'NBA',
    image: 'https://images.igdb.com/igdb/image/upload/t_1080p/ar7y7.jpg',
    modes: [
      { id: '2k24-ps5', name: '2K24 (PS5)', icon: Swords },
      { id: '2k24-ps4', name: '2K24 (PS4)', icon: Swords }
    ],
    color: 'from-orange-600 to-red-600',
    requiredId: 'nbaId',
    idLabel: 'PSN ID / Xbox Gamertag'
  },
  {
    id: 'fifa',
    name: 'EA FC 24',
    image: 'https://images.igdb.com/igdb/image/upload/t_1080p/co6lz7.jpg',
    modes: [
      { id: '1v1', name: '1 VS 1', icon: Swords }
    ],
    color: 'from-green-600 to-emerald-600',
    requiredId: 'eaId',
    idLabel: 'EA ID'
  }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [userData, setUserData] = useState<any>(null);
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
          const data = docSnap.data();
          setUserData(data);
          setBalance(data.balance || 0);
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

  const calculateWinnings = (amount: number) => {
    if (!amount) return 0;
    const totalPool = amount * 2;
    const rake = totalPool * 0.10; // 10% rake
    return totalPool - rake;
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
    
    // Check if user has the required game ID
    if (selectedGame.requiredId && (!userData || !userData[selectedGame.requiredId])) {
      setError(`Debes configurar tu ${selectedGame.idLabel} en tu Perfil antes de jugar.`);
      return;
    }
    
    alert(`Buscando rival para ${selectedGame.name} (${selectedMode}) por $${betAmount}... (Módulo en construcción)`);
    handleCloseModal();
  };

  if (loading) {
    return (
      <DashboardLayout balance={0}>
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout balance={balance}>
      <div className="mb-12">
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase font-display">Arena de Combate</h1>
        <p className="text-slate-400 mt-2 font-medium">Elige tu campo de batalla y comienza a competir por premios reales.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {GAMES.map((game) => (
          <motion.div
            key={game.id}
            whileHover={{ y: -8, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleGameSelect(game)}
            className="group relative overflow-hidden rounded-3xl cursor-pointer border border-navy-700 hover:border-brand-primary/50 transition-all shadow-2xl"
          >
            <div className="aspect-[16/9] w-full relative">
              <img 
                src={game.image} 
                alt={game.name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent"></div>
              
              <div className="absolute inset-0 border-2 border-white/5 rounded-3xl group-hover:border-brand-primary/30 transition-colors pointer-events-none"></div>

              <div className="absolute bottom-0 left-0 w-full p-8 flex items-end justify-between transition-transform duration-500 group-hover:-translate-y-2">
                <div>
                  <h2 className="text-4xl font-black text-white uppercase tracking-tighter drop-shadow-2xl font-display glow-text">{game.name}</h2>
                  <div className="flex items-center gap-3 mt-4">
                    {game.modes.map(mode => (
                      <span key={mode.id} className="text-[10px] font-black bg-navy-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-slate-300 border border-white/10 uppercase tracking-widest">
                        {mode.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-brand-primary flex items-center justify-center text-black transform translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 shadow-[0_0_20px_rgba(0,255,102,0.4)]">
                  <ChevronRight className="w-8 h-8 stroke-[3]" />
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
              className="absolute inset-0 bg-navy-950/90 backdrop-blur-md"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-xl bg-navy-800 border border-navy-700 rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header with Game Image */}
              <div className="h-48 relative shrink-0">
                <img src={selectedGame.image} alt={selectedGame.name} className="w-full h-full object-cover opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-800 via-navy-800/20 to-transparent"></div>
                <button 
                  onClick={handleCloseModal}
                  className="absolute top-6 right-6 w-10 h-10 bg-black/50 hover:bg-black/80 rounded-2xl flex items-center justify-center text-white transition-all backdrop-blur-md border border-white/10 hover:scale-110 active:scale-95"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="absolute bottom-6 left-8">
                  <h3 className="text-4xl font-black text-white uppercase tracking-tighter font-display glow-text">{selectedGame.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse"></div>
                    <p className="text-xs text-brand-primary font-black uppercase tracking-widest">Configurando la Batalla</p>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-8 overflow-y-auto">
                {/* Step 1: Mode Selection */}
                <div className="mb-10">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4 block font-display">1. Selecciona tu Disciplina</label>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedGame.modes.map((mode: any) => {
                      const Icon = mode.icon;
                      const isSelected = selectedMode === mode.id;
                      return (
                        <button
                          key={mode.id}
                          onClick={() => setSelectedMode(mode.id)}
                          className={`flex items-center justify-center gap-3 py-4 px-6 rounded-2xl border-2 transition-all font-black uppercase tracking-widest text-xs font-display ${
                            isSelected 
                              ? 'border-brand-primary bg-brand-primary/10 text-brand-primary shadow-[0_0_20px_rgba(0,255,102,0.1)]' 
                              : 'border-navy-700 bg-navy-900 text-slate-500 hover:border-slate-600 hover:text-white'
                          }`}
                        >
                          <Icon className={`w-5 h-5 ${isSelected ? 'animate-pulse' : ''}`} /> {mode.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: Bet Amount */}
                <div className="mb-10">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex justify-between items-center font-display">
                    <span>2. Desafío Económico</span>
                    <span className="text-slate-400 font-sans tracking-normal">Saldo: ${balance.toLocaleString('es-CL')}</span>
                  </label>
                  
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                      <span className="text-brand-primary font-black text-2xl group-focus-within:scale-125 transition-transform font-display">$</span>
                    </div>
                    <input
                      type="number"
                      min="1000"
                      max="100000"
                      step="1000"
                      value={betAmount}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setBetAmount(e.target.value ? Number(e.target.value) : '')}
                      placeholder="Monto de la apuesta"
                      className="w-full bg-navy-900 border-2 border-navy-700 focus:border-brand-primary text-white font-black text-3xl rounded-2xl py-6 pl-12 pr-6 outline-none transition-all placeholder:text-navy-700 font-display shadow-inner"
                    />
                  </div>
                  
                  {/* Quick Bet Buttons */}
                  <div className="flex flex-wrap gap-3 mt-4">
                    {[1000, 5000, 10000, 20000, 50000].map(amount => (
                      <button
                        key={amount}
                        onClick={() => setBetAmount(amount)}
                        className="px-4 py-2 bg-navy-700 hover:bg-navy-600 rounded-xl text-xs font-black text-slate-300 transition-all border border-navy-700 hover:border-brand-primary/30"
                      >
                        +${amount.toLocaleString('es-CL')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Potential Winnings */}
                {betAmount && betAmount >= 1000 && betAmount <= 100000 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 bg-navy-900 border border-navy-700 rounded-3xl p-6 shadow-inner relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-slate-500 font-black uppercase tracking-widest font-display">Pozo en Juego:</span>
                      <span className="text-lg text-white font-black font-display">${(betAmount * 2).toLocaleString('es-CL')}</span>
                    </div>
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-sm text-slate-500 font-black uppercase tracking-widest font-display flex items-center gap-1 group/info relative">
                        Servicio (10%)
                        <Info className="w-4 h-4 text-slate-600 cursor-help" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-3 bg-navy-700 text-[10px] text-slate-300 rounded-xl shadow-2xl opacity-0 invisible group-hover/info:opacity-100 group-hover/info:visible transition-all z-10 text-center pointer-events-none border border-navy-600 leading-relaxed">
                          La comisión se utiliza para garantizar la seguridad de los pagos y el mantenimiento de la arena.
                        </div>
                      </span>
                      <span className="text-sm text-red-500 font-black font-display">-${((betAmount * 2) * 0.10).toLocaleString('es-CL')}</span>
                    </div>
                    <div className="pt-6 border-t border-navy-700 flex justify-between items-center">
                      <span className="text-lg text-brand-primary font-black uppercase tracking-tighter font-display">Botín Final:</span>
                      <span className="text-3xl text-brand-primary font-black font-display drop-shadow-[0_0_10px_rgba(0,255,102,0.3)] group-hover:scale-110 transition-transform">${calculateWinnings(betAmount).toLocaleString('es-CL')}</span>
                    </div>
                  </motion.div>
                )}

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-red-300 font-medium">{error}</p>
                      {error.includes('Perfil') && (
                        <button 
                          onClick={() => navigate('/profile')}
                          className="mt-3 text-xs font-black text-white bg-red-500/20 hover:bg-red-500/30 px-4 py-2 rounded-xl transition-all uppercase tracking-widest border border-red-500/30"
                        >
                          Ir a Ajustes de Perfil
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleSearchOpponent}
                  className="w-full bg-brand-primary hover:bg-brand-secondary text-black font-black uppercase tracking-[0.2em] py-6 rounded-2xl flex items-center justify-center gap-4 transition-all shadow-[0_0_30px_rgba(0,255,102,0.2)] hover:shadow-[0_0_50px_rgba(0,255,102,0.4)] group font-display text-xl active:scale-95"
                >
                  <Trophy className="w-7 h-7 group-hover:rotate-12 transition-transform" /> ENTRAR A LA ARENA
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
