import React from 'react';
import { Sparkles, Calendar, HeartHandshake } from 'lucide-react';

interface NavbarProps {
  onResetToExample?: () => void;
  hasGeneratedPlan: boolean;
  onEditForm?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onResetToExample,
  hasGeneratedPlan,
  onEditForm,
}) => {
  return (
    <nav className="no-print sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-amber-900/10 px-4 sm:px-8 py-3.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-700 text-amber-50 flex items-center justify-center shadow-xs">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-['Cormorant_Garamond',serif] text-2xl font-bold text-stone-900 tracking-tight">
                Cerimonial IA
              </span>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
                Assistente de Pré-Evento
              </span>
            </div>
            <p className="text-[11px] text-stone-500 hidden sm:block">
              Organização profissional de casamentos &middot; Do briefing ao Dia D
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasGeneratedPlan && onEditForm && (
            <button
              type="button"
              onClick={onEditForm}
              className="text-xs font-medium text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Editar Briefing
            </button>
          )}

          {onResetToExample && (
            <button
              type="button"
              onClick={onResetToExample}
              title="Carregar dados de exemplo (Jéssica e Pedro)"
              className="text-xs font-medium text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Exemplo (Jéssica & Pedro)</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
