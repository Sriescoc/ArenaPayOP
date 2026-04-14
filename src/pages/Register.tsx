import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { formatRut, validateRut, cn } from '../lib/utils';
import { Trophy, ArrowRight, Mail, User, CreditCard, AlertCircle, Lock } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'initial' | 'google-rut'>('initial');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    rut: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRut(e.target.value);
    setFormData(prev => ({ ...prev, rut: formatted }));
  };

  const saveUserToFirestore = async (uid: string, data: any) => {
    try {
      await setDoc(doc(db, 'users', uid), {
        uid,
        firstName: data.firstName,
        lastName: data.lastName,
        rut: data.rut,
        email: data.email,
        createdAt: serverTimestamp(),
        role: 'user'
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${uid}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateRut(formData.rut)) {
      setError('El RUT ingresado no es válido.');
      return;
    }

    setLoading(true);
    try {
      if (step === 'initial') {
        // Standard Email/Password Registration
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await saveUserToFirestore(userCredential.user.uid, formData);
        navigate('/');
      } else if (step === 'google-rut') {
        // Completing Google Registration with RUT
        if (!auth.currentUser) throw new Error("No user found");
        await saveUserToFirestore(auth.currentUser.uid, formData);
        navigate('/');
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('El correo ya está registrado. Por favor inicia sesión.');
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña debe tener al menos 6 caracteres.');
      } else {
        setError('Ocurrió un error al registrar la cuenta. Inténtalo de nuevo.');
      }
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
        // User already registered and has RUT
        navigate('/');
      } else {
        // New Google user, needs RUT
        const names = result.user.displayName?.split(' ') || ['', ''];
        setFormData(prev => ({
          ...prev,
          email: result.user.email || '',
          firstName: names[0] || '',
          lastName: names.slice(1).join(' ') || ''
        }));
        setStep('google-rut');
      }
    } catch (err: any) {
      console.error(err);
      setError('Error al conectar con Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 bg-navy-900">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card max-w-xl w-full"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-electric-blue rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <Trophy className="text-white w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {step === 'initial' ? 'Crear Cuenta' : 'Completa tu Perfil'}
            </h1>
            <p className="text-sm text-slate-400">
              {step === 'initial' ? 'Únete a la plataforma de desafíos #1 de Chile' : 'Necesitamos tu RUT para garantizar la seguridad'}
            </p>
          </div>
        </div>

        {step === 'initial' && (
          <div className="mb-6">
            <button 
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white text-navy-900 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continuar con Google
            </button>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700"></div></div>
              <div className="relative flex justify-center text-sm"><span className="px-2 bg-navy-900 text-slate-400">O regístrate con tu correo</span></div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <User className="w-3 h-3" /> Nombre
              </label>
              <input 
                type="text" 
                required
                placeholder="Ej: Juan"
                className="input-field"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <User className="w-3 h-3" /> Apellido
              </label>
              <input 
                type="text" 
                required
                placeholder="Ej: Pérez"
                className="input-field"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <CreditCard className="w-3 h-3" /> RUT Chileno
            </label>
            <input 
              type="text" 
              required
              placeholder="12.345.678-9"
              className={cn(
                "input-field",
                formData.rut && !validateRut(formData.rut) && "border-red-500 focus:ring-red-500/50"
              )}
              value={formData.rut}
              onChange={handleRutChange}
            />
            {formData.rut && !validateRut(formData.rut) && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> RUT inválido
              </p>
            )}
          </div>

          {step === 'initial' && (
            <>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Mail className="w-3 h-3" /> Email
                </label>
                <input 
                  type="email" 
                  required
                  placeholder="tu@email.com"
                  className="input-field"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Lock className="w-3 h-3" /> Contraseña
                </label>
                <input 
                  type="password" 
                  required
                  minLength={6}
                  placeholder="Mínimo 6 caracteres"
                  className="input-field"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                />
              </div>
            </>
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
              <AlertCircle className="text-red-500 w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                {step === 'initial' ? 'CREAR CUENTA' : 'COMPLETAR REGISTRO'} <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          ¿Ya tienes cuenta? <Link to="/login" className="text-electric-blue hover:underline font-medium">Inicia Sesión</Link>
        </p>
      </motion.div>
    </div>
  );
}
