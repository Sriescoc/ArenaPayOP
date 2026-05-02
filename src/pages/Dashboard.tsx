import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { Swords, X, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { GameDefinition, MatchRequest } from '../lib/firestore-types';
import { GAME_DEFINITIONS } from '../lib/firestore-types';
import { GameLobbyModal } from '../components/matchmaking/GameLobbyModal';
import { MyRequestsPanel } from '../components/matchmaking/MyRequestsPanel';

export default function Dashboard() {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const { info } = useToast();
  const balance = userData?.balance || 0;

  const [selectedGameToLobby, setSelectedGameToLobby] = useState<GameDefinition | null>(null);

  const handleGameSelect = (game: GameDefinition) => { 
    setSelectedGameToLobby(game);
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
            <span className="bg-emerald-500 text-slate-950 px-3 py-1 rounded-full text-xs font-bold shadow-lg shadow-emerald-500/20">PRÓXIMAMENTE</span>
            <span className="text-white/60 font-label-md text-label-md tracking-widest">TORNEO MAJOR 2024</span>
          </div>
          <h1 className="font-headline-xl text-3xl md:text-5xl text-white mb-4 italic uppercase leading-none font-black">TORNEO MAJOR FORTNITE</h1>
          <p className="text-white/70 font-body-lg text-sm md:text-lg mb-8 max-w-md">Únete a la batalla por el premio mayor de $50,000. Compite contra los mejores del mundo hoy.</p>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => window.scrollTo({ top: 500, behavior: 'smooth' })} className="px-6 md:px-8 py-3 md:py-4 bg-primary-container text-on-primary-container rounded-xl font-bold font-label-md text-sm neon-glow hover:brightness-110 transition-all">INSCRIBIRSE AHORA</button>
            <button onClick={() => info('Torneo Major', 'Más detalles pronto')} className="px-6 md:px-8 py-3 md:py-4 glass-card text-white rounded-xl font-bold font-label-md text-sm border border-white/20 hover:bg-white/10 transition-all">VER DETALLES</button>
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

      {/* Matchmaking Feed Shell */}
      <section>
        <MyRequestsPanel />
      </section>

      <AnimatePresence>
        {selectedGameToLobby && (
          <GameLobbyModal 
            game={selectedGameToLobby} 
            onClose={() => setSelectedGameToLobby(null)} 
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
