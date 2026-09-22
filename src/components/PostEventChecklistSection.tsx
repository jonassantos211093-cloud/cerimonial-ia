import React, { useState } from 'react';
import { CheckSquare, Square, CalendarCheck, Clock, UserCheck } from 'lucide-react';

interface PostEventItem {
  id: string;
  task: string;
  done: boolean;
  responsible: string;
  deadline: string;
}

interface PostEventChecklistSectionProps {
  items: PostEventItem[];
}

export const PostEventChecklistSection: React.FC<PostEventChecklistSectionProps> = ({
  items: initialItems,
}) => {
  const [items, setItems] = useState<PostEventItem[]>(initialItems);

  const toggleTask = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  return (
    <section id="pos-evento" className="break-before-page space-y-6">
      <div className="pb-4 border-b border-stone-200">
        <h2 className="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl font-bold text-stone-900">
          Checklist Pós-Evento
        </h2>
        <p className="text-xs sm:text-sm text-stone-500">
          Devolução de trajes, balanço com o espaço, entrega de pertences e pesquisa de satisfação.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="divide-y divide-stone-100">
          {items.map((item) => {
            const cleanResp = item.responsible.startsWith('Responsável:')
              ? item.responsible.replace('Responsável:', '').trim()
              : item.responsible;

            return (
              <div
                key={item.id}
                onClick={() => toggleTask(item.id)}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    className="mt-0.5 text-stone-400 group-hover:text-amber-800 transition-colors shrink-0"
                  >
                    {item.done ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                  <div>
                    <span
                      className={`text-xs sm:text-sm font-medium ${
                        item.done ? 'line-through text-stone-400' : 'text-stone-800'
                      }`}
                    >
                      {item.task}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-1">
                      <UserCheck className="w-3.5 h-3.5 text-stone-400" />
                      <span>
                        Responsável:{' '}
                        {cleanResp === 'A definir' ? (
                          <span className="font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            A definir
                          </span>
                        ) : (
                          <strong className="text-stone-700">{cleanResp}</strong>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-amber-900 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60 self-start sm:self-center">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  <span>{item.deadline}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
