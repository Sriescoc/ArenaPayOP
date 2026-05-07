import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from 'firebase/auth';
import { Trophy, Shield, Swords, Target, Flame, ArrowRight, CheckCircle2, Gamepad2, Zap, ChevronRight, Users, Star } from 'lucide-react';
import { Logo } from '../components/Logo';

interface HomeProps {
  user: User | null;
}

export default function Home({ user }: HomeProps) {
  const navigate = useNavigate();

  const handlePlayClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 text-white font-sans selection:bg-brand-primary selection:text-black flex flex-col overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-navy-950/80 backdrop-blur-md border-b border-navy-700">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <Logo className="scale-75 md:scale-100 origin-left" />
          
          <div className="flex items-center gap-4">
            {user ? (
              <Link 
                to="/dashboard" 
                className="bg-brand-primary hover:bg-brand-secondary text-black font-black uppercase tracking-wider px-6 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(0,255,102,0.3)] hover:shadow-[0_0_25px_rgba(0,255,102,0.5)] text-sm font-display"
              >
                Ir a la Arena
              </Link>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-slate-300 hover:text-white font-bold uppercase tracking-wider text-sm transition-colors hidden sm:block font-display"
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  to="/register" 
                  className="bg-brand-primary hover:bg-brand-secondary text-black font-black uppercase tracking-wider px-6 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(0,255,102,0.3)] hover:shadow-[0_0_25px_rgba(0,255,102,0.5)] text-sm font-display"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 flex-grow flex items-center border-b border-navy-700 min-h-screen">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80" 
            alt="Gaming Arena" 
            className="w-full h-full object-cover opacity-10 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950/50 via-navy-950/80 to-navy-950"></div>
          
          {/* Animated Glows */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
              x: [-20, 20, -20]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none"
          ></motion.div>
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
              x: [20, -20, 20]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-brand-accent/10 rounded-full blur-[120px] pointer-events-none"
          ></motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-navy-800 border border-navy-700 rounded-full mb-8 shadow-2xl"
            >
              <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse"></div>
              <span className="text-[10px] md:text-xs font-black text-brand-primary tracking-[0.2em] uppercase font-display">Chile eSports Arena #1</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-6xl sm:text-7xl lg:text-9xl font-black text-white leading-[0.95] tracking-tighter mb-8 uppercase font-display"
            >
              DOMINA <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary glow-text">
                LA ARENA.
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-slate-400 max-w-lg mx-auto lg:mx-0 mb-12 leading-relaxed font-medium"
            >
              El centro competitivo definitivo. Desafía a otros, apuesta en grande y cobra tus victorias al instante.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5"
            >
              <button 
                onClick={handlePlayClick}
                className="bg-brand-primary hover:bg-brand-secondary text-black font-black uppercase tracking-wider px-10 py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_0_30px_rgba(0,255,102,0.3)] hover:shadow-[0_0_50px_rgba(0,255,102,0.5)] hover:-translate-y-1 text-xl w-full sm:w-auto group font-display"
              >
                <Gamepad2 className="w-7 h-7 group-hover:rotate-12 transition-transform" /> Jugar Ahora
              </button>
              <a 
                href="#juegos"
                className="bg-navy-800 hover:bg-navy-700 text-white font-black uppercase tracking-wider px-10 py-5 rounded-2xl flex items-center justify-center gap-3 transition-all border border-navy-700 hover:border-slate-600 w-full sm:w-auto group font-display"
              >
                Explorar <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </a>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-16 flex flex-wrap items-center justify-center lg:justify-start gap-8"
            >
              <div className="flex items-center gap-2 text-slate-500 font-black uppercase tracking-tighter text-xs">
                <CheckCircle2 className="w-4 h-4 text-brand-primary" /> Transacciones Seguras
              </div>
              <div className="flex items-center gap-2 text-slate-500 font-black uppercase tracking-tighter text-xs">
                <Zap className="w-4 h-4 text-brand-primary" /> Pagos Ultra-Rápidos
              </div>
              <div className="flex items-center gap-2 text-slate-500 font-black uppercase tracking-tighter text-xs">
                <Users className="w-4 h-4 text-brand-primary" /> Comunidad Activa
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, type: "spring" }}
            className="relative hidden lg:block"
          >
            {/* Visual Elements */}
            <div className="absolute -inset-10 bg-brand-primary/20 blur-[100px] rounded-full"></div>
            <div className="absolute -inset-10 bg-brand-accent/10 blur-[100px] rounded-full translate-x-1/2"></div>
            
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-primary to-navy-700 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="bg-navy-800 relative p-3 border border-navy-700 rounded-3xl shadow-2xl transition-all duration-500 group-hover:scale-[1.02]">
                <img 
                  src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80" 
                  alt="Esports Arena High Quality" 
                  className="rounded-2xl w-full h-[500px] object-cover"
                />
                
                {/* Overlay Elements */}
                <div className="absolute top-8 left-8 right-8 flex justify-between">
                  <div className="bg-brand-primary text-black px-4 py-2 rounded-xl font-black uppercase text-xs tracking-widest shadow-xl">En Vivo</div>
                  <div className="bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-xl font-black uppercase text-xs tracking-widest border border-white/10">Chile</div>
                </div>
                
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-8 -left-8 bg-navy-900 border border-navy-700 p-5 rounded-3xl shadow-2xl flex items-center gap-4 z-20"
                >
                  <div className="w-14 h-14 bg-brand-primary/20 rounded-2xl flex items-center justify-center">
                    <Trophy className="text-brand-primary w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Torneo Actual</p>
                    <p className="text-white font-black text-xl font-display">Clash Master</p>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -top-8 -right-8 bg-navy-900 border border-navy-700 p-5 rounded-3xl shadow-2xl flex items-center gap-4 z-20"
                >
                  <div className="w-14 h-14 bg-brand-accent/20 rounded-2xl flex items-center justify-center">
                    <Star className="text-brand-accent w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Jugador Pro</p>
                    <p className="text-white font-black text-xl font-display">Nivel 99</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Features Section */}
      <div className="py-32 bg-navy-950 relative z-10 border-b border-navy-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight uppercase mb-6 font-display">¿Por qué ArenaPay?</h2>
            <div className="w-24 h-2 bg-brand-primary mx-auto rounded-full shadow-[0_0_15px_rgba(0,255,102,0.5)]"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: Trophy, title: "Compite y Gana", desc: "Encuentra rivales de tu nivel, apuesta la cantidad que desees y demuestra quién es el mejor." },
              { icon: Shield, title: "100% Seguro", desc: "Sistema de verificación de identidad (KYC) y retención de fondos segura hasta el resultado final." },
              { icon: Zap, title: "Retiros Rápidos", desc: "Tus ganancias disponibles para retirar a tu cuenta bancaria chilena sin complicaciones." }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: idx * 0.2 }}
                className="bg-navy-800 p-10 rounded-3xl border border-navy-700 hover:border-brand-primary/50 transition-all duration-500 group shadow-2xl hover:-translate-y-2 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                  <feature.icon className="w-32 h-32" />
                </div>
                <div className="w-20 h-20 bg-brand-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-brand-primary/20 transition-all shadow-xl">
                  <feature.icon className="w-10 h-10 text-brand-primary" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4 font-display group-hover:text-brand-primary transition-colors">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed font-medium text-lg">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Games Preview Section */}
      <div id="juegos" className="py-32 bg-navy-800 relative z-10 border-b border-navy-700 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-brand-primary to-transparent"></div>
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-brand-primary to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight uppercase mb-6 font-display">Títulos de Élite</h2>
            <p className="text-slate-400 max-w-2xl mx-auto font-medium text-xl leading-relaxed">Seleccionamos los juegos más competitivos para que cada enfrentamiento sea legendario.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { id: 'cr', name: 'Clash Royale', img: 'https://images.igdb.com/igdb/image/upload/t_1080p/ar43a.jpg', color: 'brand-primary', modes: ['1 VS 1', '2 VS 2'] },
              { id: 'fifa', name: 'EA FC 24', img: 'https://images.igdb.com/igdb/image/upload/t_1080p/co6lz7.jpg', color: 'brand-primary', modes: ['1 VS 1'] },
              { id: 'nba', name: 'NBA', img: 'https://images.igdb.com/igdb/image/upload/t_1080p/ar7y7.jpg', color: 'brand-accent', modes: ['2K24 PS5', '2K24 PS4'] }
            ].map((game, idx) => (
              <motion.div 
                key={game.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -15 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="group relative rounded-[2rem] overflow-hidden border border-navy-700 hover:border-brand-primary transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-pointer"
                onClick={handlePlayClick}
              >
                <div className="aspect-[3/4] relative">
                  <img 
                    src={game.img} 
                    alt={game.name} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  {/* Subtle Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-navy-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="absolute bottom-0 left-0 p-10 w-full transform transition-all duration-500 group-hover:-translate-y-4">
                    <h3 className={`text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter mb-6 font-display glow-text`}>
                      {game.name}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {game.modes.map(mode => (
                        <span key={mode} className="bg-navy-900/90 backdrop-blur-md border border-white/10 text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest group-hover:bg-brand-primary group-hover:text-black transition-colors">
                          {mode}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Hover Border Effect */}
                  <div className="absolute inset-4 border border-white/10 rounded-[1.5rem] pointer-events-none group-hover:border-brand-primary/30 transition-colors"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-32 bg-navy-950 relative z-10 overflow-hidden border-b border-navy-700">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,102,0.08)_0%,transparent_70%)]"></div>
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto px-4 text-center relative z-10"
        >
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-10 uppercase font-display leading-none">
            ¿LISTO PARA <br /> <span className="text-brand-primary glow-text">DOMINAR?</span>
          </h2>
          <p className="text-2xl text-slate-400 mb-14 font-medium max-w-2xl mx-auto leading-relaxed">Únete a miles de competidores que ya están transformando su pasión en ganancias reales.</p>
          <button 
            onClick={handlePlayClick}
            className="bg-brand-primary hover:bg-brand-secondary text-black font-black uppercase tracking-wider px-14 py-7 rounded-2xl transition-all shadow-[0_0_40px_rgba(0,255,102,0.4)] hover:shadow-[0_0_70px_rgba(0,255,102,0.6)] hover:-translate-y-2 text-2xl inline-flex items-center gap-5 group font-display"
          >
            Empieza Ahora <ArrowRight className="w-10 h-10 group-hover:translate-x-3 transition-transform" />
          </button>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-navy-950 py-20 border-t border-navy-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-16">
            <Logo className="scale-125 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700" />
            <div className="flex flex-wrap justify-center gap-10 text-sm font-black text-slate-500 uppercase tracking-[0.2em] font-display">
              <Link to="/terminos" className="hover:text-brand-primary transition-colors">Reglas</Link>
              <Link to="/privacidad" className="hover:text-brand-primary transition-colors">Seguridad</Link>
              <Link to="/soporte" className="hover:text-brand-primary transition-colors">Soporte</Link>
              <Link to="/faq" className="hover:text-brand-primary transition-colors">FAQ</Link>
            </div>
          </div>
          <div className="pt-12 border-t border-navy-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-widest leading-loose text-center md:text-left">
              ArenaPay es una marca registrada. <br className="md:hidden" /> © 2024. Todos los derechos reservados.
            </p>
            <div className="flex gap-4">
              {/* Dummy Socials for UI look */}
              {[1, 2, 3].map(i => (
                <div key={i} className="w-10 h-10 bg-navy-800 border border-navy-700 rounded-xl flex items-center justify-center hover:border-brand-primary/50 transition-colors cursor-pointer">
                  <div className="w-4 h-4 bg-slate-600 rounded-sm"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
