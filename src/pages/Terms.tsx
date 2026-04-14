import React from 'react';
import { motion } from 'motion/react';
import { Shield, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-300 py-12 px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-[#00ff66] hover:text-[#00cc55] mb-8 transition-colors font-bold uppercase tracking-wider text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver al inicio
        </Link>
        
        <div className="flex items-center gap-4 mb-12">
          <div className="w-16 h-16 bg-[#00ff66]/10 rounded-2xl flex items-center justify-center border border-[#00ff66]/20">
            <FileText className="w-8 h-8 text-[#00ff66]" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase">Términos y Condiciones</h1>
            <p className="text-slate-400 mt-1 font-medium">Última actualización: Abril 2026</p>
          </div>
        </div>

        <div className="bg-[#131b26] border border-[#1f2937] rounded-2xl p-8 md:p-12 space-y-8 text-sm md:text-base leading-relaxed shadow-xl">
          <section>
            <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
              <span className="text-[#00ff66]">1.</span> Naturaleza del Servicio
            </h2>
            <p className="text-slate-400">
              ArenaPay es una plataforma de intermediación que permite a usuarios mayores de edad competir en videojuegos de habilidad (eSports) apostando dinero real sobre su propio desempeño. ArenaPay NO es un casino ni una plataforma de juegos de azar. El resultado de los desafíos depende 100% de la habilidad de los jugadores.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
              <span className="text-[#00ff66]">2.</span> Requisitos de Elegibilidad
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-400">
              <li>Ser mayor de 18 años de edad.</li>
              <li>Residir en territorio chileno o poseer un RUT válido.</li>
              <li>Completar satisfactoriamente el proceso de verificación de identidad (KYC).</li>
              <li>No tener cuentas suspendidas previamente en la plataforma.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
              <span className="text-[#00ff66]">3.</span> Verificación de Identidad (KYC)
            </h2>
            <p className="text-slate-400">
              Para garantizar la seguridad de la comunidad y cumplir con las normativas vigentes, ArenaPay exige la verificación de correo electrónico y documento de identidad (RUT) antes de permitir depósitos, participación en partidas por dinero real o retiros de fondos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
              <span className="text-[#00ff66]">4.</span> Fondos y Retiros
            </h2>
            <p className="text-slate-400">
              Los fondos depositados en ArenaPay solo pueden ser utilizados para competir en la plataforma. Los retiros están sujetos a verificación de identidad y pueden tomar hasta 48 horas hábiles en procesarse. ArenaPay retiene una comisión por intermediación en cada partida, la cual es informada antes de aceptar el desafío.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
              <span className="text-[#00ff66]">5.</span> Juego Limpio y Anti-Trampas
            </h2>
            <p className="text-slate-400">
              Cualquier intento de fraude, uso de software de terceros (hacks, bots), manipulación de red (lag switching), o colusión resultará en el baneo permanente de la cuenta y la confiscación de los fondos. Las disputas son resueltas por el equipo de moderación de ArenaPay basándose en pruebas de video.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
