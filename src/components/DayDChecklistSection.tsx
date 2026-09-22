import React, { useState } from 'react';
import { CheckSquare, Square, Briefcase, Sparkles } from 'lucide-react';

interface DayDItem {
  id: string;
  task: string;
  done: boolean;
  area: 'Maleta SOS' | 'Cerimônia' | 'Recepção' | 'Coordenação';
}

interface DayDChecklistSectionProps {
  items: DayDItem[];
}

export const DayDChecklistSection: React.FC<DayDChecklistSectionProps> = ({
  items: initialItems,
}) => {
  const [items, setItems] = useState<DayDItem[]>(initialItems);

  const toggleTask = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const completed = items.filter((i) => i.done).length;
  const total = items.length;
  const percent = Math.round((completed / total) * 100);

  const areas: ('Maleta SOS' | 'Cerimônia' | 'Recepção' | 'Coordenação')[] = [
    'Maleta SOS',
    'Cerimônia',
    'Recepção',
    'Coordenação',
  ];

  return (
    <section id="dia-d" className="break-before-page space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h2 className="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl font-bold text-stone-900">
            Checklist do Dia D (Coordenação em Campo)
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Conferência operacional das áreas críticas antes da entrada dos primeiros convidados.
          </p>
        </div>

        <div className="bg-white px-4 py-2.5 rounded-xl border border-stone-200 shadow-xs flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-semibold text-stone-500">Concluído no Local</div>
            <div className="text-sm font-bold text-stone-900">
              {completed} de {total} itens
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center font-bold text-emerald-800 text-xs">
            {percent}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleTask(item.id)}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
              item.done
                ? 'bg-stone-50/80 border-stone-200 text-stone-400'
                : 'bg-white border-stone-200 hover:border-stone-300 text-stone-800 shadow-xs'
            }`}
          >
            <button
              type="button"
              className="mt-0.5 text-stone-400 hover:text-amber-800 transition-colors shrink-0"
            >
              {item.done ? (
                <CheckSquare className="w-4 h-4 text-emerald-600" />
              ) : (
                <Square className="w-4 h-4" />
              )}
            </button>

            <div className="flex-1">
              <span className={`text-xs sm:text-sm block ${item.done ? 'line-through text-stone-400' : 'font-medium'}`}>
                {item.task}
              </span>
              <span className="text-[10px] font-semibold text-amber-900/80 uppercase tracking-wider block mt-1">
                Área: {item.area}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
