import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { formatRut, validateRut } from '../lib/utils';
import { Mail, Lock, Eye, EyeOff, User, CreditCard, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Logo } from '../components/Logo';
import { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';

type Step = 'credentials' | 'profile';

export default function Register() {
  const navigate = useNavigate();
  const { user, userData } = useAuth();

  // If user already has a complete profile, redirect to dashboard
  useEffect(() => {
    if (user && userData) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, userData, navigate]);
  const { success, error: showError } = useToast();
  const [step, setStep] = useState<Step>('credentials');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const [formData, setFormData] = useState({ firstName: '', lastName: '', rut: '', birthDate: '' });
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleGoogleRegister = async () => {
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Check if user profile already exists
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (userDoc.exists()) {
        success('¡Bienvenido de vuelta!', 'Ya tenías una cuenta.');
        navigate('/dashboard');
      } else {
        // Pre-fill email and go to profile step
        setEmail(result.user.email || '');
        setStep('profile');
      }
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') showError('Error', 'No se pudo registrar con Google.');
    }
  };

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return; }
    if (password !== confirmPass) { setError('Las contraseñas no coinciden.'); return; }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setStep('profile');
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') setError('Este correo ya está registrado. ¿Quieres iniciar sesión?');
      else if (err.code === 'auth/invalid-email') setError('El correo no es válido.');
      else if (err.code === 'auth/weak-password') setError('La contraseña es muy débil.');
      else setError('Error al crear la cuenta.');
    } finally { setLoading(false); }
  };

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.firstName || !formData.lastName) { setError('Completa tu nombre y apellido.'); return; }
    if (!validateRut(formData.rut)) { setError('El RUT ingresado no es válido.'); return; }
    if (!formData.birthDate) { setError('Ingresa tu fecha de nacimiento.'); return; }
    const age = new Date().getFullYear() - new Date(formData.birthDate).getFullYear();
    if (age < 18) { setError('Debes ser mayor de 18 años.'); return; }
    if (!acceptedTerms) { setError('Debes aceptar los términos.'); return; }
    if (!auth.currentUser) { setError('Sesión expirada. Recarga la página.'); return; }

    setLoading(true);
    try {
      await updateProfile(auth.currentUser, { displayName: `${formData.firstName} ${formData.lastName}` });
      await setDoc(doc(db, 'users', auth.currentUser.uid), {
        uid: auth.currentUser.uid,
        firstName: formData.firstName,
        lastName: formData.lastName,
        rut: formData.rut,
        birthDate: formData.birthDate,
        email: email || auth.currentUser.email,
        createdAt: serverTimestamp(),
        role: 'user',
        balance: 0,
        withdrawableBalance: 0,
        kycStatus: 'unverified'
      });
      success('¡Cuenta creada!', 'Bienvenido a ArenaPay.');
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError('Error al guardar el perfil. Inténtalo de nuevo.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-[#1a1a2e] font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e] via-[#1a1a2e]/90 to-[#1a1a2e]"></div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-lg">
        <div className="bg-[#16213e]/95 backdrop-blur-xl border border-[#0f3460]/50 rounded-2xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col items-center mb-6">
            <Link to="/inicio"><Logo className="mb-4" /></Link>
            <h1 className="text-2xl font-black text-white uppercase tracking-wider">
              {step === 'credentials' ? 'Crear Cuenta' : 'Completa tu Perfil'}
            </h1>
            {/* Steps */}
            <div className="flex items-center gap-2 mt-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${step === 'credentials' ? 'bg-[#00ff66] text-black' : 'bg-[#00ff66] text-black'}`}>
                {step === 'profile' ? <CheckCircle2 className="w-4 h-4" /> : '1'}
              </div>
              <div className={`w-10 h-0.5 ${step === 'profile' ? 'bg-[#00ff66]' : 'bg-[#0f3460]'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${step === 'profile' ? 'bg-[#00ff66]/20 text-[#00ff66] border border-[#00ff66]' : 'bg-[#0f3460] text-slate-500'}`}>2</div>
            </div>
          </div>

          {step === 'credentials' ? (
            <>
              <button onClick={handleGoogleRegister} className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-bold py-3.5 rounded-xl transition-all mb-6 shadow-lg">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Registrarse con Google
              </button>
              <div className="flex items-center gap-4 mb-6"><div className="flex-1 h-px bg-[#0f3460]"></div><span className="text-xs font-bold text-slate-500 uppercase">o</span><div className="flex-1 h-px bg-[#0f3460]"></div></div>

              <form onSubmit={handleCredentials} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-2"><Mail className="w-3.5 h-3.5 text-[#00ff66]" /> Email</label>
                  <input type="email" required placeholder="tu@email.com" className="w-full bg-[#0a0e17] border border-[#0f3460] focus:border-[#00ff66] text-white rounded-xl px-4 py-3 outline-none transition-colors placeholder:text-slate-600" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-2"><Lock className="w-3.5 h-3.5 text-[#00ff66]" /> Contraseña</label>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'} required placeholder="Mínimo 6 caracteres" className="w-full bg-[#0a0e17] border border-[#0f3460] focus:border-[#00ff66] text-white rounded-xl px-4 py-3 pr-12 outline-none transition-colors placeholder:text-slate-600" value={password} onChange={e => setPassword(e.target.value)} />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">{showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-2"><Lock className="w-3.5 h-3.5 text-[#00ff66]" /> Confirmar Contraseña</label>
                  <input type="password" required placeholder="Repite tu contraseña" className="w-full bg-[#0a0e17] border border-[#0f3460] focus:border-[#00ff66] text-white rounded-xl px-4 py-3 outline-none transition-colors placeholder:text-slate-600" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} />
                </div>
                {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2"><AlertCircle className="text-red-400 w-4 h-4 shrink-0 mt-0.5" /><p className="text-sm text-red-300">{error}</p></motion.div>}
                <button type="submit" disabled={loading} className="w-full bg-[#00ff66] hover:bg-[#00cc55] text-black font-black uppercase tracking-wider py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(0,255,102,0.3)] disabled:opacity-50">{loading ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin mx-auto"></div> : 'CREAR CUENTA'}</button>
              </form>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <form onSubmit={handleCompleteProfile} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-2"><User className="w-3.5 h-3.5 text-[#00ff66]" /> Nombre</label>
                    <input type="text" required placeholder="Juan" className="w-full bg-[#0a0e17] border border-[#0f3460] focus:border-[#00ff66] text-white rounded-xl px-4 py-3 outline-none transition-colors placeholder:text-slate-600" value={formData.firstName} onChange={e => setFormData(p => ({...p, firstName: e.target.value}))} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-2"><User className="w-3.5 h-3.5 text-[#00ff66]" /> Apellido</label>
                    <input type="text" required placeholder="Pérez" className="w-full bg-[#0a0e17] border border-[#0f3460] focus:border-[#00ff66] text-white rounded-xl px-4 py-3 outline-none transition-colors placeholder:text-slate-600" value={formData.lastName} onChange={e => setFormData(p => ({...p, lastName: e.target.value}))} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-2"><CreditCard className="w-3.5 h-3.5 text-[#00ff66]" /> RUT</label>
                    <input type="text" required placeholder="12.345.678-9" className={`w-full bg-[#0a0e17] border ${formData.rut && !validateRut(formData.rut) ? 'border-red-500' : 'border-[#0f3460]'} focus:border-[#00ff66] text-white rounded-xl px-4 py-3 outline-none transition-colors placeholder:text-slate-600`} value={formData.rut} onChange={e => setFormData(p => ({...p, rut: formatRut(e.target.value)}))} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-2"><Calendar className="w-3.5 h-3.5 text-[#00ff66]" /> Nacimiento</label>
                    <input type="date" required max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]} className="w-full bg-[#0a0e17] border border-[#0f3460] focus:border-[#00ff66] text-white rounded-xl px-4 py-3 outline-none transition-colors [color-scheme:dark]" value={formData.birthDate} onChange={e => setFormData(p => ({...p, birthDate: e.target.value}))} />
                  </div>
                </div>
                <label className="flex items-start gap-3 cursor-pointer pt-2">
                  <input type="checkbox" checked={acceptedTerms} onChange={e => setAcceptedTerms(e.target.checked)} className="mt-1 w-4 h-4 accent-[#00ff66] rounded" />
                  <span className="text-xs text-slate-400">Soy mayor de 18 años y acepto los <Link to="/terminos" target="_blank" className="text-[#00ff66] hover:underline">Términos</Link> y la <Link to="/privacidad" target="_blank" className="text-[#00ff66] hover:underline">Política de Privacidad</Link>.</span>
                </label>
                {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2"><AlertCircle className="text-red-400 w-4 h-4 shrink-0 mt-0.5" /><p className="text-sm text-red-300">{error}</p></motion.div>}
                <button type="submit" disabled={loading} className="w-full bg-[#00ff66] hover:bg-[#00cc55] text-black font-black uppercase tracking-wider py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(0,255,102,0.3)] disabled:opacity-50">{loading ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin mx-auto"></div> : 'COMPLETAR REGISTRO'}</button>
              </form>
            </motion.div>
          )}

          <p className="mt-6 text-center text-sm text-slate-500">¿Ya tienes cuenta? <Link to="/login" className="text-[#00ff66] hover:underline font-bold">Inicia Sesión</Link></p>
        </div>
      </motion.div>
    </div>
  );
}
