import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trophy, Shield, Swords, Flame, ArrowRight, Gamepad2, Zap, Users, Star, ChevronRight } from 'lucide-react';
import { Logo } from '../components/Logo';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const go = () => navigate(user ? '/dashboard' : '/register');

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white font-sans selection:bg-[#00ff66] selection:text-black">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-[#1a1a2e]/90 backdrop-blur-md border-b border-[#0f3460]/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Logo className="scale-75 md:scale-90 origin-left" />
          <div className="flex items-center gap-3">
            {user ? (
              <Link to="/dashboard" className="bg-[#00ff66] hover:bg-[#00cc55] text-black font-black uppercase tracking-wider px-5 py-2 rounded-lg text-sm transition-all shadow-[0_0_15px_rgba(0,255,102,0.3)]">Ir a la Arena</Link>
            ) : (
              <>
                <Link to="/login" className="text-slate-300 hover:text-white font-bold text-sm transition-colors hidden sm:block">Iniciar Sesión</Link>
                <Link to="/register" className="bg-[#00ff66] hover:bg-[#00cc55] text-black font-black uppercase tracking-wider px-5 py-2 rounded-lg text-sm transition-all shadow-[0_0_15px_rgba(0,255,102,0.3)]">Registro</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative pt-16 min-h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <img src="/images/hero-bg.jpg" alt="Arena" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e]/50 via-[#1a1a2e]/80 to-[#1a1a2e]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-10 items-center relative z-10 w-full py-20">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#16213e] border border-[#0f3460] rounded-full mb-5">
              <Flame className="w-3.5 h-3.5 text-[#00ff66]" />
              <span className="text-[10px] font-bold text-[#00ff66] tracking-widest uppercase">La plataforma #1 de eSports en Chile</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-5 uppercase">
              Apuesta en<br /><span className="text-[#00ff66]">tus habilidades.</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-lg mx-auto lg:mx-0 mb-8 font-medium">
              Compite en Clash Royale, Fortnite, NBA 2K y EA FC. Desafía rivales, gana partidas y retira tus ganancias al instante.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <button onClick={go} className="bg-[#00ff66] hover:bg-[#00cc55] text-black font-black uppercase tracking-wider px-8 py-4 rounded-xl flex items-center gap-2 transition-all shadow-[0_0_30px_rgba(0,255,102,0.3)] hover:-translate-y-1 text-lg w-full sm:w-auto">
                <Gamepad2 className="w-6 h-6" /> Jugar Ahora
              </button>
              <a href="#juegos" className="bg-[#16213e] hover:bg-[#0f3460] text-white font-bold uppercase tracking-wider px-8 py-4 rounded-xl flex items-center gap-2 transition-all border border-[#0f3460] w-full sm:w-auto justify-center">
                Ver Juegos <ChevronRight className="w-5 h-5" />
              </a>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-400 font-bold uppercase tracking-wider">
              {[{ icon: Shield, t: '100% Seguro' }, { icon: Zap, t: 'Retiros 24/7' }, { icon: Users, t: '+10k Jugadores' }].map((b, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-[#16213e] px-3 py-2 rounded-lg border border-[#0f3460]"><b.icon className="w-3.5 h-3.5 text-[#00ff66]" /> {b.t}</div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="hidden lg:grid grid-cols-2 gap-4">
            {[
              { img: '/images/clash-royale.jpg', name: 'Clash Royale' },
              { img: '/images/fortnite.jpg', name: 'Fortnite' },
              { img: '/images/nba2k.jpg', name: 'NBA 2K' },
              { img: '/images/eafc.jpg', name: 'EA FC' },
            ].map((g, i) => (
              <motion.div key={i} whileHover={{ y: -5 }} className="relative rounded-xl overflow-hidden border border-[#0f3460] hover:border-[#00ff66]/50 transition-colors cursor-pointer group" onClick={go}>
                <div className="aspect-[4/3]">
                  <img src={g.img} alt={g.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <p className="absolute bottom-3 left-3 text-sm font-black text-white uppercase">{g.name}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Features */}
      <div className="py-24 bg-[#16213e] border-y border-[#0f3460]/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-black text-center uppercase tracking-tight mb-12">¿Por qué ArenaPay?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Trophy, title: 'Compite y Gana', desc: 'Desafía rivales de tu nivel en partidas 1v1 por dinero real en tus juegos favoritos.' },
              { icon: Shield, title: '100% Seguro', desc: 'Verificación de identidad, pagos seguros y soporte 24/7 para todos los jugadores.' },
              { icon: Zap, title: 'Retiros Rápidos', desc: 'Retira tus ganancias directamente a tu cuenta bancaria chilena sin demoras.' },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="bg-[#1a1a2e] p-8 rounded-2xl border border-[#0f3460] hover:border-[#00ff66]/40 transition-all hover:-translate-y-1">
                <f.icon className="w-10 h-10 text-[#00ff66] mb-4" />
                <h3 className="text-xl font-black text-white uppercase mb-3">{f.title}</h3>
                <p className="text-slate-400 font-medium">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Games */}
      <div id="juegos" className="py-24 bg-[#1a1a2e]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-5xl font-black text-center uppercase tracking-tight mb-12">Juegos Disponibles</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { img: '/images/clash-royale.jpg', name: 'Clash Royale', tags: ['1v1', '2v2'] },
              { img: '/images/fortnite.jpg', name: 'Fortnite', tags: ['Solo', 'Dúo'] },
              { img: '/images/nba2k.jpg', name: 'NBA 2K', tags: ['PS5', 'PS4'] },
              { img: '/images/eafc.jpg', name: 'EA FC / FIFA', tags: ['1v1'] },
            ].map((g, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} whileHover={{ y: -8 }} viewport={{ once: true }} className="group rounded-2xl overflow-hidden border-2 border-[#0f3460] hover:border-[#00ff66] transition-all cursor-pointer shadow-xl" onClick={go}>
                <div className="aspect-[3/4] relative">
                  <img src={g.img} alt={g.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                  <div className="absolute top-3 right-3 bg-[#00ff66] text-black text-[8px] font-black uppercase px-2 py-0.5 rounded flex items-center gap-0.5"><Flame className="w-2.5 h-2.5" /> HOT</div>
                  <div className="absolute bottom-0 left-0 p-5 w-full">
                    <h3 className="text-2xl font-black text-white uppercase mb-2">{g.name}</h3>
                    <div className="flex gap-1.5">{g.tags.map((t, j) => <span key={j} className="text-[9px] font-bold bg-white/10 px-2 py-0.5 rounded text-slate-300">{t}</span>)}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-24 bg-[#16213e] border-t border-[#0f3460]/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,102,0.08)_0%,transparent_60%)]"></div>
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-6">¿Listo para ganar?</h2>
          <p className="text-xl text-slate-400 mb-10">Regístrate gratis y empieza a competir por dinero real.</p>
          <button onClick={go} className="bg-[#00ff66] hover:bg-[#00cc55] text-black font-black uppercase tracking-wider px-10 py-5 rounded-xl text-xl inline-flex items-center gap-3 transition-all shadow-[0_0_40px_rgba(0,255,102,0.3)] hover:-translate-y-1">
            Crear Cuenta Gratis <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0d0d1a] py-10 border-t border-[#0f3460]/30">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <Logo className="opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all" />
          <div className="flex gap-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <Link to="/terminos" className="hover:text-[#00ff66]">Términos</Link>
            <Link to="/privacidad" className="hover:text-[#00ff66]">Privacidad</Link>
          </div>
          <p className="text-slate-600 text-xs">© {new Date().getFullYear()} ArenaPay</p>
        </div>
      </footer>
    </div>
  );
}
