import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { Bell, Check, Trash2, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface AppNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  link?: string;
  read: boolean;
  createdAt: any;
}

export function NotificationDropdown() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'notifications'), 
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snap) => {
      setNotifications(snap.docs.map(d => ({ id: d.id, ...d.data() } as AppNotification)));
    });
    return () => unsubscribe();
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (id: string) => {
    try { await updateDoc(doc(db, 'notifications', id), { read: true }); } catch (e) {}
  };

  const handleNotificationClick = async (notif: AppNotification) => {
    if (!notif.read) await handleMarkAsRead(notif.id);
    setIsOpen(false);
    if (notif.link) navigate(notif.link);
  };

  const handleMarkAllRead = () => {
    notifications.filter(n => !n.read).forEach(n => handleMarkAsRead(n.id));
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-slate-400 hover:text-white transition-all p-2 rounded-lg hover:bg-white/5 active:scale-95 flex items-center justify-center"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-950 animate-pulse"></span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-container border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-surface-container-high shrink-0">
              <h3 className="font-bold text-white uppercase tracking-widest text-sm flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-500" /> Notificaciones
              </h3>
              {unreadCount > 0 && (
                <button onClick={handleMarkAllRead} className="text-[10px] text-emerald-400 font-bold hover:text-emerald-300 transition-colors uppercase tracking-wider">
                  Marcar leídas
                </button>
              )}
            </div>

            <div className="overflow-y-auto flex-1 p-2">
              {notifications.length === 0 ? (
                <div className="p-6 text-center">
                  <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">No tienes notificaciones</p>
                </div>
              ) : (
                notifications.map(notif => (
                  <div 
                    key={notif.id} 
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-3 rounded-xl cursor-pointer transition-colors mb-1 ${notif.read ? 'hover:bg-white/5 opacity-70' : 'bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/10'}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-sm font-bold ${notif.read ? 'text-slate-300' : 'text-emerald-400'}`}>{notif.title}</h4>
                      {!notif.read && <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0 mt-1.5"></span>}
                    </div>
                    <p className="text-xs text-slate-400 mb-2 leading-relaxed">{notif.body}</p>
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 
                      {notif.createdAt ? new Date(notif.createdAt.toDate()).toLocaleDateString('es-CL', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' }) : 'ahora'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
