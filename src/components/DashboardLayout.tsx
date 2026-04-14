import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Gamepad2, Wallet, User as UserIcon, LogOut } from 'lucide-react';
import { Logo } from './Logo';
import { auth, db } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

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
    <div className="min-h-screen bg-[#0a0e17] pb-20 md:pb-0 md:pt-20 font-sans">
      {/* Top Navigation (Desktop & Mobile) */}
      <nav className="fixed top-0 w-full z-50 bg-[#131b26] border-b border-[#1f2937] h-20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/dashboard">
              <Logo className="scale-75 md:scale-100 origin-left" />
            </Link>
            
            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1 ml-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 ${
                      isActive 
                        ? 'bg-[#1f2937] text-white' 
                        : 'text-slate-400 hover:text-white hover:bg-[#1a242d]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                    {item.showDot && (
                      <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-4">
            {/* Balance Display */}
            <div className="flex items-center bg-[#0a0e17] border border-[#1f2937] rounded-xl p-1 pr-3 md:pr-4">
              <div className="w-8 h-8 bg-[#00ff66]/10 rounded-lg flex items-center justify-center mr-2 md:mr-3">
                <span className="text-[#00ff66] font-bold">$</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Saldo</span>
                <span className="text-white font-black leading-tight">${balance.toLocaleString('es-CL')}</span>
              </div>
            </div>

            <Link to="/wallet" className="hidden md:flex bg-[#00ff66] hover:bg-[#00cc55] text-black font-black uppercase tracking-wider py-2 px-4 rounded-lg text-sm transition-colors shadow-[0_0_15px_rgba(0,255,102,0.2)]">
              DEPOSITAR
            </Link>

            <button 
              onClick={handleLogout}
              className="hidden md:flex p-2 hover:bg-red-500/10 rounded-xl transition-colors text-slate-400 hover:text-red-400 ml-2"
              title="Cerrar Sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-24 md:pt-8">
        {children}
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 w-full z-50 bg-[#131b26] border-t border-[#1f2937] pb-safe">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link 
                key={item.path}
                to={item.path}
                className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 ${
                  isActive ? 'text-[#00ff66]' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : ''}`} />
                  {item.showDot && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border-2 border-[#131b26]"></span>
                  )}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
              </Link>
            );
          })}
          
          {/* Mobile Logout */}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center justify-center w-full h-full space-y-1 text-slate-500 hover:text-red-400"
          >
            <LogOut className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Salir</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
