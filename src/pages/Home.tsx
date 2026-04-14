import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from 'firebase/auth';
import { Trophy, Shield, Swords, Target, Flame, ArrowRight, CheckCircle2, Gamepad2, Zap, ChevronRight } from 'lucide-react';
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
    <div className="min-h-screen bg-[#0a0e17] text-white font-sans selection:bg-[#00ff66] selection:text-black flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0e17]/80 backdrop-blur-md border-b border-[#1f2937]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <Logo className="scale-75 md:scale-100 origin-left" />
          
          <div className="flex items-center gap-4">
            {user ? (
              <Link 
                to="/dashboard" 
                className="bg-[#00ff66] hover:bg-[#00cc55] text-black font-black uppercase tracking-wider px-6 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(0,255,102,0.3)] hover:shadow-[0_0_25px_rgba(0,255,102,0.5)] text-sm"
              >
                Ir a la Arena
              </Link>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-slate-300 hover:text-white font-bold uppercase tracking-wider text-sm transition-colors hidden sm:block"
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  to="/register" 
                  className="bg-[#00ff66] hover:bg-[#00cc55] text-black font-black uppercase tracking-wider px-6 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(0,255,102,0.3)] hover:shadow-[0_0_25px_rgba(0,255,102,0.5)] text-sm"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 flex-grow flex items-center border-b border-[#1f2937]">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80" 
            alt="Gaming Arena" 
            className="w-full h-full object-cover opacity-20 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e17]/50 via-[#0a0e17]/80 to-[#0a0e17]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00ff66]/10 rounded-full blur-[120px] pointer-events-none"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#131b26] border border-[#1f2937] rounded-full mb-6 shadow-lg">
              <Flame className="w-4 h-4 text-[#00ff66]" />
              <span className="text-[10px] md:text-xs font-bold text-[#00ff66] tracking-widest uppercase">La Plataforma #1 de eSports en Chile</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight mb-6 uppercase">
              TU HABILIDAD. <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff66] to-[#00cc55] drop-shadow-[0_0_15px_rgba(0,255,102,0.5)]">
                TU DINERO.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed font-medium">
              Compite en Clash Royale y EA FC 24. Apuesta por ti mismo, vence a tus rivales y retira tus ganancias al instante.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button 
                onClick={handlePlayClick}
                className="bg-[#00ff66] hover:bg-[#00cc55] text-black font-black uppercase tracking-wider px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_30px_rgba(0,255,102,0.3)] hover:shadow-[0_0_40px_rgba(0,255,102,0.5)] hover:-translate-y-1 text-lg w-full sm:w-auto"
              >
                <Gamepad2 className="w-6 h-6" /> Jugar Ahora
              </button>
              <a 
                href="#juegos"
                className="bg-[#131b26] hover:bg-[#1f2937] text-white font-bold uppercase tracking-wider px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all border border-[#1f2937] hover:border-[#374151] w-full sm:w-auto"
              >
                Ver Juegos <ChevronRight className="w-5 h-5" />
              </a>
            </div>

            <div className="mt-8 flex items-center justify-center lg:justify-start gap-6 text-sm text-slate-400 font-bold uppercase tracking-wider">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00ff66]" /> 100% Seguro</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00ff66]" /> Retiros 24/7</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="absolute -inset-4 bg-[#00ff66]/10 blur-3xl rounded-full"></div>
            <div className="bg-[#131b26] relative p-2 border border-[#1f2937] rounded-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80" 
                alt="Gamer holding controller" 
                className="rounded-xl w-full h-auto object-cover"
              />
              
              {/* Floating Badge */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 bg-[#0a0e17] border border-[#1f2937] p-4 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.8)] flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-[#00ff66]/20 rounded-full flex items-center justify-center">
                  <span className="text-[#00ff66] font-black text-xl">$</span>
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

      {/* Features Section */}
      <div className="py-24 bg-[#0a0e17] relative z-10 border-b border-[#1f2937]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#131b26] p-8 rounded-2xl border border-[#1f2937] hover:border-[#00ff66]/30 transition-colors group shadow-lg"
            >
              <div className="w-14 h-14 bg-[#00ff66]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Trophy className="w-7 h-7 text-[#00ff66]" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-wide mb-3">Compite y Gana</h3>
              <p className="text-slate-400 leading-relaxed font-medium">Encuentra rivales de tu nivel, apuesta la cantidad que desees y demuestra quién es el mejor en la arena.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-[#131b26] p-8 rounded-2xl border border-[#1f2937] hover:border-[#00ff66]/30 transition-colors group shadow-lg"
            >
              <div className="w-14 h-14 bg-[#00ff66]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-[#00ff66]" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-wide mb-3">100% Seguro</h3>
              <p className="text-slate-400 leading-relaxed font-medium">Sistema de verificación de identidad (KYC) y retención de fondos segura hasta que se confirme el resultado.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-[#131b26] p-8 rounded-2xl border border-[#1f2937] hover:border-[#00ff66]/30 transition-colors group shadow-lg"
            >
              <div className="w-14 h-14 bg-[#00ff66]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-[#00ff66]" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-wide mb-3">Retiros Rápidos</h3>
              <p className="text-slate-400 leading-relaxed font-medium">Tus ganancias disponibles para retirar a tu cuenta bancaria chilena de forma rápida y sin complicaciones.</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Games Preview Section */}
      <div id="juegos" className="py-24 bg-[#131b26] relative z-10 border-b border-[#1f2937]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase mb-4">Juegos Disponibles</h2>
            <p className="text-slate-400 max-w-2xl mx-auto font-medium">Seleccionamos los juegos más competitivos para que demuestres tu nivel.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Clash Royale */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="group relative rounded-2xl overflow-hidden border border-[#1f2937] hover:border-[#00ff66]/50 transition-all duration-500 shadow-2xl"
            >
              <div className="aspect-[16/9] relative">
                <img 
                  src="https://wallpapercave.com/wp/wp1917128.jpg" 
                  alt="Clash Royale" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17] via-[#0a0e17]/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8">
                  <h3 className="text-4xl font-black text-white uppercase tracking-wider drop-shadow-lg mb-2">Clash Royale</h3>
                  <div className="flex gap-3">
                    <span className="bg-[#131b26]/80 backdrop-blur-sm border border-white/10 text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">1 VS 1</span>
                    <span className="bg-[#131b26]/80 backdrop-blur-sm border border-white/10 text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">2 VS 2</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* FIFA */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group relative rounded-2xl overflow-hidden border border-[#1f2937] hover:border-[#00ff66]/50 transition-all duration-500 shadow-2xl"
            >
              <div className="aspect-[16/9] relative">
                <img 
                  src="https://media.contentapi.ea.com/content/dam/ea/fc/fc-24/common/fc24-featured-image-16x9.jpg.adapt.crop16x9.1023w.jpg" 
                  alt="EA FC 24" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17] via-[#0a0e17]/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8">
                  <h3 className="text-4xl font-black text-white uppercase tracking-wider drop-shadow-lg mb-2">EA FC 24</h3>
                  <div className="flex gap-3">
                    <span className="bg-[#131b26]/80 backdrop-blur-sm border border-white/10 text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">1 VS 1</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-[#0a0e17] relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[#00ff66]/5"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 uppercase">¿Listo para la acción?</h2>
          <p className="text-xl text-slate-400 mb-10 font-medium">Regístrate ahora, deposita y empieza a ganar dinero real con tus habilidades.</p>
          <button 
            onClick={handlePlayClick}
            className="bg-[#00ff66] hover:bg-[#00cc55] text-black font-black uppercase tracking-wider px-10 py-5 rounded-xl transition-all shadow-[0_0_30px_rgba(0,255,102,0.3)] hover:shadow-[0_0_50px_rgba(0,255,102,0.5)] hover:-translate-y-1 text-xl inline-flex items-center gap-3"
          >
            Crear Cuenta Gratis <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#05070a] py-12 border-t border-[#1f2937]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <Logo className="opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all" />
          <div className="flex gap-6 text-sm font-bold text-slate-500 uppercase tracking-wider">
            <Link to="/terminos" className="hover:text-[#00ff66] transition-colors">Términos</Link>
            <Link to="/privacidad" className="hover:text-[#00ff66] transition-colors">Privacidad</Link>
          </div>
          <p className="text-slate-600 text-sm font-medium">© 2024 ArenaPay. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
