import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { sendEmailVerification } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';
import { auth } from '../lib/firebase';
import { AlertTriangle } from 'lucide-react';
import { NotificationDropdown } from './notifications/NotificationDropdown';

interface DashboardLayoutProps { children: React.ReactNode; }

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, signOut, user } = useAuth();
  const { success, info, error: showError } = useToast();
  const balance = userData?.balance || 0;
  const emailVerified = user?.emailVerified || false;

  const handleLogout = async () => { await signOut(); navigate('/login'); };

  const handleSendVerification = async () => {
    if (!auth.currentUser) return;
    try {
      await sendEmailVerification(auth.currentUser);
      success('¡Enlace enviado!', 'Revisa tu bandeja de entrada para verificar tu correo.');
    } catch (err: any) {
      if (err.code === 'auth/too-many-requests') showError('Error', 'Espera unos minutos antes de reenviar.');
      else showError('Error', 'No se pudo enviar el enlace de verificación.');
    }
  };

  const navItems = [
    { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/tournaments', icon: 'trophy', label: 'Torneos' },
    { path: '/wallet', icon: 'account_balance_wallet', label: 'Billetera' },
    { path: '/profile', icon: 'settings', label: 'Cuenta', showDot: !emailVerified },
  ];

  return (
    <div className="bg-background text-on-background min-h-screen font-body-md overflow-x-hidden">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-emerald-900/10 flex justify-between items-center px-4 md:px-6 py-3 font-inter tracking-tight">
        <div className="flex items-center gap-8">
          <Link to="/inicio" className="text-xl font-black text-emerald-400 italic tracking-tighter">ARENAPAY</Link>
          <nav className="hidden lg:flex gap-6">
            <Link to="/dashboard" className={`font-label-md text-label-md transition-all duration-200 ${location.pathname === '/dashboard' ? 'text-emerald-400 font-bold border-b-2 border-emerald-400' : 'text-slate-400 font-medium hover:text-slate-100'}`}>DASHBOARD</Link>
            <Link to="/tournaments" className={`font-label-md text-label-md transition-all duration-200 ${location.pathname === '/tournaments' ? 'text-emerald-400 font-bold border-b-2 border-emerald-400' : 'text-slate-400 font-medium hover:text-slate-100'}`}>TORNEOS</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
            <span className="material-symbols-outlined text-emerald-400 text-lg">account_balance_wallet</span>
            <span className="text-emerald-400 font-bold font-body-md">${balance.toLocaleString('es-CL')}</span>
          </div>
          <NotificationDropdown />
          
          <div className="group relative">
            <button className="w-10 h-10 rounded-full border-2 border-emerald-500/50 p-0.5 overflow-hidden active:scale-95 transition-transform flex items-center justify-center bg-surface-container-high text-emerald-400 font-bold">
               {userData?.firstName?.charAt(0) || '?'}
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-surface-container border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
               <div className="p-3 border-b border-white/10">
                 <p className="font-bold text-white text-sm truncate">{userData?.firstName} {userData?.lastName}</p>
                 <p className="text-xs text-slate-400 truncate">{userData?.email}</p>
               </div>
               <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-white/5 rounded-b-xl flex items-center gap-2">
                 <span className="material-symbols-outlined text-sm">logout</span> Cerrar Sesión
               </button>
            </div>
          </div>
        </div>
      </header>

      {/* SideNavBar (Desktop) */}
      <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 overflow-y-auto bg-[#1a1a2e] border-r border-white/5 shadow-2xl shadow-black z-40 pt-20 pb-6">
        <div className="px-6 mb-8 mt-4">
          <p className="font-headline-md text-emerald-400 text-lg italic tracking-tighter">ARENAPAY</p>
          <p className="text-[10px] text-slate-500 tracking-[0.2em] font-bold uppercase">Elite Digital Betting</p>
        </div>
        <nav className="flex flex-col flex-grow divide-y divide-white/5">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className={`flex items-center px-6 py-4 transition-all duration-300 ${isActive ? 'bg-emerald-500/10 text-emerald-400 border-r-4 border-emerald-500' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5 hover:translate-x-1'}`}>
                <span className="material-symbols-outlined mr-4">{item.icon}</span>
                <span className="font-inter font-semibold uppercase text-xs tracking-widest relative">
                  {item.label}
                  {item.showDot && <span className="absolute -top-1 -right-3 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>}
                </span>
              </Link>
            )
          })}
        </nav>
        <div className="px-6 mt-auto">
          <Link to="/wallet" className="block text-center w-full bg-emerald-500 text-slate-950 font-bold py-3 rounded-xl neon-glow hover:bg-emerald-400 transition-colors uppercase text-xs tracking-widest">
            DEPOSITAR
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="md:ml-64 pt-24 pb-24 md:pb-8 px-4 md:px-6 min-h-screen">
        {/* Email Verification Banner */}
        {!emailVerified && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 md:px-6 py-3 flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3 min-w-0">
              <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
              <p className="text-sm text-yellow-200 font-medium truncate">Tu correo no está verificado. Verifica tu email para retiros.</p>
            </div>
            <button onClick={handleSendVerification} className="shrink-0 flex items-center gap-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 font-bold text-xs uppercase tracking-wider px-3 py-2 rounded-lg transition-colors">
              Verificar
            </button>
          </div>
        )}

        {/* Page Content */}
        {children}
      </main>

      {/* BottomNavBar (Mobile) */}
      <nav className="fixed bottom-0 w-full z-50 rounded-t-2xl bg-slate-950/90 backdrop-blur-2xl border-t border-white/10 flex md:hidden justify-around items-center h-16 px-2 pb-safe shadow-[0_-10px_25px_-5px_rgba(0,255,102,0.1)]">
        {navItems.slice(0, 4).map(item => {
           const isActive = location.pathname === item.path;
           return (
             <Link key={item.path} to={item.path} className={`flex flex-col items-center justify-center w-full h-full transition-colors ${isActive ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(0,255,102,0.5)] animate-pulse-subtle' : 'text-slate-500 active:bg-emerald-500/10'}`}>
               <span className="material-symbols-outlined text-lg">{item.icon}</span>
               <span className="font-inter text-[9px] font-bold uppercase mt-1 text-center leading-tight">{item.label}</span>
             </Link>
           )
        })}
        <Link to="/profile" className={`flex flex-col items-center justify-center w-full h-full relative transition-colors ${location.pathname === '/profile' ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(0,255,102,0.5)]' : 'text-slate-500'}`}>
           <span className="material-symbols-outlined text-lg">settings</span>
           <span className="font-inter text-[9px] font-bold uppercase mt-1 text-center leading-tight">Cuenta</span>
           {!emailVerified && <span className="absolute top-2 right-4 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
        </Link>
      </nav>
    </div>
  );
}
