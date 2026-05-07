import React from 'react';
import { motion } from 'motion/react';
import { Shield, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';

export default function Terms() {
  return (
    <div className="min-h-screen bg-navy-950 text-slate-300 py-12 px-6 font-sans selection:bg-brand-primary selection:text-black">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-secondary mb-12 transition-all font-black uppercase tracking-widest text-xs group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Volver al inicio
        </Link>
        
        <div className="flex items-center gap-6 mb-12">
          <div className="w-20 h-20 bg-brand-primary/10 rounded-[2rem] flex items-center justify-center border border-brand-primary/20 shadow-[0_0_30px_rgba(0,255,102,0.1)]">
            <FileText className="w-10 h-10 text-brand-primary" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase font-display glow-text">Términos y Condiciones</h1>
            <p className="text-brand-primary/60 mt-1 font-black uppercase tracking-[0.2em] text-[10px]">Última actualización: Mayo 2026</p>
          </div>
        </div>

        <div className="bg-navy-900/60 backdrop-blur-xl border border-navy-700 rounded-[2.5rem] p-8 md:p-16 space-y-12 text-sm md:text-base leading-relaxed shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>

          <section>
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3 uppercase tracking-tighter font-display">
              <span className="text-brand-primary">01.</span> Naturaleza del Servicio
            </h2>
            <p className="text-slate-400 font-medium">
              ArenaPay es una plataforma de intermediación que permite a usuarios mayores de edad competir en videojuegos de habilidad (eSports) apostando dinero real sobre su propio desempeño. ArenaPay <span className="text-white font-bold">NO es un casino</span> ni una plataforma de juegos de azar. El resultado de los desafíos depende 100% de la habilidad de los jugadores.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3 uppercase tracking-tighter font-display">
              <span className="text-brand-primary">02.</span> Requisitos de Elegibilidad
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "Ser mayor de 18 años de edad.",
                "Residir en territorio chileno con RUT válido.",
                "Completar proceso de KYC satisfactorio.",
                "No tener cuentas suspendidas previamente."
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-navy-800 rounded-2xl border border-navy-700">
                  <Shield className="w-5 h-5 text-brand-primary shrink-0" />
                  <span className="text-slate-300 font-bold text-xs uppercase tracking-wide">{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3 uppercase tracking-tighter font-display">
              <span className="text-brand-primary">03.</span> Verificación de Identidad (KYC)
            </h2>
            <p className="text-slate-400 font-medium leading-loose">
              Para garantizar la seguridad de la comunidad y cumplir con las normativas vigentes, ArenaPay exige la verificación de documento de identidad (RUT) y verificación facial antes de permitir depósitos de alto volumen o retiros de fondos. La información es encriptada y tratada bajo estrictos estándares de ciberseguridad.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3 uppercase tracking-tighter font-display">
              <span className="text-brand-primary">04.</span> Juego Limpio
            </h2>
            <p className="text-slate-400 font-medium bg-red-500/5 border border-red-500/10 p-6 rounded-2xl">
              Cualquier intento de fraude, uso de software de terceros (hacks, bots) o manipulación de red resultará en el <span className="text-red-400 font-bold">bloqueo inmediato y permanente</span> de la cuenta. Las disputas son analizadas por nuestro equipo técnico basándose en telemetría de juego.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
