import React from 'react';
import { Sparkles, Info, HeartHandshake, Check } from 'lucide-react';
import { CerimonialSuggestionItem } from '../types';

interface CerimonialSuggestionsSectionProps {
  suggestions: CerimonialSuggestionItem[];
}

export const CerimonialSuggestionsSection: React.FC<CerimonialSuggestionsSectionProps> = ({
  suggestions,
}) => {
  if (!suggestions || suggestions.length === 0) {
    return (
      <section id="sugestoes-cerimonial" className="break-before-page space-y-4">
        <div className="pb-4 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <h2 className="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl font-bold text-stone-900">
              Sugestões do Cerimonial IA
            </h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              SUGESTÃO
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500">
            Todos os serviços e momentos principais do evento foram expressamente informados pelo cliente no briefing.
          </p>
        </div>
      </section>
    );
  }

  // Agrupar por categoria
  const categories: ('Cerimônia & Cortejo' | 'Recepção & Tradições' | 'Serviços & Contratações')[] = [
    'Cerimônia & Cortejo',
    'Recepção & Tradições',
    'Serviços & Contratações',
  ];

  return (
    <section id="sugestoes-cerimonial" className="break-before-page space-y-6">
      <div className="pb-4 border-b border-stone-200">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300/80 flex items-center justify-center text-amber-800 shrink-0">
              <Sparkles className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <h2 className="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl font-bold text-stone-900">
                Sugestões do Cerimonial IA
              </h2>
              <p className="text-xs sm:text-sm text-stone-500">
                Área exclusiva para momentos, serviços e tradições não informados pelo cliente no briefing.
              </p>
            </div>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1.5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            {suggestions.length} {suggestions.length === 1 ? 'sugestão disponível' : 'sugestões disponíveis'}
          </span>
        </div>

        {/* Warning Banner reforçando que NÃO são fatos do evento */}
        <div className="mt-4 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3 text-xs sm:text-sm text-amber-950">
          <Info className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-bold">Aviso de Rigor Operacional:</strong> Os itens desta seção{' '}
            <strong>não foram informados pelo cliente</strong> e, portanto, <strong>não constam como parte confirmada do evento</strong>.
            Eles estão reunidos exclusivamente aqui como recomendações técnicas caso os noivos queiram incluí-los no planejamento.
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {categories.map((cat) => {
          const catItems = suggestions.filter((s) => s.category === cat);
          if (catItems.length === 0) return null;

          return (
            <div key={cat} className="space-y-3.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-700"></span>
                <h3 className="text-sm sm:text-base font-bold text-stone-800 uppercase tracking-wider font-mono">
                  {cat} ({catItems.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {catItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:border-amber-300 transition-colors flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h4 className="text-base font-bold text-stone-900">
                          {item.title}
                        </h4>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300/80">
                          <Sparkles className="w-2.5 h-2.5 text-amber-700" />
                          {item.statusLabel}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 text-xs text-stone-700 flex items-start gap-2">
                      <HeartHandshake className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-stone-800">Recomendação do Cerimonial: </span>
                        <span>{item.recommendation}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
