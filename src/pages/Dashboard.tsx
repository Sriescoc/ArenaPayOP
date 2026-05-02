import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { Swords, Trophy, ChevronRight, X, AlertCircle, Info, Flame, Star, Zap, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GAME_DEFINITIONS } from '../lib/firestore-types';
import type { GameDefinition } from '../lib/firestore-types';

export default function Dashboard() {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const { info } = useToast();
  const balance = userData?.balance || 0;

  const [selectedGame, setSelectedGame] = useState<GameDefinition | null>(null);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState<number | ''>('');
  const [error, setError] = useState<string | null>(null);

  const handleGameSelect = (game: GameDefinition) => { setSelectedGame(game); setSelectedMode(null); setBetAmount(''); setError(null); };
  const handleCloseModal = () => { setSelectedGame(null); setSelectedMode(null); setBetAmount(''); setError(null); };
  const calculateWinnings = (amount: number) => amount ? (amount * 2) * 0.9 : 0;

  const handleSearchOpponent = () => {
    setError(null);
    if (!selectedMode) { setError('Selecciona un modo de juego.'); return; }
    if (!betAmount || betAmount < 1000 || betAmount > 100000) { setError('Apuesta entre $1.000 y $100.000 CLP.'); return; }
    if (betAmount > balance) { setError('Saldo insuficiente.'); return; }
    if (selectedGame?.requiredId && (!userData || !userData[selectedGame.requiredId])) { setError(`Configura tu ${selectedGame.idLabel} en Perfil antes de jugar.`); return; }
    info('Buscando rival...', `${selectedGame?.name} — Módulo en construcción`);
    handleCloseModal();
  };

  return (
    <DashboardLayout>
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-8 h-48 md:h-64">
        <img src="/images/hero-bg.jpg" alt="Arena" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e] via-[#1a1a2e]/80 to-transparent"></div>
        <div className="absolute inset-0 flex items-center px-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-[#00ff66]" />
              <span className="text-xs font-black text-[#00ff66] uppercase tracking-widest">Bienvenido, {userData?.firstName || 'Jugador'}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight leading-tight">
              Elige tu juego.<br /><span className="text-[#00ff66]">Gana dinero real.</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { icon: Users, label: 'Jugadores Online', value: '1,247', color: 'text-[#00ff66]' },
          { icon: Swords, label: 'Partidas Hoy', value: '342', color: 'text-blue-400' },
          { icon: Trophy, label: 'Torneos Activos', value: '8', color: 'text-yellow-400' },
          { icon: Zap, label: 'Premio Mayor', value: '$50.000', color: 'text-purple-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#16213e] border border-[#0f3460]/50 rounded-xl p-4 text-center">
            <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
            <p className="text-xl font-black text-white">{stat.value}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-[#00ff66] rounded-full"></div>
          <h2 className="text-2xl font-black text-white uppercase tracking-wider">Juegos</h2>
        </div>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{GAME_DEFINITIONS.length} disponibles</span>
      </div>

      {/* Game Cards Grid — Casino Style */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {GAME_DEFINITIONS.map((game, i) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -8, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleGameSelect(game)}
            className="group relative overflow-hidden rounded-2xl cursor-pointer border-2 border-transparent hover:border-[#00ff66]/60 transition-all duration-300 shadow-lg hover:shadow-[0_10px_40px_rgba(0,255,102,0.15)]"
          >
            <div className="aspect-[3/4] relative">
              <img src={game.image} alt={game.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
              
              {/* Hot badge */}
              <div className="absolute top-3 right-3 bg-[#00ff66] text-black text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md flex items-center gap-1">
                <Flame className="w-3 h-3" /> HOT
              </div>

              {/* Game info */}
              <div className="absolute bottom-0 left-0 w-full p-4">
                <h3 className="text-lg font-black text-white uppercase tracking-wide leading-tight mb-1">{game.name}</h3>
                <div className="flex flex-wrap gap-1">
                  {game.modes.map(m => (
                    <span key={m.id} className="text-[9px] font-bold bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded text-slate-300">{m.name}</span>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-1 text-[#00ff66] text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  Jugar ahora <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tournaments Section */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-yellow-500 rounded-full"></div>
        <h2 className="text-2xl font-black text-white uppercase tracking-wider">Torneos</h2>
        <span className="text-xs font-bold bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded-full">Próximamente</span>
      </div>
      <div className="bg-[#16213e] border border-[#0f3460]/50 rounded-2xl p-8 text-center mb-8">
        <Trophy className="w-12 h-12 text-yellow-500/50 mx-auto mb-4" />
        <h3 className="text-xl font-black text-white uppercase mb-2">Torneos en Desarrollo</h3>
        <p className="text-slate-400 text-sm max-w-md mx-auto">Pronto podrás inscribirte en torneos organizados con premios reales. ¡Mantente atento!</p>
      </div>

      {/* Betting Modal */}
      <AnimatePresence>
        {selectedGame && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleCloseModal} className="absolute inset-0 bg-black/80 backdrop-blur-sm"></motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-lg bg-[#16213e] border border-[#0f3460] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="h-28 relative shrink-0">
                <img src={selectedGame.image} alt={selectedGame.name} className="w-full h-full object-cover opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#16213e] to-transparent"></div>
                <button onClick={handleCloseModal} className="absolute top-3 right-3 w-8 h-8 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center text-white"><X className="w-5 h-5" /></button>
                <div className="absolute bottom-3 left-5">
                  <h3 className="text-2xl font-black text-white uppercase">{selectedGame.name}</h3>
                  <p className="text-xs text-[#00ff66] font-bold">Desafío 1v1</p>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto">
                {/* Mode */}
                <div className="mb-6">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">Modo de Juego</label>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedGame.modes.map(m => (
                      <button key={m.id} onClick={() => setSelectedMode(m.id)} className={`py-3 rounded-xl border-2 font-bold uppercase text-sm transition-all ${selectedMode === m.id ? 'border-[#00ff66] bg-[#00ff66]/10 text-[#00ff66]' : 'border-[#0f3460] text-slate-400 hover:border-slate-500'}`}>
                        {m.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount */}
                <div className="mb-6">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex justify-between"><span>Monto a Apostar</span><span className="text-slate-500">Saldo: ${balance.toLocaleString('es-CL')}</span></label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">$</span>
                    <input type="number" min="1000" max="100000" step="1000" value={betAmount} onChange={e => setBetAmount(e.target.value ? Number(e.target.value) : '')} placeholder="5000" className="w-full bg-[#0a0e17] border-2 border-[#0f3460] focus:border-[#00ff66] text-white font-black text-xl rounded-xl py-4 pl-8 pr-4 outline-none transition-colors" />
                  </div>
                  <div className="flex gap-2 mt-2">
                    {[1000, 2000, 5000, 10000].map(a => (
                      <button key={a} onClick={() => setBetAmount(a)} className="px-3 py-1 bg-[#0f3460] hover:bg-[#1a3a6b] rounded-lg text-xs font-bold text-slate-300">${a.toLocaleString('es-CL')}</button>
                    ))}
                  </div>
                </div>

                {/* Winnings */}
                {betAmount && betAmount >= 1000 && (
                  <div className="mb-6 bg-[#0a0e17] border border-[#0f3460] rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-slate-400">Pozo Total</span><span className="text-white font-bold">${(Number(betAmount) * 2).toLocaleString('es-CL')}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-400">Comisión (10%)</span><span className="text-red-400 font-bold">-${(Number(betAmount) * 0.2).toLocaleString('es-CL')}</span></div>
                    <div className="pt-2 border-t border-[#0f3460] flex justify-between"><span className="text-[#00ff66] font-black uppercase">Ganancia</span><span className="text-xl text-[#00ff66] font-black">${calculateWinnings(Number(betAmount)).toLocaleString('es-CL')}</span></div>
                  </div>
                )}

                {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2"><AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" /><p className="text-sm text-red-300">{error}</p>{error.includes('Perfil') && <button onClick={() => { handleCloseModal(); navigate('/profile'); }} className="text-xs text-white bg-red-500/20 px-2 py-1 rounded ml-auto whitespace-nowrap">Ir al Perfil</button>}</div>}

                <button onClick={handleSearchOpponent} className="w-full bg-[#00ff66] hover:bg-[#00cc55] text-black font-black uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(0,255,102,0.3)]">
                  <Swords className="w-5 h-5" /> Buscar Rival
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
