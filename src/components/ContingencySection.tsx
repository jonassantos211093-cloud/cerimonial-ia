import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Package } from 'lucide-react';
import { ContingencyPlanItem } from '../types';

interface ContingencySectionProps {
  contingencies: ContingencyPlanItem[];
}

export const ContingencySection: React.FC<ContingencySectionProps> = ({ contingencies }) => {
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Alta':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'Média':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-blue-50 text-blue-800 border-blue-200';
    }
  };

  return (
    <section id="imprevistos" className="break-before-page space-y-6">
      <div className="pb-4 border-b border-stone-200">
        <h2 className="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl font-bold text-stone-900">
          Plano para Imprevistos (Contingência)
        </h2>
        <p className="text-xs sm:text-sm text-stone-500">
          Protocolos de ação rápida para chuvas, atrasos, falhas elétricas e emergências de vestuário.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contingencies.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                  <h3 className="text-base font-bold text-stone-900">
                    {item.risk}
                  </h3>
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getSeverityBadge(
                    item.severity
                  )}`}
                >
                  {item.severity}
                </span>
              </div>

              {/* Action plan */}
              <div className="my-3 space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  Ação Imediata do Cerimonial
                </div>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-200/80">
                  {item.actionPlan}
                </p>
              </div>

              {/* Items needed */}
              <div className="pt-2">
                <div className="flex items-center gap-1.5 text-xs text-stone-500 font-semibold mb-1">
                  <Package className="w-3.5 h-3.5 text-stone-400" />
                  <span>Recursos & Materiais de Suporte:</span>
                </div>
                <p className="text-xs text-stone-600">
                  {item.itemsNeeded}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
              <span>Orientação: Manter discrição absoluta diante dos noivos e convidados</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
