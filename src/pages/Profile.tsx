import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DashboardLayout } from '../components/DashboardLayout';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, AlertTriangle, Upload, User, Mail, CreditCard, Gamepad2, Save, LogOut, Calendar } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [supercellTag, setSupercellTag] = useState('');
  const [nbaId, setNbaId] = useState('');
  const [eaId, setEaId] = useState('');
  const [savingGames, setSavingGames] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);
          setBalance(data.balance || 0);
          setSupercellTag(data.supercellTag || '');
          setNbaId(data.nbaId || '');
          setEaId(data.eaId || '');
        }
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleSimulateKYC = async () => {
    if (!auth.currentUser) return;
    try {
      const docRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(docRef, { kycStatus: 'pending' });
      setUserData((prev: any) => ({ ...prev, kycStatus: 'pending' }));
      alert("Documentos enviados. Tu cuenta está en revisión.");
    } catch (error) {
      console.error("Error updating KYC status", error);
    }
  };

  const handleSaveGameIds = async () => {
    if (!auth.currentUser) return;
    setSavingGames(true);
    try {
      const docRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(docRef, { supercellTag, nbaId, eaId });
      setUserData((prev: any) => ({ ...prev, supercellTag, nbaId, eaId }));
      alert("IDs de juego guardados correctamente.");
    } catch (error) {
      console.error("Error saving game IDs", error);
      alert("Error al guardar los IDs.");
    } finally {
      setSavingGames(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  if (loading) {
    return (
      <DashboardLayout balance={0}>
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-[#00ff66] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  const isEmailVerified = auth.currentUser?.emailVerified || false;
  const kycStatus = userData?.kycStatus || 'unverified'; // unverified, pending, verified

  return (
    <DashboardLayout balance={balance}>
      <div className="max-w-3xl mx-auto space-y-6 pb-8">
        
        {/* Header - Personal Info */}
        <div className="bg-[#131b26] border border-[#1f2937] rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff66]/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
          
          <h2 className="text-xl font-black text-white uppercase tracking-wider mb-6 flex items-center gap-2 relative z-10">
            <User className="w-5 h-5 text-[#00ff66]" /> Información Personal
          </h2>
          
          <div className="flex flex-col md:flex-row gap-6 relative z-10">
            <div className="w-20 h-20 bg-[#0a0e17] rounded-full border-2 border-[#00ff66] flex items-center justify-center shrink-0">
              <User className="w-10 h-10 text-[#00ff66]" />
            </div>
            
            <div className="flex-1 grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Nombre Completo</p>
                <p className="text-white font-medium text-lg">{userData?.firstName} {userData?.lastName}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> Correo Electrónico</p>
                <p className="text-white font-medium">{userData?.email}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1"><CreditCard className="w-3.5 h-3.5" /> RUT</p>
                <p className="text-white font-medium">{userData?.rut || 'No ingresado'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Fecha de Nacimiento</p>
                <p className="text-white font-medium">{userData?.birthDate ? new Date(userData.birthDate).toLocaleDateString() : 'No ingresada'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Status */}
        <div className="bg-[#131b26] border border-[#1f2937] rounded-2xl p-6">
          <h2 className="text-xl font-black text-white uppercase tracking-wider mb-6 flex items-center gap-2">
            <ShieldIcon className="w-5 h-5 text-[#00ff66]" /> Estado de Verificación
          </h2>

          <div className="space-y-4">
            {/* Email Verification */}
            <div className="bg-[#0a0e17] rounded-xl p-4 border border-[#1f2937] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`mt-1 ${isEmailVerified ? 'text-[#00ff66]' : 'text-yellow-500'}`}>
                  {isEmailVerified ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-white font-bold flex items-center gap-2 uppercase tracking-wider text-sm">
                    <Mail className="w-4 h-4 text-slate-400" /> Correo Electrónico
                  </h3>
                  <p className="text-sm text-slate-400 mt-1 font-medium">
                    {isEmailVerified 
                      ? 'Tu correo electrónico ha sido verificado.' 
                      : 'Necesitas verificar tu correo para poder depositar y jugar.'}
                  </p>
                </div>
              </div>
              {!isEmailVerified && (
                <button className="bg-[#1f2937] hover:bg-[#374151] text-white font-bold uppercase tracking-wider py-2 px-4 rounded-lg text-xs transition-colors whitespace-nowrap">
                  Enviar Link
                </button>
              )}
            </div>

            {/* RUT Verification (KYC) */}
            <div className="bg-[#0a0e17] rounded-xl p-4 border border-[#1f2937] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`mt-1 ${
                  kycStatus === 'verified' ? 'text-[#00ff66]' : 
                  kycStatus === 'pending' ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {kycStatus === 'verified' ? <CheckCircle2 className="w-5 h-5" /> : 
                   kycStatus === 'pending' ? <AlertTriangle className="w-5 h-5" /> : 
                   <XCircle className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-white font-bold flex items-center gap-2 uppercase tracking-wider text-sm">
                    <CreditCard className="w-4 h-4 text-slate-400" /> Identidad (RUT)
                  </h3>
                  <p className="text-sm text-slate-400 mt-1 font-medium">
                    {kycStatus === 'verified' ? 'Tu identidad ha sido verificada. Puedes retirar fondos.' :
                     kycStatus === 'pending' ? 'Tus documentos están en revisión. Esto puede tomar hasta 24 hrs.' :
                     'Sube una foto de tu carnet para poder retirar tus ganancias.'}
                  </p>
                </div>
              </div>
              {kycStatus === 'unverified' && (
                <button onClick={handleSimulateKYC} className="bg-[#00ff66] hover:bg-[#00cc55] text-black font-black uppercase tracking-wider py-2 px-4 rounded-lg text-xs transition-all flex items-center gap-2 whitespace-nowrap shadow-[0_0_15px_rgba(0,255,102,0.2)]">
                  <Upload className="w-4 h-4" /> Subir Carnet
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Game IDs */}
        <div className="bg-[#131b26] border border-[#1f2937] rounded-2xl p-6">
          <h2 className="text-xl font-black text-white uppercase tracking-wider mb-6 flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-[#00ff66]" /> IDs de Juego
          </h2>
          <p className="text-sm text-slate-400 mb-6">
            Añade tus IDs para que se autocompleten al crear una partida.
          </p>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Supercell Player Tag (Clash Royale)
              </label>
              <input 
                type="text" 
                placeholder="Ej: #YQ8G9V0"
                className="w-full bg-[#0a0e17] border border-[#1f2937] focus:border-[#00ff66] text-white rounded-xl px-4 py-3 outline-none transition-colors placeholder:text-slate-600"
                value={supercellTag}
                onChange={(e) => setSupercellTag(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                ID de Consola (PSN / Xbox Gamertag) para NBA
              </label>
              <input 
                type="text" 
                placeholder="Ej: xX_Gamer_Xx"
                className="w-full bg-[#0a0e17] border border-[#1f2937] focus:border-[#00ff66] text-white rounded-xl px-4 py-3 outline-none transition-colors placeholder:text-slate-600"
                value={nbaId}
                onChange={(e) => setNbaId(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                EA ID (EA FC 24)
              </label>
              <input 
                type="text" 
                placeholder="Ej: ProPlayer123"
                className="w-full bg-[#0a0e17] border border-[#1f2937] focus:border-[#00ff66] text-white rounded-xl px-4 py-3 outline-none transition-colors placeholder:text-slate-600"
                value={eaId}
                onChange={(e) => setEaId(e.target.value)}
              />
            </div>
            <div className="pt-2">
              <button 
                onClick={handleSaveGameIds}
                disabled={savingGames}
                className="bg-[#1f2937] hover:bg-[#374151] text-white font-bold uppercase tracking-wider py-3 px-6 rounded-xl text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {savingGames ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Guardar IDs
              </button>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="pt-6">
          <button 
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full md:w-auto bg-red-500/10 hover:bg-red-500/20 text-red-500 font-black uppercase tracking-wider py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all border border-red-500/20 hover:border-red-500/40 mx-auto"
          >
            <LogOut className="w-5 h-5" /> Cerrar Sesión
          </button>
        </div>

      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-[#131b26] border border-[#1f2937] rounded-2xl shadow-2xl p-6 text-center"
            >
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                <LogOut className="w-8 h-8 ml-1" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2">Cerrar Sesión</h3>
              <p className="text-slate-400 mb-6 font-medium">¿Estás seguro que deseas cerrar sesión?</p>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="bg-[#1f2937] hover:bg-[#374151] text-white font-bold uppercase tracking-wider py-3 rounded-xl text-sm transition-colors"
                >
                  No
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold uppercase tracking-wider py-3 rounded-xl text-sm transition-colors shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                >
                  Sí, Salir
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </DashboardLayout>
  );
}

function ShieldIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
  );
}
