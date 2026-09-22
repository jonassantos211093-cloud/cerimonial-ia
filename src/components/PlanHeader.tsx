import React from 'react';
import {
  Edit3,
  RefreshCw,
  Copy,
  Printer,
  Check,
  Calendar,
  MapPin,
  Users,
  Clock,
  Heart,
  AlertTriangle,
} from 'lucide-react';
import { GeneratedPlan } from '../types';

interface PlanHeaderProps {
  plan: GeneratedPlan;
  onEdit: () => void;
  onRegenerate: () => void;
  onCopyAll: () => void;
  onPrint: () => void;
  activeSection: string;
  onSelectSection: (sectionId: string) => void;
  isCopied: boolean;
}

export const PlanHeader: React.FC<PlanHeaderProps> = ({
  plan,
  onEdit,
  onRegenerate,
  onCopyAll,
  onPrint,
  activeSection,
  onSelectSection,
  isCopied,
}) => {
  const { summary } = plan;
  const hasPending = plan.pendingInformation.length > 0;

  const sections = [
    ...(hasPending ? [{ id: 'informacoes-pendentes', label: `Pendências (${plan.pendingInformation.length})` }] : []),
    { id: 'resumo', label: 'Resumo' },
    { id: 'cronograma', label: 'Cronograma' },
    { id: 'preparacao', label: 'Checklist Preparação' },
    { id: 'fornecedores', label: 'Fornecedores' },
    { id: 'whatsapp', label: 'WhatsApp' },
    { id: 'cerimonia', label: 'Roteiro Cerimônia' },
    ...(plan.cerimonialSuggestions && plan.cerimonialSuggestions.length > 0
      ? [{ id: 'sugestoes-cerimonial-ia', label: `Sugestões IA (${plan.cerimonialSuggestions.length})` }]
      : []),
    { id: 'imprevistos', label: 'Imprevistos' },
    { id: 'dia-d', label: 'Checklist Dia D' },
    { id: 'pos-evento', label: 'Pós-Evento' },
  ];

  return (
    <div className="bg-white border-b border-stone-200 pt-6 pb-4 sm:pt-8 sm:pb-6 px-4 sm:px-8 shadow-xs">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top bar with couple title and the 4 requested actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800 mb-1">
              <div className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 fill-amber-700 text-amber-700" />
                <span>Planejamento Operacional do Cerimonial</span>
              </div>

              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                summary.isPastDate
                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                  : 'bg-stone-100 text-stone-700 border-stone-200'
              }`}>
                {summary.daysUntilLabel}
              </span>

              {summary.isPastDate && (
                <span className="bg-rose-100 text-rose-900 border border-rose-300 px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-rose-700" />
                  Data no passado
                </span>
              )}

              {hasPending && (
                <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-700" />
                  {plan.pendingInformation.length} dados a definir
                </span>
              )}
            </div>

            {summary.isPastDate && (
              <div className="mb-2 p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>
                  <strong>Atenção:</strong> A data deste casamento está no passado ({summary.daysUntilLabel}). Este planejamento está sendo apresentado como registro ou modelo operacional.
                </span>
              </div>
            )}

            <h1 className="font-['Cormorant_Garamond',serif] text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight">
              {summary.coupleNames}
            </h1>

            <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs sm:text-sm text-stone-600 mt-2">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-stone-400" />
                <strong>{summary.weddingDateFormatted}</strong>
              </span>
              <span className="text-stone-300">&bull;</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-stone-400" />
                <span>{summary.cityAndVenue}</span>
              </span>
              <span className="text-stone-300">&bull;</span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4 text-stone-400" />
                <span>{summary.guestCountLabel}</span>
              </span>
              <span className="text-stone-300">&bull;</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-stone-400" />
                <span>
                  Cerimônia: {summary.ceremonyTime} | Término: {summary.endTime}
                </span>
              </span>
            </div>
          </div>

          {/* Action buttons (Editar informações, Gerar novamente, Copiar planejamento, Imprimir/Salvar como PDF) */}
          <div className="no-print flex flex-wrap items-center gap-2 pt-2 lg:pt-0">
            <button
              type="button"
              id="btn-edit-info"
              onClick={onEdit}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-stone-600" />
              <span>Editar informações</span>
            </button>

            <button
              type="button"
              id="btn-regenerate"
              onClick={onRegenerate}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-stone-600" />
              <span>Gerar novamente</span>
            </button>

            <button
              type="button"
              id="btn-copy-plan"
              onClick={onCopyAll}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors cursor-pointer"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-amber-700" />
                  <span>Copiar planejamento</span>
                </>
              )}
            </button>

            <button
              type="button"
              id="btn-print-pdf"
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Salvar PDF</span>
            </button>
          </div>
        </div>

        {/* Navigation tabs for quick navigation */}
        <div className="no-print overflow-x-auto pt-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex items-center gap-1.5 border-t border-stone-100 pt-3 min-w-max">
            {sections.map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => onSelectSection(sec.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  activeSection === sec.id
                    ? 'bg-amber-800 text-white shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                {sec.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
