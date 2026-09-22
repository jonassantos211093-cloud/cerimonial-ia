import React from 'react';
import { AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { PendingInfoItem } from '../types';

interface PendingInfoSectionProps {
  pendingItems: PendingInfoItem[];
  onFocusField?: (field: string) => void;
}

export const PendingInfoSection: React.FC<PendingInfoSectionProps> = ({
  pendingItems,
  onFocusField,
}) => {
  if (!pendingItems || pendingItems.length === 0) {
    return (
      <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-5 shadow-xs flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-bold text-emerald-950">
            Briefing Completo — Nenhum dado pendente
          </h3>
          <p className="text-xs text-emerald-700 mt-0.5 leading-relaxed">
            Todos os campos operacionais foram preenchidos pelo cliente. O cronograma e checklists contam com parâmetros reais para montagem e execução.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section
      id="informacoes-pendentes"
      className="bg-amber-50/80 border-2 border-amber-300/80 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs space-y-4"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-200/70 text-amber-900 shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-800" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-['Cormorant_Garamond',serif] text-xl sm:text-2xl font-bold text-amber-950">
                Informações Pendentes ({pendingItems.length})
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-amber-200 text-amber-900">
                A Definir pelo Cliente
              </span>
            </div>
            <p className="text-xs text-amber-800 mt-1 leading-relaxed">
              O Cerimonial IA <strong>não inventa dados</strong>. Os campos não informados abaixo foram marcados como <em>&ldquo;Não informado&rdquo;</em> ou <em>&ldquo;A definir&rdquo;</em> no planejamento, preservando estritamente a integridade do seu evento.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        {pendingItems.map((item) => (
          <div
            key={item.id}
            className="bg-white/95 rounded-xl border border-amber-200/90 p-3.5 shadow-2xs space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-900">
                {item.label}
              </span>
              <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                Pendente
              </span>
            </div>
            <p className="text-xs text-stone-600">
              {item.description}
            </p>
            <div className="text-[11px] text-amber-900/90 bg-amber-50/60 p-2 rounded-lg border border-amber-100/80">
              <span className="font-semibold">Impacto operacional:</span> {item.impact}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
