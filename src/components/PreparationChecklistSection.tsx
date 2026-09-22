import React, { useState } from 'react';
import { CheckSquare, Square, CalendarClock, CheckCircle } from 'lucide-react';
import { PreparationChecklistPhase } from '../types';

interface PreparationChecklistSectionProps {
  phases: PreparationChecklistPhase[];
}

export const PreparationChecklistSection: React.FC<PreparationChecklistSectionProps> = ({
  phases: initialPhases,
}) => {
  const [phases, setPhases] = useState(initialPhases);

  const toggleTask = (phaseIndex: number, taskId: string) => {
    setPhases((prevPhases) =>
      prevPhases.map((phase, pIdx) => {
        if (pIdx !== phaseIndex) return phase;
        return {
          ...phase,
          items: phase.items.map((item) =>
            item.id === taskId ? { ...item, completed: !item.completed } : item
          ),
        };
      })
    );
  };

  // Calculate global completion
  const totalTasks = phases.reduce((acc, p) => acc + p.items.length, 0);
  const completedTasks = phases.reduce(
    (acc, p) => acc + p.items.filter((i) => i.completed).length,
    0
  );
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <section id="preparacao" className="break-before-page space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h2 className="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl font-bold text-stone-900">
            Checklist de Preparação
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Cronograma de tarefas desde a contratação estrutural até a semana final do casamento.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="bg-white px-4 py-2.5 rounded-xl border border-stone-200 shadow-xs flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-semibold text-stone-500">Progresso Geral</div>
            <div className="text-sm font-bold text-stone-900">
              {completedTasks} de {totalTasks} ({progressPercent}%)
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center font-bold text-amber-900 text-xs">
            {progressPercent}%
          </div>
        </div>
      </div>

      {/* Phases grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {phases.map((phase, pIdx) => {
          const phaseCompleted = phase.items.filter((i) => i.completed).length;

          return (
            <div
              key={phase.phaseTitle}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                    {phase.timelineBadge}
                  </span>
                  <span className="text-xs text-stone-400 font-mono">
                    {phaseCompleted}/{phase.items.length}
                  </span>
                </div>

                <h3 className="font-['Cormorant_Garamond',serif] text-lg font-bold text-stone-900 mb-4">
                  {phase.phaseTitle}
                </h3>

                <ul className="space-y-3">
                  {phase.items.map((item) => (
                    <li
                      key={item.id}
                      onClick={() => toggleTask(pIdx, item.id)}
                      className="flex items-start gap-2.5 text-xs sm:text-sm cursor-pointer group"
                    >
                      <button
                        type="button"
                        className="mt-0.5 text-stone-400 group-hover:text-amber-800 transition-colors shrink-0"
                      >
                        {item.completed ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                      <div className="flex-1">
                        <span
                          className={`leading-snug block ${
                            item.completed
                              ? 'line-through text-stone-400'
                              : 'text-stone-800 font-normal group-hover:text-stone-900'
                          }`}
                        >
                          {item.task}
                        </span>
                        <span className="text-[10px] text-stone-400 uppercase tracking-wider block mt-0.5">
                          {item.category}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
