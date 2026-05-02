import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Logo } from '../components/Logo';
import { useToast } from '../components/Toast';

export default function Login() {
  const { success, error: showError } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) { setError('Completa todos los campos.'); return; }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      success('¡Bienvenido!', 'Sesión iniciada correctamente.');
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Correo o contraseña incorrectos.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Demasiados intentos. Espera unos minutos.');
      } else { setError('Error al iniciar sesión. Inténtalo de nuevo.'); }
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      success('¡Bienvenido!', 'Sesión iniciada con Google.');
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') showError('Error', 'No se pudo iniciar sesión con Google.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-[#1a1a2e] font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e] via-[#1a1a2e]/90 to-[#1a1a2e]"></div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md">
        <div className="bg-[#16213e]/95 backdrop-blur-xl border border-[#0f3460]/50 rounded-2xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col items-center mb-8">
            <Link to="/inicio"><Logo className="mb-4" /></Link>
            <h1 className="text-2xl font-black text-white uppercase tracking-wider">Iniciar Sesión</h1>
          </div>

          {/* Google Button */}
          <button onClick={handleGoogle} className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-bold py-3.5 rounded-xl transition-all mb-6 shadow-lg hover:shadow-xl">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continuar con Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[#0f3460]"></div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">o</span>
            <div className="flex-1 h-px bg-[#0f3460]"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-2"><Mail className="w-3.5 h-3.5 text-[#00ff66]" /> Email</label>
              <input type="email" required placeholder="tu@email.com" className="w-full bg-[#0a0e17] border border-[#0f3460] focus:border-[#00ff66] text-white rounded-xl px-4 py-3 outline-none transition-colors placeholder:text-slate-600" value={email} onChange={e => setEmail(e.target.value)} autoFocus />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-2"><Lock className="w-3.5 h-3.5 text-[#00ff66]" /> Contraseña</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} required placeholder="••••••••" className="w-full bg-[#0a0e17] border border-[#0f3460] focus:border-[#00ff66] text-white rounded-xl px-4 py-3 pr-12 outline-none transition-colors placeholder:text-slate-600" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">{showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2">
                <AlertCircle className="text-red-400 w-4 h-4 shrink-0 mt-0.5" /><p className="text-sm text-red-300">{error}</p>
              </motion.div>
            )}

            <button type="submit" disabled={loading} className="w-full bg-[#00ff66] hover:bg-[#00cc55] text-black font-black uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,255,102,0.3)] disabled:opacity-50 mt-2">
              {loading ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div> : 'INICIAR SESIÓN'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">¿No tienes cuenta? <Link to="/register" className="text-[#00ff66] hover:underline font-bold">Regístrate</Link></p>
        </div>
      </motion.div>
    </div>
  );
}
