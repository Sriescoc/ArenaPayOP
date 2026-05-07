import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithPopup, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { formatRut, validateRut, cn } from '../lib/utils';
import { ArrowRight, Mail, User, CreditCard, AlertCircle, Lock, Calendar } from 'lucide-react';
import { Logo } from '../components/Logo';

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'initial' | 'google-rut'>('initial');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    rut: '',
    birthDate: '',
    email: '',
    password: ''
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRut(e.target.value);
    setFormData(prev => ({ ...prev, rut: formatted }));
  };

  const saveUserToFirestore = async (uid: string, data: any) => {
    try {
      // First, attempt to secure the unique RUT
      const rutRef = doc(db, 'unique_ruts', data.rut);
      const rutDoc = await getDoc(rutRef);
      
      if (rutDoc.exists() && rutDoc.data().uid !== uid) {
        throw new Error('UNIQUE_RUT_EXISTS');
      }
      
      // If doesn't exist, we set it. Note: In a production app, this should be a transaction.
      // Since specific instructions for uniqueness were given, we enforce this check.
      if (!rutDoc.exists()) {
        await setDoc(rutRef, { uid });
      }

      await setDoc(doc(db, 'users', uid), {
        uid,
        firstName: data.firstName,
        lastName: data.lastName,
        rut: data.rut,
        birthDate: data.birthDate,
        email: data.email,
        createdAt: serverTimestamp(),
        role: 'user',
        balance: 0,
        withdrawableBalance: 0,
        kycStatus: 'unverified'
      });
    } catch (err: any) {
      if (err.message === 'UNIQUE_RUT_EXISTS') throw err;
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

    if (!formData.birthDate) {
      setError('Debes ingresar tu fecha de nacimiento.');
      return;
    }

    if (!acceptedTerms) {
      setError('Debes aceptar los términos y condiciones para continuar.');
      return;
    }

    setLoading(true);
    try {
      if (step === 'initial') {
        // Check if RUT is already taken BEFORE creating Auth user to avoid orphaned accounts
        const rutRef = doc(db, 'unique_ruts', formData.rut);
        const rutDoc = await getDoc(rutRef);
        if (rutDoc.exists()) {
          throw new Error('UNIQUE_RUT_EXISTS');
        }

        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await saveUserToFirestore(userCredential.user.uid, formData);
        await sendEmailVerification(userCredential.user);
        navigate('/dashboard');
      } else if (step === 'google-rut') {
        if (!auth.currentUser) throw new Error("No user found");
        await saveUserToFirestore(auth.currentUser.uid, formData);
        // Google accounts are usually verified, but we can send it anyway if not
        if (!auth.currentUser.emailVerified) {
          await sendEmailVerification(auth.currentUser);
        }
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error(err);
      if (err.message === 'UNIQUE_RUT_EXISTS') {
        setError('El RUT ingresado ya está registrado en otra cuenta.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('El correo ya está registrado. Por favor inicia sesión.');
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña debe tener al menos 6 caracteres.');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Las credenciales proporcionadas no son válidas.');
      } else {
        setError(`Error al registrar: ${err.message}`);
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
        navigate('/dashboard');
      } else {
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
      if (err.code === 'auth/unauthorized-domain') {
        setError(
          <div className="space-y-2 text-left">
            <p className="font-bold text-red-400">Error de configuración de Firebase</p>
            <p className="text-xs">Para registrarte, este dominio debe estar autorizado en el Panel de Firebase:</p>
            <div className="bg-black/30 p-2 rounded-lg text-[10px] font-mono break-all my-2 border border-white/5 select-all">
              {window.location.hostname}
            </div>
            <a 
              href={`https://console.firebase.google.com/project/arenapay-7f1cf/authentication/settings`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#00ff66]/20 hover:bg-[#00ff66]/30 text-[#00ff66] text-xs font-bold px-3 py-2 rounded-xl transition-all border border-[#00ff66]/30 w-full justify-center"
            >
              Configurar en Firebase Console
            </a>
          </div>
        );
      } else if (err.code === 'auth/invalid-credential') {
        setError('Las credenciales de Google no son válidas o han expirado.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('La ventana de registro fue cerrada antes de completar el proceso.');
      } else {
        setError(`Error al registrar con Google. Por favor intenta nuevamente.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 md:py-20 relative bg-[#0a0e17] font-sans overflow-y-auto">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 fixed">
        <img 
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80" 
          alt="Gaming Background" 
          className="w-full h-full object-cover opacity-30 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e17]/60 via-[#0a0e17]/80 to-[#0a0e17]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#131b26]/90 backdrop-blur-xl max-w-xl w-full relative z-10 border border-[#1f2937] hover:border-[#00ff66]/30 transition-colors rounded-3xl shadow-[0_0_50px_rgba(0,255,102,0.1)] p-6 md:p-8 my-auto"
      >
        <div className="flex flex-col items-center mb-8">
          <Link to="/inicio">
            <Logo className="mb-6 scale-100 md:scale-110" />
          </Link>
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">
              {step === 'initial' ? 'CREAR CUENTA' : 'COMPLETA TU PERFIL'}
            </h1>
            <p className="text-xs md:text-sm text-[#00ff66] font-bold uppercase tracking-wider mt-1">
              {step === 'initial' ? 'Únete a la élite de ArenaPay' : 'Seguridad y verificación'}
            </p>
          </div>
        </div>

        {step === 'initial' && (
          <div className="mb-8">
            <button 
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white text-black font-black uppercase tracking-wider py-3.5 px-4 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-200 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm md:text-base"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continuar con Google
            </button>
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#1f2937]"></div></div>
              <div className="relative flex justify-center text-sm"><span className="px-4 bg-[#131b26] text-slate-500 font-bold uppercase tracking-wider">O regístrate con tu correo</span></div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-[#00ff66]" /> Nombre
              </label>
              <input 
                type="text" 
                required
                placeholder="Ej: Juan"
                className="w-full bg-[#0a0e17] border border-[#1f2937] focus:border-[#00ff66] text-white rounded-xl px-4 py-3 outline-none transition-colors placeholder:text-slate-600"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-[#00ff66]" /> Apellido
              </label>
              <input 
                type="text" 
                required
                placeholder="Ej: Pérez"
                className="w-full bg-[#0a0e17] border border-[#1f2937] focus:border-[#00ff66] text-white rounded-xl px-4 py-3 outline-none transition-colors placeholder:text-slate-600"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 text-[#00ff66]" /> RUT Chileno
              </label>
              <input 
                type="text" 
                required
                placeholder="12.345.678-9"
                className={cn(
                  "w-full bg-[#0a0e17] border border-[#1f2937] focus:border-[#00ff66] text-white rounded-xl px-4 py-3 outline-none transition-colors placeholder:text-slate-600",
                  formData.rut && !validateRut(formData.rut) && "border-red-500 focus:border-red-500"
                )}
                value={formData.rut}
                onChange={handleRutChange}
              />
              {formData.rut && !validateRut(formData.rut) && (
                <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" /> RUT inválido
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#00ff66]" /> Fecha de Nacimiento
              </label>
              <input 
                type="date" 
                required
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                className="w-full bg-[#0a0e17] border border-[#1f2937] focus:border-[#00ff66] text-white rounded-xl px-4 py-3 outline-none transition-colors placeholder:text-slate-600 [color-scheme:dark]"
                value={formData.birthDate}
                onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
              />
            </div>
          </div>

          {step === 'initial' && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#00ff66]" /> Email
                </label>
                <input 
                  type="email" 
                  required
                  placeholder="tu@email.com"
                  className="w-full bg-[#0a0e17] border border-[#1f2937] focus:border-[#00ff66] text-white rounded-xl px-4 py-3 outline-none transition-colors placeholder:text-slate-600"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-[#00ff66]" /> Contraseña
                </label>
                <input 
                  type="password" 
                  required
                  minLength={6}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full bg-[#0a0e17] border border-[#1f2937] focus:border-[#00ff66] text-white rounded-xl px-4 py-3 outline-none transition-colors placeholder:text-slate-600"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                />
              </div>
            </>
          )}

          {/* Professional Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center mt-0.5">
                <input 
                  type="checkbox" 
                  required
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="peer appearance-none w-5 h-5 border-2 border-[#1f2937] rounded bg-[#0a0e17] checked:bg-[#00ff66] checked:border-[#00ff66] transition-colors cursor-pointer shrink-0"
                />
                <svg className="absolute w-3.5 h-3.5 text-black opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span className="text-xs md:text-sm text-slate-400 leading-tight group-hover:text-slate-300 transition-colors">
                Confirmo que soy mayor de 18 años y acepto los <Link to="/terminos" target="_blank" className="text-[#00ff66] hover:text-[#00cc55] hover:underline transition-colors">Términos de Servicio</Link> y la <Link to="/privacidad" target="_blank" className="text-[#00ff66] hover:text-[#00cc55] hover:underline transition-colors">Política de Privacidad</Link> de ArenaPay.
              </span>
            </label>
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
            className="w-full bg-[#00ff66] hover:bg-[#00cc55] text-black font-black uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,255,102,0.2)] hover:shadow-[0_0_30px_rgba(0,255,102,0.4)] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
            ) : (
              <>
                {step === 'initial' ? 'CREAR CUENTA' : 'COMPLETAR REGISTRO'} <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500 font-medium">
          ¿Ya tienes cuenta? <Link to="/login" className="text-[#00ff66] hover:text-[#00cc55] hover:underline font-bold transition-colors">Inicia Sesión aquí</Link>
        </p>
      </motion.div>
    </div>
  );
}
