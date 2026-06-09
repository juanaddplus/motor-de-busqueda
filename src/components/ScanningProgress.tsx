import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Loader2, Server, Shield, Sparkles } from "lucide-react";

interface ScanningProgressProps {
  address: string;
  onComplete: () => void;
}

const MESSAGES = [
  { text: "Estructurando variables prediales en Tercera Forma Normal (3NF)...", icon: Server },
  { text: "Mapeando ecosistema georreferenciado y Amenidades Tier 1...", icon: Sparkles },
  { text: "Calculando Coeficiente de Fricción Inmobiliaria local...", icon: Shield },
  { text: "Generando simulación AVM (Automated Valuation Model) para el polígono...", icon: Loader2 }
];

export default function ScanningProgress({ address, onComplete }: ScanningProgressProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const intervals = [800, 1500, 2200, 3000];
    const timers: NodeJS.Timeout[] = [];

    intervals.forEach((time, index) => {
      const t = setTimeout(() => {
        if (index < MESSAGES.length - 1) {
          setCurrentStep(index + 1);
        } else {
          onComplete();
        }
      }, time);
      timers.push(t);
    });

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [onComplete]);

  const IconType = MESSAGES[currentStep].icon;

  return (
    <div className="bg-white rounded-3xl p-8 max-w-xl mx-auto shadow-xl text-center border border-neutral-100 flex flex-col items-center justify-center min-h-[350px] mt-12">
      <div className="bg-brand-light rounded-2xl px-5 py-2 mb-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500 border border-neutral-200">
        Engine AVM / PropTech Multi-Polígonos
      </div>

      <motion.p
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        key={address}
        className="text-lg md:text-xl font-bold text-brand-dark max-w-md break-words mb-8"
      >
        "{address}"
      </motion.p>

      {/* Modern Circular / Progress Loading Bar */}
      <div className="relative w-full max-w-xs h-3 bg-neutral-100 rounded-full overflow-hidden mb-6 border border-neutral-200">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 3.5, ease: "easeInOut" }}
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-accent to-[#b87158]"
        />
      </div>

      <motion.div
        key={currentStep}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className="flex items-center gap-3 justify-center min-h-[50px] max-w-xs md:max-w-md"
      >
        <span className="shrink-0 bg-brand-light p-2.5 rounded-full text-brand-accent border border-neutral-200 animate-pulse">
          <IconType className="w-5 h-5" />
        </span>
        <p className="text-sm font-semibold text-neutral-600 text-left leading-relaxed">
          {MESSAGES[currentStep].text}
        </p>
      </motion.div>

      <span className="text-[10px] text-neutral-400 font-medium mt-12 animate-pulse">
        Procesando bases de la CCB, Catastro y Empresa Metro...
      </span>
    </div>
  );
}
