import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy, Plus } from 'lucide-react';
import { MatchFeed } from './MatchFeed';
import { CreateMatchModal } from './CreateMatchModal';
import { MakeOfferModal } from './MakeOfferModal';
import type { GameDefinition, MatchRequest } from '../../lib/firestore-types';

interface GameLobbyModalProps {
  game: GameDefinition;
  onClose: () => void;
}

export function GameLobbyModal({ game, onClose }: GameLobbyModalProps) {
  const [selectedMode, setSelectedMode] = useState<string>(game.modes[0].id);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRequestToOffer, setSelectedRequestToOffer] = useState<MatchRequest | null>(null);

  const handleChallenge = (request: MatchRequest) => {
    setSelectedRequestToOffer(request);
  };

  return (
    <div className="fixed inset-0 z-[90] flex flex-col bg-[#051424]">
      {/* Lobby Header */}
      <div className="relative h-48 md:h-64 shrink-0">
        <img src={game.image} alt={game.name} className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#051424] via-[#051424]/80 to-transparent"></div>
        
        <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center text-white border border-white/10 transition-colors z-10">
          <X className="w-6 h-6" />
        </button>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest">Lobby Oficial</p>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter">{game.name}</h1>
          </div>
          
          {/* Action Button */}
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-4 rounded-xl font-black uppercase tracking-widest text-sm flex items-center gap-2 neon-glow transition-all"
          >
            <Plus className="w-5 h-5" /> Crear mi Solicitud
          </button>
        </div>
      </div>

      {/* Lobby Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 max-w-7xl mx-auto w-full">
        {/* Mode Selector */}
        <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-4 overflow-x-auto no-scrollbar">
          {game.modes.map(mode => (
            <button
              key={mode.id}
              onClick={() => setSelectedMode(mode.id)}
              className={`px-6 py-3 rounded-full text-sm font-bold uppercase tracking-widest whitespace-nowrap transition-all ${selectedMode === mode.id ? 'bg-emerald-500 text-slate-950' : 'bg-surface-container-low text-slate-400 border border-white/5 hover:text-white hover:border-white/20'}`}
            >
              {mode.name}
            </button>
          ))}
        </div>

        {/* The Feed for the specific game & mode */}
        <MatchFeed 
          gameId={game.id} 
          modeId={selectedMode} 
          onChallenge={handleChallenge} 
        />
      </div>

      {/* Sub-Modals */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateMatchModal 
            game={game} 
            forcedMode={selectedMode}
            onClose={() => setShowCreateModal(false)} 
          />
        )}
        {selectedRequestToOffer && (
          <MakeOfferModal 
            request={selectedRequestToOffer} 
            onClose={() => setSelectedRequestToOffer(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
