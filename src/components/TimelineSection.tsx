import React, { useState } from 'react';
import { Clock, Filter, CheckCircle2, User, Sparkles, Check, AlertCircle } from 'lucide-react';
import { DayTimelineItem } from '../types';

interface TimelineSectionProps {
  timeline: DayTimelineItem[];
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({ timeline }) => {
  const [filterPhase, setFilterPhase] = useState<string>('all');
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});

  const toggleItemCompleted = (id: string) => {
    setCompletedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredTimeline = timeline.filter((item) => {
    if (filterPhase === 'all') return true;
    return item.phase === filterPhase;
  });

  const getPhaseBadge = (phase: string) => {
    switch (phase) {
      case 'pre':
        return { label: 'Pré-Evento & Montagem', color: 'bg-stone-100 text-stone-700' };
      case 'ceremony':
        return { label: 'Cerimônia', color: 'bg-amber-100 text-amber-900 border border-amber-200' };
      case 'reception':
        return { label: 'Recepção & Pista', color: 'bg-blue-50 text-blue-800 border border-blue-200' };
      case 'post':
        return { label: 'Desmontagem', color: 'bg-emerald-50 text-emerald-800' };
      default:
        return { label: phase, color: 'bg-stone-100 text-stone-700' };
    }
  };

  return (
    <section id="cronograma" className="break-before-page space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h2 className="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl font-bold text-stone-900">
            Cronograma Minuto a Minuto (Dia D)
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Linha do tempo operacional com diferenciação rigorosa entre dados do cliente e sugestões técnicas.
          </p>
        </div>

        {/* Phase Filter */}
        <div className="no-print flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-stone-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filtrar:</span>
          </span>
          {[
            { id: 'all', label: 'Tudo' },
            { id: 'pre', label: 'Montagem' },
            { id: 'ceremony', label: 'Cerimônia' },
            { id: 'reception', label: 'Festa' },
            { id: 'post', label: 'Encerramento' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterPhase(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                filterPhase === tab.id
                  ? 'bg-stone-900 text-white shadow-xs font-semibold'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Legend Card */}
      <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-bold text-stone-800">Legenda de Origem dos Dados:</span>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-600 text-white shadow-2xs">
              <Check className="w-3 h-3" />
              DADO INFORMADO PELO CLIENTE
            </span>
            <span className="text-stone-500 text-[11px]">= Horário ou instrução oficial do briefing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300/80">
              <Sparkles className="w-3 h-3 text-amber-700" />
              SUGESTÃO DO CERIMONIAL IA
            </span>
            <span className="text-stone-500 text-[11px]">= Estimativa operacional baseada em boas práticas</span>
          </div>
        </div>
      </div>

      {/* Timeline items */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-stone-200 space-y-6 sm:space-y-8 my-6">
        {filteredTimeline.map((item) => {
          const badge = getPhaseBadge(item.phase);
          const isDone = !!completedItems[item.id];
          const isClientData = item.sourceType === 'CLIENT_DATA';

          return (
            <div
              key={item.id}
              className={`relative group transition-opacity ${
                isDone ? 'opacity-60' : 'opacity-100'
              }`}
            >
              {/* Dot on the timeline line */}
              <div
                onClick={() => toggleItemCompleted(item.id)}
                className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full border-2 cursor-pointer flex items-center justify-center transition-all ${
                  isDone
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : isClientData
                    ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                    : 'bg-white border-amber-700 text-amber-700 group-hover:scale-110 shadow-xs'
                }`}
                title="Marcar como concluído"
              >
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : isClientData ? (
                  <Check className="w-3.5 h-3.5 text-white" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-amber-700"></span>
                )}
              </div>

              {/* Item Card */}
              <div
                className={`p-4 sm:p-5 rounded-2xl border transition-colors ${
                  isClientData
                    ? 'bg-blue-50/30 border-blue-200 shadow-xs'
                    : 'bg-white border-stone-200 shadow-xs hover:border-stone-300'
                }`}
              >
                {/* Header with Source Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-base sm:text-lg font-bold font-mono px-2.5 py-0.5 rounded-md border ${
                        item.isTimeDefined
                          ? isClientData
                            ? 'bg-blue-600 text-white border-blue-700'
                            : 'bg-amber-50 text-amber-900 border-amber-200/80'
                          : 'bg-stone-100 text-stone-600 border-stone-200'
                      }`}
                    >
                      {item.time}
                    </span>

                    <h3
                      className={`text-sm sm:text-base font-bold text-stone-900 ${
                        isDone ? 'line-through text-stone-400' : ''
                      }`}
                    >
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Source Distinction Badge */}
                    {isClientData ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                        <Check className="w-2.5 h-2.5" />
                        DADO INFORMADO PELO CLIENTE
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                        <Sparkles className="w-2.5 h-2.5 text-amber-700" />
                        SUGESTÃO DO CERIMONIAL IA
                      </span>
                    )}

                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-3">
                  {item.description}
                </p>

                <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
                  <div className="flex items-center gap-1.5 text-stone-600 font-medium">
                    <User className="w-3.5 h-3.5 text-stone-400" />
                    <span>
                      Responsável:{' '}
                      {(() => {
                        const cleanResp = item.responsible.startsWith('Responsável:')
                          ? item.responsible.replace('Responsável:', '').trim()
                          : item.responsible;
                        return cleanResp === 'A definir' ? (
                          <span className="font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            A definir
                          </span>
                        ) : (
                          <strong>{cleanResp}</strong>
                        );
                      })()}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleItemCompleted(item.id)}
                    className="no-print text-[11px] font-medium text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    {isDone ? 'Desmarcar' : 'Concluir etapa'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
