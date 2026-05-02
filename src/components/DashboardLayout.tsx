import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Gamepad2, Wallet, User as UserIcon, LogOut, Menu, X, AlertTriangle, Mail, ChevronRight } from 'lucide-react';
import { sendEmailVerification } from 'firebase/auth';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';
import { auth } from '../lib/firebase';

interface DashboardLayoutProps { children: React.ReactNode; }

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, signOut, user } = useAuth();
  const { success, info, error: showError } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    { path: '/dashboard', icon: Gamepad2, label: 'Juegos' },
    { path: '/wallet', icon: Wallet, label: 'Billetera' },
    { path: '/profile', icon: UserIcon, label: 'Cuenta', showDot: !emailVerified },
  ];

  return (
    <div className="min-h-screen bg-[#1a1a2e] font-sans flex">
      {/* Sidebar — Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#16213e] border-r border-[#0f3460]/50 fixed inset-y-0 left-0 z-40">
        <div className="p-5 border-b border-[#0f3460]/50">
          <Link to="/dashboard"><Logo className="scale-90 origin-left" /></Link>
        </div>

        {/* Balance Card */}
        <div className="mx-4 mt-4 bg-gradient-to-br from-[#00ff66]/10 to-[#0f3460]/30 border border-[#00ff66]/20 rounded-xl p-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tu Saldo</p>
          <p className="text-2xl font-black text-white">${balance.toLocaleString('es-CL')} <span className="text-xs text-slate-500 font-bold">CLP</span></p>
          <Link to="/wallet" className="mt-3 w-full bg-[#00ff66] hover:bg-[#00cc55] text-black font-black uppercase tracking-wider py-2 rounded-lg text-xs text-center block transition-colors">Depositar</Link>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 mt-6 px-3 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/20' : 'text-slate-400 hover:text-white hover:bg-[#0f3460]/30'}`}>
                <Icon className="w-5 h-5" />{item.label}
                {item.showDot && <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-[#0f3460]/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-[#0f3460] rounded-full flex items-center justify-center text-[#00ff66] font-black text-sm">{userData?.firstName?.charAt(0) || '?'}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-bold truncate">{userData?.firstName} {userData?.lastName}</p>
              <p className="text-[10px] text-slate-500 truncate">{userData?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-red-400 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors hover:bg-red-500/5">
            <LogOut className="w-4 h-4" /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64">
        {/* Top Bar — Mobile */}
        <nav className="md:hidden fixed top-0 w-full z-50 bg-[#16213e] border-b border-[#0f3460]/50 h-16">
          <div className="px-4 h-full flex items-center justify-between">
            <button onClick={() => setSidebarOpen(true)} className="text-white"><Menu className="w-6 h-6" /></button>
            <Logo className="scale-75" />
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-[#00ff66]">${balance.toLocaleString('es-CL')}</span>
            </div>
          </div>
        </nav>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-[100]">
            <div className="absolute inset-0 bg-black/70" onClick={() => setSidebarOpen(false)}></div>
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-[#16213e] border-r border-[#0f3460]/50 flex flex-col">
              <div className="p-4 flex items-center justify-between border-b border-[#0f3460]/50">
                <Logo className="scale-75 origin-left" />
                <button onClick={() => setSidebarOpen(false)} className="text-white"><X className="w-6 h-6" /></button>
              </div>
              <div className="mx-4 mt-4 bg-gradient-to-br from-[#00ff66]/10 to-[#0f3460]/30 border border-[#00ff66]/20 rounded-xl p-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Saldo</p>
                <p className="text-xl font-black text-white">${balance.toLocaleString('es-CL')}</p>
              </div>
              <nav className="flex-1 mt-4 px-3 space-y-1">
                {navItems.map(item => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)} className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-[#00ff66]/10 text-[#00ff66]' : 'text-slate-400 hover:text-white'}`}>
                      <Icon className="w-5 h-5" />{item.label}
                      {item.showDot && <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-[#0f3460]/50">
                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-red-400 py-2 text-xs font-bold uppercase"><LogOut className="w-4 h-4" /> Cerrar Sesión</button>
              </div>
            </div>
          </div>
        )}

        {/* Email Verification Banner */}
        {!emailVerified && (
          <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-4 md:px-6 py-3 flex items-center justify-between gap-3 mt-16 md:mt-0">
            <div className="flex items-center gap-3 min-w-0">
              <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0" />
              <p className="text-sm text-yellow-200 font-medium truncate">Tu correo no está verificado. Verifica tu email para habilitar retiros.</p>
            </div>
            <button onClick={handleSendVerification} className="shrink-0 flex items-center gap-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 font-bold text-xs uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors">
              <Mail className="w-3.5 h-3.5" /> Verificar <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Page Content */}
        <main className={`px-4 md:px-6 py-6 ${!emailVerified ? '' : 'pt-20 md:pt-6'}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
