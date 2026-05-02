import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DashboardLayout } from '../components/DashboardLayout';
import { doc, updateDoc } from 'firebase/firestore';
import { sendEmailVerification } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import { CheckCircle2, XCircle, AlertTriangle, Upload, User, Mail, CreditCard, Gamepad2, Save, LogOut, Calendar, Shield, Bell } from 'lucide-react';
import { ref, uploadBytes } from 'firebase/storage';
import { storage } from '../lib/firebase';

export default function Profile() {
  const navigate = useNavigate();
  const { userData, signOut, refreshUserData, user } = useAuth();
  const { success, error: showError, info, warning } = useToast();
  const emailVerified = user?.emailVerified || false;
  
  const [supercellTag, setSupercellTag] = useState(userData?.supercellTag || '');
  const [nba2kId, setNba2kId] = useState(userData?.nba2kId || '');
  const [eaId, setEaId] = useState(userData?.eaId || '');
  const [epicId, setEpicId] = useState(userData?.epicId || '');
  const [saving, setSaving] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const handleSendVerification = async () => {
    if (!auth.currentUser) return;
    try {
      await sendEmailVerification(auth.currentUser);
      success('¡Enlace enviado!', 'Revisa tu bandeja de entrada.');
    } catch (err: any) {
      if (err.code === 'auth/too-many-requests') warning('Espera', 'Demasiados intentos. Espera unos minutos.');
      else showError('Error', 'No se pudo enviar el enlace.');
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploadingKyc, setUploadingKyc] = useState(false);

  const handleSimulateKYC = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !auth.currentUser) return;
    
    setUploadingKyc(true);
    try {
      // Create a reference in Storage: kyc_documents/uid/filename
      const storageRef = ref(storage, `kyc_documents/${auth.currentUser.uid}/${file.name}`);
      await uploadBytes(storageRef, file);

      // Update Firestore document
      await updateDoc(doc(db, 'users', auth.currentUser.uid), { kycStatus: 'pending' });
      await refreshUserData();
      success('Documento subido', 'Tu cuenta está en revisión y pronto serás verificado.');
    } catch (e: any) { 
      console.error(e);
      showError('Error de subida', 'Asegúrate de que Firebase Storage está habilitado.'); 
    } finally {
      setUploadingKyc(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveGameIds = async () => {
    if (!auth.currentUser) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), { supercellTag, nba2kId, eaId, epicId });
      await refreshUserData();
      success('¡Guardado!', 'IDs de juego actualizados.');
    } catch (e) { showError('Error', 'No se pudieron guardar.'); }
    finally { setSaving(false); }
  };

  const kycStatus = userData?.kycStatus || 'unverified';

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6 pb-12">
        <h1 className="text-3xl font-black text-white uppercase tracking-wider flex items-center gap-3">
          <div className="w-1 h-8 bg-[#00ff66] rounded-full"></div> Mi Cuenta
        </h1>

        {/* Email Verification Alert */}
        {!emailVerified && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <h3 className="text-white font-bold">Verifica tu correo electrónico</h3>
                <p className="text-sm text-slate-400 mt-1">Necesitas verificar tu email para poder realizar retiros. Te enviaremos un enlace de verificación a <span className="text-yellow-400 font-medium">{userData?.email}</span>.</p>
              </div>
            </div>
            <button onClick={handleSendVerification} className="shrink-0 bg-yellow-500 hover:bg-yellow-600 text-black font-black uppercase tracking-wider py-2.5 px-5 rounded-xl text-xs transition-colors shadow-lg">
              Enviar Enlace
            </button>
          </motion.div>
        )}

        {/* Personal Info */}
        <div className="bg-[#16213e] border border-[#0f3460]/50 rounded-2xl p-6">
          <h2 className="text-lg font-black text-white uppercase tracking-wider mb-5 flex items-center gap-2"><User className="w-5 h-5 text-[#00ff66]" /> Información Personal</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <div><p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Nombre</p><p className="text-white font-medium">{userData?.firstName} {userData?.lastName}</p></div>
            <div><p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Email</p><p className="text-white font-medium flex items-center gap-2">{userData?.email} {emailVerified ? <CheckCircle2 className="w-4 h-4 text-[#00ff66]" /> : <XCircle className="w-4 h-4 text-red-500" />}</p></div>
            <div><p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">RUT</p><p className="text-white font-medium">{userData?.rut || 'No ingresado'}</p></div>
            <div><p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Nacimiento</p><p className="text-white font-medium">{userData?.birthDate || 'No ingresada'}</p></div>
          </div>
        </div>

        {/* Verification */}
        <div className="bg-[#16213e] border border-[#0f3460]/50 rounded-2xl p-6">
          <h2 className="text-lg font-black text-white uppercase tracking-wider mb-5 flex items-center gap-2"><Shield className="w-5 h-5 text-[#00ff66]" /> Verificación</h2>
          <div className="space-y-3">
            <div className="bg-[#0a0e17] rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={emailVerified ? 'text-[#00ff66]' : 'text-red-500'}>{emailVerified ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}</div>
                <div><p className="text-white font-bold text-sm">Email</p><p className="text-xs text-slate-500">{emailVerified ? 'Verificado' : 'Sin verificar'}</p></div>
              </div>
              {!emailVerified && <button onClick={handleSendVerification} className="text-xs font-bold text-yellow-400 bg-yellow-500/10 px-3 py-1.5 rounded-lg">Verificar</button>}
            </div>
            <div className="bg-[#0a0e17] rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={kycStatus === 'verified' ? 'text-[#00ff66]' : kycStatus === 'pending' ? 'text-yellow-500' : 'text-red-500'}>
                  {kycStatus === 'verified' ? <CheckCircle2 className="w-5 h-5" /> : kycStatus === 'pending' ? <AlertTriangle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </div>
                <div><p className="text-white font-bold text-sm">Identidad (RUT)</p><p className="text-xs text-slate-500">{kycStatus === 'verified' ? 'Verificado' : kycStatus === 'pending' ? 'En revisión' : 'Sin verificar'}</p></div>
              </div>
              {kycStatus === 'unverified' && (
                <>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleSimulateKYC} className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()} disabled={uploadingKyc} className="text-xs font-bold text-[#00ff66] bg-[#00ff66]/10 px-3 py-1.5 rounded-lg flex items-center gap-1 disabled:opacity-50">
                    {uploadingKyc ? <div className="w-3 h-3 border-2 border-[#00ff66]/30 border-t-[#00ff66] rounded-full animate-spin"></div> : <Upload className="w-3 h-3" />}
                    {uploadingKyc ? 'Subiendo...' : 'Subir Carnet'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Game IDs */}
        <div className="bg-[#16213e] border border-[#0f3460]/50 rounded-2xl p-6">
          <h2 className="text-lg font-black text-white uppercase tracking-wider mb-5 flex items-center gap-2"><Gamepad2 className="w-5 h-5 text-[#00ff66]" /> IDs de Juego</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: 'Supercell Tag (Clash Royale)', value: supercellTag, set: setSupercellTag, placeholder: '#YQ8G9V0' },
              { label: 'PSN / Xbox (NBA 2K)', value: nba2kId, set: setNba2kId, placeholder: 'GamerTag123' },
              { label: 'Epic Games ID (Fortnite)', value: epicId, set: setEpicId, placeholder: 'ProPlayer' },
              { label: 'EA ID (EA FC / FIFA)', value: eaId, set: setEaId, placeholder: 'Player123' },
            ].map((f, i) => (
              <div key={i}>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">{f.label}</label>
                <input type="text" placeholder={f.placeholder} className="w-full bg-[#0a0e17] border border-[#0f3460] focus:border-[#00ff66] text-white rounded-xl px-4 py-3 outline-none transition-colors placeholder:text-slate-600 text-sm" value={f.value} onChange={e => f.set(e.target.value)} />
              </div>
            ))}
          </div>
          <button onClick={handleSaveGameIds} disabled={saving} className="mt-4 bg-[#0f3460] hover:bg-[#1a3a6b] text-white font-bold uppercase tracking-wider py-3 px-6 rounded-xl text-sm transition-colors flex items-center gap-2 disabled:opacity-50">
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save className="w-4 h-4" />} Guardar
          </button>
        </div>

        {/* Logout */}
        <button onClick={() => setShowLogout(true)} className="w-full md:w-auto bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold uppercase tracking-wider py-3 px-8 rounded-xl flex items-center justify-center gap-2 border border-red-500/20 mx-auto">
          <LogOut className="w-4 h-4" /> Cerrar Sesión
        </button>

        <AnimatePresence>
          {showLogout && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowLogout(false)} className="absolute inset-0 bg-black/80"></motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-[#16213e] border border-[#0f3460] rounded-2xl p-6 max-w-sm w-full text-center">
                <LogOut className="w-10 h-10 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-black text-white uppercase mb-2">¿Cerrar sesión?</h3>
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <button onClick={() => setShowLogout(false)} className="bg-[#0f3460] text-white font-bold py-3 rounded-xl">No</button>
                  <button onClick={async () => { await signOut(); navigate('/login'); }} className="bg-red-500 text-white font-bold py-3 rounded-xl">Sí, salir</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
