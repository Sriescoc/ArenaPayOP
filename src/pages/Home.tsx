import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { User, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Trophy, Shield, Zap, LogOut, User as UserIcon, Swords, Target, Flame } from 'lucide-react';

interface HomeProps {
  user: User | null;
}

export default function Home({ user }: HomeProps) {
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-navy-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-electric-blue rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              <Swords className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tighter text-white">ARENAPAY</span>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                  <UserIcon className="w-4 h-4 text-electric-blue" />
                  <span className="text-sm font-medium text-slate-300">{user.email}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-slate-300 hover:text-white font-medium transition-colors">
                  INICIAR SESIÓN
                </Link>
                <Link to="/register" className="btn-primary">
                  CREAR CUENTA
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 min-h-[90vh] flex items-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80" 
            alt="Gaming Arena" 
            className="w-full h-full object-cover opacity-20 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-900/50 via-navy-900/80 to-navy-900"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_100%)]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-electric-blue/10 border border-electric-blue/20 rounded-full mb-6 backdrop-blur-sm">
              <Flame className="w-4 h-4 text-electric-blue" />
              <span className="text-xs font-bold text-electric-blue tracking-widest uppercase">Desafíos 1v1 por Dinero Real</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight mb-6">
              APUESTA EN <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-electric-cyan">TI MISMO.</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-lg mb-10 leading-relaxed font-light">
              Encuentra rivales, juega tus títulos favoritos y gana dinero apostando en tu propio talento. Retiros instantáneos y fondos 100% seguros.
            </p>
            
            {!user && (
              <div className="flex flex-wrap gap-4">
                <Link to="/register" className="btn-primary text-lg px-10 py-4 flex items-center gap-2">
                  <Swords className="w-5 h-5" /> EMPEZAR A GANAR
                </Link>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="absolute -inset-4 bg-electric-blue/20 blur-3xl rounded-full"></div>
            <div className="glass-card relative p-2 border-white/10 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <img 
                src="https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80" 
                alt="Gamer holding controller" 
                className="rounded-xl w-full h-auto object-cover"
              />
              
              {/* Floating Badge */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 glass p-4 rounded-2xl shadow-2xl flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <span className="text-green-400 font-bold text-xl">$</span>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Premio Ganado</p>
                  <p className="text-white font-black text-xl">$25.000 CLP</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Torneos y mucho más Section */}
      <section className="py-24 px-6 relative z-10 bg-navy-800/30 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">TORNEOS Y MUCHO MÁS</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              No solo es 1v1. Participa en eventos organizados, ligas competitivas y demuestra quién es el mejor de Chile.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-navy-800/50 hover:border-electric-blue/50 transition-colors">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80" 
                  alt="Torneos" 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                />
              </div>
              <div className="p-6 relative bg-gradient-to-t from-navy-900 to-navy-900/90">
                <Trophy className="w-8 h-8 text-electric-blue mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Torneos Semanales</h3>
                <p className="text-slate-400">Compite por pozos garantizados todos los fines de semana en los juegos más populares.</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-navy-800/50 hover:border-electric-blue/50 transition-colors">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80" 
                  alt="Ligas" 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                />
              </div>
              <div className="p-6 relative bg-gradient-to-t from-navy-900 to-navy-900/90">
                <Target className="w-8 h-8 text-electric-cyan mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Ligas Competitivas</h3>
                <p className="text-slate-400">Asciende de división, suma puntos en el ranking nacional y clasifica a las finales presenciales.</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-navy-800/50 hover:border-electric-blue/50 transition-colors">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80" 
                  alt="Comunidad" 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                />
              </div>
              <div className="p-6 relative bg-gradient-to-t from-navy-900 to-navy-900/90">
                <Shield className="w-8 h-8 text-electric-blue mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Comunidad Segura</h3>
                <p className="text-slate-400">Sistema anti-trampas, soporte 24/7 y mediación de disputas para garantizar juego limpio.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
