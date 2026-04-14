import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { Trophy, ArrowRight, Mail, Lock, AlertCircle, Swords } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError('Correo o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      
      if (userDoc.exists()) {
        navigate('/');
      } else {
        await auth.signOut();
        setError('No tienes una cuenta registrada. Por favor, crea una cuenta primero.');
      }
    } catch (err: any) {
      console.error(err);
      setError(`Error de Google: ${err.message}. Intenta abrir la app en una pestaña nueva.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 relative bg-navy-900">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80" 
          alt="Gaming Background" 
          className="w-full h-full object-cover opacity-10 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/80 via-navy-900/95 to-navy-900"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card max-w-md w-full relative z-10 border-electric-blue/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-electric-blue to-electric-cyan rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <Swords className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">INICIAR SESIÓN</h1>
            <p className="text-sm text-electric-blue font-medium uppercase tracking-wider mt-1">Bienvenido de vuelta a la arena</p>
          </div>
        </div>

        <button 
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-white text-navy-900 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-100 transition-all disabled:opacity-50 mb-8 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Ingresar con Google
        </button>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700/50"></div></div>
          <div className="relative flex justify-center text-sm"><span className="px-4 bg-navy-900 text-slate-400 font-medium">O ingresa con tu correo</span></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-electric-blue" /> Email
            </label>
            <input 
              type="email" 
              required
              placeholder="tu@email.com"
              className="input-field bg-navy-900/50"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-electric-blue" /> Contraseña
            </label>
            <input 
              type="password" 
              required
              className="input-field bg-navy-900/50"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            />
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
              <AlertCircle className="text-red-400 w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                INGRESAR <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          ¿No tienes cuenta? <Link to="/register" className="text-electric-blue hover:text-electric-cyan hover:underline font-bold transition-colors">Regístrate aquí</Link>
        </p>
      </motion.div>
    </div>
  );
}
