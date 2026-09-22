import React from 'react';
import {
  Heart,
  Calendar,
  MapPin,
  Users,
  Clock,
  Sparkles,
  Palette,
  Truck,
  UserCheck,
  AlertCircle,
  FileText,
  ArrowRight,
  RotateCcw,
  Trash2,
  ShieldCheck,
} from 'lucide-react';
import { WeddingFormData } from '../types';

interface EventFormProps {
  formData: WeddingFormData;
  onChange: (updated: WeddingFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onResetExample: () => void;
  onClearForm: () => void;
  onLoadPedroMaria?: () => void;
}

export const EventForm: React.FC<EventFormProps> = ({
  formData,
  onChange,
  onSubmit,
  onResetExample,
  onClearForm,
  onLoadPedroMaria,
}) => {
  const handleInputChange = (
    field: keyof WeddingFormData,
    value: string | number | ''
  ) => {
    onChange({
      ...formData,
      [field]: value,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Header section matching exact prompt */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-200/80 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>Assistente de Pré-Evento</span>
        </div>

        <h1 className="font-['Cormorant_Garamond',serif] text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-stone-900 mb-3">
          Cerimonial IA
        </h1>

        <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
          Do briefing ao Dia D, organize seu evento com inteligência.
        </p>

        <div className="mt-4 p-3 bg-stone-100/90 border border-stone-200 rounded-xl text-xs text-stone-600 max-w-lg mx-auto flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            <strong>Rigor Operacional:</strong> O Cerimonial IA nunca inventa dados. Campos vazios permanecem como &ldquo;Não informado&rdquo; ou &ldquo;A definir&rdquo;.
          </span>
        </div>
      </div>

      {/* Main Form Container */}
      <form
        onSubmit={onSubmit}
        className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-10 space-y-8"
        id="wedding-briefing-form"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
          <div>
            <h2 className="text-lg font-bold text-stone-900 font-['Cormorant_Garamond',serif] sm:text-xl">
              Briefing Estratégico do Casamento
            </h2>
            <p className="text-xs text-stone-500">
              Preencha os dados conhecidos. Campos vazios serão marcados como &ldquo;A definir&rdquo;.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onLoadPedroMaria && (
              <button
                type="button"
                onClick={onLoadPedroMaria}
                className="inline-flex items-center gap-1.5 text-xs text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors cursor-pointer font-medium"
                title="Carregar caso de teste: Pedro e Maria, 04/02/2027, 50 convidados com demais campos vazios"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>Teste: Pedro e Maria (Campos Vazios)</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClearForm}
              className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg border border-stone-200 transition-colors cursor-pointer"
              title="Limpar todos os campos para preenchimento em branco"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar</span>
            </button>

            <button
              type="button"
              onClick={onResetExample}
              className="inline-flex items-center gap-1.5 text-xs text-amber-900 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200/80 transition-colors cursor-pointer"
              title="Carregar exemplo completo com Jéssica e Pedro"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
              <span>Exemplo Completo</span>
            </button>
          </div>
        </div>

        {/* Section 1: Dados Principais */}
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-900/80 block">
            1. Informações Básicas
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Nome dos noivos */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="coupleNames"
                  className="block text-xs font-semibold text-stone-700 uppercase tracking-wider"
                >
                  Nome dos noivos
                </label>
                <span className="text-[10px] text-stone-400">Opcional</span>
              </div>
              <div className="relative">
                <Heart className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  id="coupleNames"
                  value={formData.coupleNames}
                  onChange={(e) => handleInputChange('coupleNames', e.target.value)}
                  placeholder="Ex: Jéssica e Pedro"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-700 transition-all"
                />
              </div>
            </div>

            {/* Data do casamento */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="weddingDate"
                  className="block text-xs font-semibold text-stone-700 uppercase tracking-wider"
                >
                  Data do casamento
                </label>
                <span className="text-[10px] text-stone-400">Opcional</span>
              </div>
              <div className="relative">
                <Calendar className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  id="weddingDate"
                  value={formData.weddingDate}
                  onChange={(e) => handleInputChange('weddingDate', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-700 transition-all"
                />
              </div>
            </div>

            {/* Cidade e local */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="cityAndVenue"
                  className="block text-xs font-semibold text-stone-700 uppercase tracking-wider"
                >
                  Cidade e local
                </label>
                <span className="text-[10px] text-stone-400">Opcional</span>
              </div>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  id="cityAndVenue"
                  value={formData.cityAndVenue}
                  onChange={(e) => handleInputChange('cityAndVenue', e.target.value)}
                  placeholder="Ex: Belo Horizonte, Espaço Ilustríssimo"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-700 transition-all"
                />
              </div>
            </div>

            {/* Número de convidados */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="guestCount"
                  className="block text-xs font-semibold text-stone-700 uppercase tracking-wider"
                >
                  Número de convidados
                </label>
                <span className="text-[10px] text-stone-400">Opcional</span>
              </div>
              <div className="relative">
                <Users className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  id="guestCount"
                  min="0"
                  max="5000"
                  value={formData.guestCount === '' ? '' : formData.guestCount}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleInputChange('guestCount', val === '' ? '' : parseInt(val, 10) || 0);
                  }}
                  placeholder="Ex: 150"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-700 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Horários do Evento */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-900/80 block">
            2. Horários Oficiais
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {/* Horário da cerimônia */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="ceremonyTime"
                  className="block text-xs font-semibold text-stone-700 uppercase tracking-wider"
                >
                  Horário da cerimônia
                </label>
                <span className="text-[10px] text-stone-400">Opcional</span>
              </div>
              <div className="relative">
                <Clock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="time"
                  id="ceremonyTime"
                  value={formData.ceremonyTime}
                  onChange={(e) => handleInputChange('ceremonyTime', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-700 transition-all"
                />
              </div>
              <span className="text-[11px] text-stone-500 mt-1 block">Início previsto no convite</span>
            </div>

            {/* Horário da recepção */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="receptionTime"
                  className="block text-xs font-semibold text-stone-700 uppercase tracking-wider"
                >
                  Horário da recepção
                </label>
                <span className="text-[10px] text-stone-400">Opcional</span>
              </div>
              <div className="relative">
                <Clock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="time"
                  id="receptionTime"
                  value={formData.receptionTime}
                  onChange={(e) => handleInputChange('receptionTime', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-700 transition-all"
                />
              </div>
              <span className="text-[11px] text-stone-500 mt-1 block">Abertura de coquetel/salão</span>
            </div>

            {/* Horário de encerramento */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="endTime"
                  className="block text-xs font-semibold text-stone-700 uppercase tracking-wider"
                >
                  Horário de encerramento
                </label>
                <span className="text-[10px] text-stone-400">Opcional</span>
              </div>
              <div className="relative">
                <Clock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="time"
                  id="endTime"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-700 transition-all"
                />
              </div>
              <span className="text-[11px] text-stone-500 mt-1 block">Término da música e festa</span>
            </div>
          </div>
        </div>

        {/* Section 3: Estilo e Equipe */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-900/80 block">
            3. Conceito, Fornecedores e Pessoas-Chave
          </span>

          {/* Estilo do casamento */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="weddingStyle"
                className="block text-xs font-semibold text-stone-700 uppercase tracking-wider"
              >
                Estilo do casamento
              </label>
              <span className="text-[10px] text-stone-400">Opcional</span>
            </div>
            <div className="relative">
              <Palette className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                id="weddingStyle"
                value={formData.weddingStyle}
                onChange={(e) => handleInputChange('weddingStyle', e.target.value)}
                placeholder="Ex: Romântico contemporâneo com toques clássicos, Boho chic, Minimalista elegante..."
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-700 transition-all"
              />
            </div>
          </div>

          {/* Fornecedores contratados */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="contractedVendors"
                className="block text-xs font-semibold text-stone-700 uppercase tracking-wider"
              >
                Fornecedores contratados
              </label>
              <span className="text-[10px] text-stone-400">Opcional</span>
            </div>
            <div className="relative">
              <Truck className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <textarea
                id="contractedVendors"
                rows={3}
                value={formData.contractedVendors}
                onChange={(e) => handleInputChange('contractedVendors', e.target.value)}
                placeholder="Ex: Buffet completo, Decoração e Flores, Foto & Filme, DJ, Bar de drinks, Vestido/Terno..."
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-700 transition-all resize-y"
              />
            </div>
          </div>

          {/* Padrinhos e pessoas importantes */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="vipPeople"
                className="block text-xs font-semibold text-stone-700 uppercase tracking-wider"
              >
                Padrinhos e pessoas importantes
              </label>
              <span className="text-[10px] text-stone-400">Opcional</span>
            </div>
            <div className="relative">
              <UserCheck className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <textarea
                id="vipPeople"
                rows={2}
                value={formData.vipPeople}
                onChange={(e) => handleInputChange('vipPeople', e.target.value)}
                placeholder="Ex: 8 casais de padrinhos (4 da noiva, 4 do noivo), pais dos noivos, 1 dama de honra, 2 pajens..."
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-700 transition-all resize-y"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Detalhes Especiais */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-900/80 block">
            4. Cuidados Especiais & Observações
          </span>

          {/* Necessidades especiais */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="specialNeeds"
                className="block text-xs font-semibold text-stone-700 uppercase tracking-wider"
              >
                Necessidades especiais (Acessibilidade / Alimentação)
              </label>
              <span className="text-[10px] text-stone-400">Opcional</span>
            </div>
            <div className="relative">
              <AlertCircle className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <textarea
                id="specialNeeds"
                rows={2}
                value={formData.specialNeeds}
                onChange={(e) => handleInputChange('specialNeeds', e.target.value)}
                placeholder="Ex: Avó necessita de rampa/acesso térreo. No buffet: 3 convidados vegetarianos..."
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-700 transition-all resize-y"
              />
            </div>
          </div>

          {/* Observações */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="notes"
                className="block text-xs font-semibold text-stone-700 uppercase tracking-wider"
              >
                Observações
              </label>
              <span className="text-[10px] text-stone-400">Opcional</span>
            </div>
            <div className="relative">
              <FileText className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <textarea
                id="notes"
                rows={3}
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Ex: Votos escritos pelos noivos, corte do bolo logo na entrada da recepção para liberar a pista cedo, fotos protocolares limitadas em 20 min..."
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-700 transition-all resize-y"
              />
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-stone-500 text-center sm:text-left">
            <span>Ao clicar, todo o roteiro operacional e de contingência será estruturado.</span>
          </div>

          <button
            type="submit"
            id="btn-generate-plan"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-sm shadow-sm hover:shadow transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            <span>Gerar planejamento</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
