import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { DashboardLayout } from '../components/DashboardLayout';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { CheckCircle2, XCircle, AlertTriangle, Upload, User, Mail, CreditCard, Gamepad2, Save } from 'lucide-react';

export default function Profile() {
  const [balance, setBalance] = useState(0);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [supercellTag, setSupercellTag] = useState('');
  const [eaId, setEaId] = useState('');
  const [savingGames, setSavingGames] = useState(false);

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
      await updateDoc(docRef, { supercellTag, eaId });
      setUserData((prev: any) => ({ ...prev, supercellTag, eaId }));
      alert("IDs de juego guardados correctamente.");
    } catch (error) {
      console.error("Error saving game IDs", error);
      alert("Error al guardar los IDs.");
    } finally {
      setSavingGames(false);
    }
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
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-[#131b26] border border-[#1f2937] rounded-2xl p-6 flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff66]/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
          <div className="w-16 h-16 bg-[#0a0e17] rounded-full border-2 border-[#00ff66] flex items-center justify-center relative z-10">
            <User className="w-8 h-8 text-[#00ff66]" />
          </div>
          <div className="relative z-10">
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">{userData?.firstName} {userData?.lastName}</h1>
            <p className="text-slate-400 font-medium">{userData?.email}</p>
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
                EA ID (EA FC 24)
              </label>
              <input 
                type="text" 
                placeholder="Ej: xX_Gamer_Xx"
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

      </div>
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
