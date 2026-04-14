import React from 'react';
import { motion } from 'motion/react';
import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-300 py-12 px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-[#00ff66] hover:text-[#00cc55] mb-8 transition-colors font-bold uppercase tracking-wider text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver al inicio
        </Link>
        
        <div className="flex items-center gap-4 mb-12">
          <div className="w-16 h-16 bg-[#00ff66]/10 rounded-2xl flex items-center justify-center border border-[#00ff66]/20">
            <Shield className="w-8 h-8 text-[#00ff66]" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase">Política de Privacidad</h1>
            <p className="text-slate-400 mt-1 font-medium">Última actualización: Abril 2026</p>
          </div>
        </div>

        <div className="bg-[#131b26] border border-[#1f2937] rounded-2xl p-8 md:p-12 space-y-8 text-sm md:text-base leading-relaxed shadow-xl">
          <section>
            <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
              <span className="text-[#00ff66]">1.</span> Información que Recopilamos
            </h2>
            <p className="text-slate-400">
              Recopilamos información personal necesaria para brindar un entorno seguro y legal. Esto incluye:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
              <li>Nombre completo y RUT.</li>
              <li>Correo electrónico y datos de contacto.</li>
              <li>Imágenes de documentos de identidad para verificación (KYC).</li>
              <li>Historial de partidas, depósitos y retiros.</li>
              <li>Dirección IP y datos del dispositivo por seguridad.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
              <span className="text-[#00ff66]">2.</span> Uso de la Información
            </h2>
            <p className="text-slate-400">
              Utilizamos sus datos exclusivamente para:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
              <li>Verificar su identidad y edad legal.</li>
              <li>Procesar transacciones financieras de forma segura.</li>
              <li>Prevenir fraudes, lavado de dinero y trampas en los juegos.</li>
              <li>Resolver disputas entre jugadores.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
              <span className="text-[#00ff66]">3.</span> Protección de Datos
            </h2>
            <p className="text-slate-400">
              ArenaPay utiliza encriptación de grado bancario para proteger sus datos personales y financieros. Las imágenes de sus documentos de identidad se almacenan en servidores seguros y solo son accesibles por personal autorizado de cumplimiento normativo.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
              <span className="text-[#00ff66]">4.</span> Compartir Información
            </h2>
            <p className="text-slate-400">
              No vendemos ni alquilamos su información personal a terceros. Solo compartiremos sus datos cuando sea requerido por ley, orden judicial, o con proveedores de servicios de pago estrictamente para procesar sus transacciones.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
