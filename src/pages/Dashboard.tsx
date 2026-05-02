import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { Swords, X, AlertCircle } from 'lucide-react';
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
      {/* Featured Hero Section */}
      <section className="relative h-[400px] rounded-3xl overflow-hidden mb-12 glass-card group">
        <div className="absolute inset-0">
          <img src="/images/fortnite.jpg" alt="Fortnite Banner" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
        </div>
        <div className="absolute bottom-0 left-0 p-6 md:p-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-emerald-500 text-slate-950 px-3 py-1 rounded-full text-xs font-bold animate-pulse">EN VIVO</span>
            <span className="text-white/60 font-label-md text-label-md tracking-widest">TORNEO MAJOR 2024</span>
          </div>
          <h1 className="font-headline-xl text-3xl md:text-5xl text-white mb-4 italic uppercase leading-none font-black">TORNEO MAJOR FORTNITE</h1>
          <p className="text-white/70 font-body-lg text-sm md:text-lg mb-8 max-w-md">Únete a la batalla por el premio mayor de $50,000. Compite contra los mejores del mundo hoy.</p>
          <div className="flex flex-wrap gap-4">
            <button className="px-6 md:px-8 py-3 md:py-4 bg-primary-container text-on-primary-container rounded-xl font-bold font-label-md text-sm neon-glow hover:brightness-110 transition-all">INSCRIBIRSE AHORA</button>
            <button className="px-6 md:px-8 py-3 md:py-4 glass-card text-white rounded-xl font-bold font-label-md text-sm border border-white/20 hover:bg-white/10 transition-all">VER DETALLES</button>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="mb-12">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="font-headline-lg text-2xl md:text-3xl text-white italic tracking-tighter font-black">CATEGORÍAS POPULARES</h2>
            <p className="text-slate-500 font-label-md">Selecciona tu campo de batalla</p>
          </div>
          <button className="text-emerald-400 font-bold font-label-md hover:underline hidden md:block">Ver Todo</button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {GAME_DEFINITIONS.map((game, i) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => handleGameSelect(game)}
              className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
            >
              <img src={game.image} alt={game.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <span className="text-white font-headline-md text-lg md:text-xl tracking-tight italic font-black uppercase">{game.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Partidos en Vivo Section */}
      <section>
        <div className="flex items-center gap-4 mb-6">
          <span className="w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
          <h2 className="font-headline-lg text-2xl md:text-3xl text-white italic tracking-tighter font-black uppercase">PARTIDOS EN VIVO</h2>
        </div>
        <div className="space-y-4">
          {/* Match 1 */}
          <div className="glass-card rounded-2xl p-6 flex flex-col md:flex-row items-center gap-8 group hover:border-emerald-500/30 transition-all duration-300">
            <div className="flex-1 flex justify-between items-center w-full">
              <div className="flex flex-col items-center gap-2 w-1/3">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-surface-container border border-white/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl md:text-4xl text-emerald-400">rocket</span>
                </div>
                <span className="font-bold text-white text-xs md:text-sm text-center">MORTAL_KING</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="font-headline-xl text-3xl md:text-5xl text-emerald-400 leading-none font-black italic">2 : 1</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">65:00</span>
              </div>
              <div className="flex flex-col items-center gap-2 w-1/3">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-surface-container border border-white/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl md:text-4xl text-emerald-400">shield</span>
                </div>
                <span className="font-bold text-white text-xs md:text-sm text-center">SHADOW_OPS</span>
              </div>
            </div>
            <div className="w-full md:w-auto flex gap-3">
              <div className="flex-1 md:flex-none flex flex-col items-center gap-1 bg-surface-container-low p-3 rounded-xl border border-white/5 hover:border-emerald-500/50 cursor-pointer transition-all">
                <span className="text-[10px] text-slate-500 font-bold">1</span>
                <span className="font-odds-display text-lg md:text-xl font-bold text-emerald-400">1.85</span>
              </div>
              <div className="flex-1 md:flex-none flex flex-col items-center gap-1 bg-surface-container-low p-3 rounded-xl border border-white/5 hover:border-emerald-500/50 cursor-pointer transition-all">
                <span className="text-[10px] text-slate-500 font-bold">X</span>
                <span className="font-odds-display text-lg md:text-xl font-bold text-emerald-400">3.40</span>
              </div>
              <div className="flex-1 md:flex-none flex flex-col items-center gap-1 bg-surface-container-low p-3 rounded-xl border border-white/5 hover:border-emerald-500/50 cursor-pointer transition-all">
                <span className="text-[10px] text-slate-500 font-bold">2</span>
                <span className="font-odds-display text-lg md:text-xl font-bold text-emerald-400">4.20</span>
              </div>
            </div>
          </div>

          {/* Match 2 */}
          <div className="glass-card rounded-2xl p-6 flex flex-col md:flex-row items-center gap-8 group hover:border-emerald-500/30 transition-all duration-300">
            <div className="flex-1 flex justify-between items-center w-full">
              <div className="flex flex-col items-center gap-2 w-1/3">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-surface-container border border-white/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl md:text-4xl text-emerald-400">skull</span>
                </div>
                <span className="font-bold text-white text-xs md:text-sm text-center">DARK KNIGHTS</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="font-headline-xl text-3xl md:text-5xl text-emerald-400 leading-none font-black italic">0 : 0</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">12:30</span>
              </div>
              <div className="flex flex-col items-center gap-2 w-1/3">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-surface-container border border-white/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl md:text-4xl text-emerald-400">bolt</span>
                </div>
                <span className="font-bold text-white text-xs md:text-sm text-center">BOLT ESPORTS</span>
              </div>
            </div>
            <div className="w-full md:w-auto flex gap-3">
              <div className="flex-1 md:flex-none flex flex-col items-center gap-1 bg-surface-container-low p-3 rounded-xl border border-white/5 hover:border-emerald-500/50 cursor-pointer transition-all">
                <span className="text-[10px] text-slate-500 font-bold">1</span>
                <span className="font-odds-display text-lg md:text-xl font-bold text-emerald-400">2.15</span>
              </div>
              <div className="flex-1 md:flex-none flex flex-col items-center gap-1 bg-surface-container-low p-3 rounded-xl border border-white/5 hover:border-emerald-500/50 cursor-pointer transition-all">
                <span className="text-[10px] text-slate-500 font-bold">X</span>
                <span className="font-odds-display text-lg md:text-xl font-bold text-emerald-400">3.10</span>
              </div>
              <div className="flex-1 md:flex-none flex flex-col items-center gap-1 bg-surface-container-low p-3 rounded-xl border border-white/5 hover:border-emerald-500/50 cursor-pointer transition-all">
                <span className="text-[10px] text-slate-500 font-bold">2</span>
                <span className="font-odds-display text-lg md:text-xl font-bold text-emerald-400">3.50</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Betting Modal (Existing functional logic, slightly restyled) */}
      <AnimatePresence>
        {selectedGame && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleCloseModal} className="absolute inset-0 bg-black/80 backdrop-blur-md"></motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-lg glass-panel glass-edge rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-white/10">
              {/* Header */}
              <div className="h-32 relative shrink-0">
                <img src={selectedGame.image} alt={selectedGame.name} className="w-full h-full object-cover opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#16213e] to-transparent"></div>
                <button onClick={handleCloseModal} className="absolute top-3 right-3 w-8 h-8 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center text-white"><X className="w-5 h-5" /></button>
                <div className="absolute bottom-3 left-6">
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">{selectedGame.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest">Crear Partida</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto bg-surface">
                {/* Mode */}
                <div className="mb-6">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">Modo de Juego</label>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedGame.modes.map(m => (
                      <button key={m.id} onClick={() => setSelectedMode(m.id)} className={`py-4 rounded-xl border font-bold uppercase text-xs tracking-wider transition-all ${selectedMode === m.id ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 neon-glow' : 'border-white/10 text-slate-400 hover:bg-white/5 hover:border-white/20'}`}>
                        {m.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount */}
                <div className="mb-6">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex justify-between"><span>Monto a Apostar</span><span className="text-emerald-400">Saldo: ${balance.toLocaleString('es-CL')}</span></label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400 font-bold text-lg">$</span>
                    <input type="number" min="1000" max="100000" step="1000" value={betAmount} onChange={e => setBetAmount(e.target.value ? Number(e.target.value) : '')} placeholder="5000" className="w-full bg-surface-container-low border border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white font-black text-xl rounded-xl py-4 pl-8 pr-4 outline-none transition-all" />
                  </div>
                  <div className="flex gap-2 mt-3">
                    {[1000, 2000, 5000, 10000].map(a => (
                      <button key={a} onClick={() => setBetAmount(a)} className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-xs font-bold text-slate-300 transition-colors">${a.toLocaleString('es-CL')}</button>
                    ))}
                  </div>
                </div>

                {/* Winnings */}
                {betAmount && betAmount >= 1000 && (
                  <div className="mb-6 bg-surface-container-low border border-white/10 rounded-xl p-5 space-y-3">
                    <div className="flex justify-between text-sm"><span className="text-slate-400 font-medium">Pozo Total</span><span className="text-white font-bold">${(Number(betAmount) * 2).toLocaleString('es-CL')}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-400 font-medium">Comisión de Plataforma</span><span className="text-red-400 font-bold">-${(Number(betAmount) * 0.2).toLocaleString('es-CL')}</span></div>
                    <div className="pt-3 border-t border-white/10 flex justify-between items-center"><span className="text-emerald-400 font-black uppercase tracking-widest text-xs">Pago Potencial</span><span className="text-2xl text-emerald-400 font-black">${calculateWinnings(Number(betAmount)).toLocaleString('es-CL')}</span></div>
                  </div>
                )}

                {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3"><AlertCircle className="w-5 h-5 text-red-400 shrink-0" /><p className="text-sm text-red-300 font-medium">{error}</p>{error.includes('Perfil') && <button onClick={() => { handleCloseModal(); navigate('/profile'); }} className="text-xs font-bold text-white bg-red-500/20 hover:bg-red-500/30 px-3 py-1.5 rounded-lg ml-auto whitespace-nowrap transition-colors">Ir al Perfil</button>}</div>}

                <button onClick={handleSearchOpponent} className="w-full bg-emerald-500 text-slate-950 font-black uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-400 active:scale-95 transition-all shadow-lg shadow-emerald-500/20 neon-glow">
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
