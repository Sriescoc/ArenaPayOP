import React, { useState } from 'react';
import { motion } from 'motion/react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Mail, MessageSquare, HelpCircle, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useToast } from '../components/Toast';

export default function Support() {
  const { success } = useToast();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate sending support request
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
      success('Formulario enviado', 'Nos contactaremos contigo a la brevedad.');
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        <h1 className="text-3xl font-black text-white uppercase tracking-wider flex items-center gap-3">
          <div className="w-1 h-8 bg-[#00ff66] rounded-full"></div> Servicio al Cliente
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Contact options */}
          <div className="space-y-4">
            <div className="bg-[#16213e] border border-[#0f3460]/50 rounded-2xl p-6 hover:border-[#00ff66]/50 transition-colors">
              <Mail className="w-8 h-8 text-[#00ff66] mb-4" />
              <h3 className="text-white font-bold mb-1">Correo Electrónico</h3>
              <p className="text-sm text-slate-400 mb-4">Escríbenos a nuestro email oficial. Tiempo de respuesta: 24h.</p>
              <a href="mailto:soporte@arenapay.gg" className="text-[#00ff66] font-bold text-sm flex items-center gap-1 hover:underline">
                soporte@arenapay.gg <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-[#16213e] border border-[#0f3460]/50 rounded-2xl p-6 hover:border-[#00ff66]/50 transition-colors">
              <MessageSquare className="w-8 h-8 text-[#00ff66] mb-4" />
              <h3 className="text-white font-bold mb-1">Chat en Vivo</h3>
              <p className="text-sm text-slate-400 mb-4">Asistencia inmediata para problemas urgentes en partidas.</p>
              <button disabled className="text-slate-500 font-bold text-sm flex items-center gap-1 cursor-not-allowed">
                No disponible <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2 bg-[#16213e] border border-[#0f3460]/50 rounded-2xl p-6">
            <h2 className="text-lg font-black text-white uppercase tracking-wider mb-5 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#00ff66]" /> Envíanos un Mensaje
            </h2>
            
            {sent ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-[#00ff66]/20 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-[#00ff66]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">¡Mensaje Enviado!</h3>
                <p className="text-slate-400 max-w-sm mb-6">Hemos recibido tu consulta. Nuestro equipo de soporte te responderá a la brevedad.</p>
                <button onClick={() => { setSent(false); setSubject(''); setMessage(''); }} className="bg-[#0f3460] hover:bg-[#1a3a6b] text-white font-bold tracking-wider py-2.5 px-6 rounded-xl text-sm transition-colors">
                  Enviar otro mensaje
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Asunto</label>
                  <select required value={subject} onChange={e => setSubject(e.target.value)} className="w-full bg-[#0a0e17] border border-[#0f3460] focus:border-[#00ff66] text-white rounded-xl px-4 py-3 outline-none transition-colors text-sm">
                    <option value="" disabled>Selecciona un asunto...</option>
                    <option value="retiro">Problema con Retiro de Fondos</option>
                    <option value="partida">Disputa de Partida</option>
                    <option value="cuenta">Problema con mi Cuenta</option>
                    <option value="kyc">Verificación de Identidad (KYC)</option>
                    <option value="otros">Otros</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Mensaje</label>
                  <textarea required placeholder="Describe tu problema con detalle..." value={message} onChange={e => setMessage(e.target.value)} className="w-full bg-[#0a0e17] border border-[#0f3460] focus:border-[#00ff66] text-white rounded-xl px-4 py-3 outline-none transition-colors placeholder:text-slate-600 text-sm h-32 resize-none"></textarea>
                </div>
                <button type="submit" disabled={submitting} className="w-full bg-[#00ff66] hover:bg-[#00cc55] text-black font-black uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(0,255,102,0.3)] disabled:opacity-50">
                  {submitting ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin mx-auto"></div> : 'Enviar Formulario'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
