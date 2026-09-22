import React from 'react';
import { Sparkles, Lightbulb, Check } from 'lucide-react';
import { CeremonyStep } from '../types';

interface CeremonyScriptSectionProps {
  steps: CeremonyStep[];
}

export const CeremonyScriptSection: React.FC<CeremonyScriptSectionProps> = ({ steps }) => {
  return (
    <section id="cerimonia" className="break-before-page space-y-6">
      <div className="pb-4 border-b border-stone-200">
        <h2 className="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl font-bold text-stone-900">
          Roteiro Básico da Cerimônia
        </h2>
        <p className="text-xs sm:text-sm text-stone-500">
          Ordem solene do cortejo de entrada, ritos, votos, bênção das alianças e cortejo de saída. Sugestões de fluxo estrutural com distinção de dados informados.
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((step) => {
          const isClientData = step.participantsSource === 'CLIENT_DATA';
          return (
            <div
              key={step.order}
              className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-start gap-4"
            >
              {/* Step Order Badge */}
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center font-bold text-amber-900 text-sm font-mono shrink-0">
                #{step.order}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-stone-900">
                    {step.title}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    {isClientData ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1">
                        <Check className="w-2.5 h-2.5" />
                        Dado do Cliente
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-amber-700" />
                        Sugestão Padrão IA
                      </span>
                    )}
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
                      {step.participants}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {step.details}
                </p>

                {step.tip && (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 flex items-start gap-2">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                    <span className="font-medium">{step.tip}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
