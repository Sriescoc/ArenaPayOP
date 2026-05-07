import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Gamepad2, Wallet, User as UserIcon, LogOut } from 'lucide-react';
import { Logo } from './Logo';
import { auth, db } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { SupportBot } from './SupportBot';

interface DashboardLayoutProps {
  children: React.ReactNode;
  balance: number;
}

export function DashboardLayout({ children, balance }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [hasMissingData, setHasMissingData] = useState(false);

  useEffect(() => {
    const checkUserData = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const isEmailVerified = auth.currentUser.emailVerified;
          // Check if any required data is missing
          if (!data.firstName || !data.lastName || !data.rut || !data.birthDate || !isEmailVerified) {
            setHasMissingData(true);
          } else {
            setHasMissingData(false);
          }
        }
      }
    };
    checkUserData();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: Gamepad2, label: 'Jugar' },
    { path: '/wallet', icon: Wallet, label: 'Billetera' },
    { path: '/profile', icon: UserIcon, label: 'Perfil', showDot: hasMissingData },
  ];

  return (
    <div className="min-h-screen bg-navy-950 pb-20 md:pb-0 md:pt-20 font-sans selection:bg-brand-primary selection:text-black">
      {/* Support Bot */}
      <SupportBot />
      
      {/* Top Navigation (Desktop & Mobile) */}
      <nav className="fixed top-0 w-full z-50 bg-navy-900/80 backdrop-blur-md border-b border-navy-700 h-20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="transition-transform hover:scale-105 active:scale-95">
              <Logo className="scale-75 md:scale-100 origin-left" />
            </Link>
            
            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-2 ml-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-[0.1em] transition-all flex items-center gap-2.5 group font-display ${
                      isActive 
                        ? 'bg-navy-800 text-brand-primary border border-navy-700 shadow-xl' 
                        : 'text-slate-400 hover:text-white hover:bg-navy-800/10'
                    }`}
                  >
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-brand-primary' : ''}`} />
                    {item.label}
                    {item.showDot && (
                      <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse border border-navy-900"></span>
                    )}
                    {isActive && (
                      <motion.div layoutId="activeNav" className="absolute inset-0 border border-brand-primary/20 rounded-xl pointer-events-none" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            {/* Balance Display */}
            <div className="flex items-center bg-navy-950 border border-navy-700 rounded-2xl p-1.5 pr-4 md:pr-6 shadow-inner group transition-all hover:border-brand-primary/30">
              <div className="w-9 h-9 bg-brand-primary/10 rounded-xl flex items-center justify-center mr-3 shadow-lg group-hover:bg-brand-primary/20 transition-colors">
                <span className="text-brand-primary font-black text-lg font-display">$</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] leading-none mb-1 font-display">Billetera</span>
                <span className="text-white font-black leading-tight font-display text-lg">${balance.toLocaleString('es-CL')}</span>
              </div>
            </div>

            <Link to="/wallet" className="hidden md:flex bg-brand-primary hover:bg-brand-secondary text-black font-black uppercase tracking-widest py-3 px-6 rounded-xl text-xs transition-all shadow-[0_0_20px_rgba(0,255,102,0.2)] hover:shadow-[0_0_30px_rgba(0,255,102,0.4)] hover:-translate-y-0.5 active:translate-y-0 font-display">
              CARGAR SALDO
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-24 md:pt-12 pb-24">
        {children}
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="md:hidden fixed bottom-6 left-4 right-4 z-[100] bg-navy-900/90 backdrop-blur-xl border border-navy-700 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link 
                key={item.path}
                to={item.path}
                className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-all rounded-2xl ${
                  isActive ? 'text-brand-primary bg-navy-800' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-6 h-6 transition-transform ${isActive ? 'stroke-[2.5px] scale-110' : ''}`} />
                  {item.showDot && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border-2 border-navy-900"></span>
                  )}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest font-display">{item.label}</span>
              </Link>
            );
          })}
          <button 
            onClick={handleLogout}
            className="flex flex-col items-center justify-center w-full h-full space-y-1 text-slate-500 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-widest font-display">Salir</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
