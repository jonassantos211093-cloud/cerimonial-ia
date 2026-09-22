import React from 'react';
import {
  Calendar,
  Users,
  Clock,
  Palette,
  UserCheck,
  Truck,
  ShieldAlert,
  FileText,
  Sparkles,
  Info,
} from 'lucide-react';
import { GeneratedPlan, WeddingFormData } from '../types';

interface EventSummaryCardProps {
  plan: GeneratedPlan;
  formData: WeddingFormData;
}

export const EventSummaryCard: React.FC<EventSummaryCardProps> = ({
  plan,
  formData,
}) => {
  const { summary } = plan;

  return (
    <section id="resumo" className="break-inside-avoid space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl font-bold text-stone-900">
              Resumo do Evento
            </h2>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
              Visão Geral Consolidada
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500">
            Comparativo entre dados informados pelo cliente e estimativas técnicas do cerimonial.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-stone-600 bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200">
          <Info className="w-3.5 h-3.5 text-amber-700" />
          <span>
            {summary.totalHours ? `Duração estimada: ${summary.totalHours} horas` : 'Duração: A definir'}
          </span>
        </div>
      </div>

      {/* Past Date Warning Banner */}
      {summary.isPastDate && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-xs text-rose-900 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Aviso: Data informada no passado ({summary.daysUntilLabel}).</strong>
            <p className="text-rose-800 mt-0.5">
              O evento ocorreu antes da data atual do sistema. O planejamento é exibido com o objetivo de registro pós-evento ou modelo de checklist.
            </p>
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Convidados */}
        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-700" />
              <span className="font-semibold text-stone-700">Convidados</span>
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              summary.guestCount !== null ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-stone-100 text-stone-500'
            }`}>
              {summary.guestCount !== null ? 'Dado do Cliente' : 'Não informado'}
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-stone-900 font-mono">
            {summary.guestCount !== null ? summary.guestCount : 'Não informado'}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            {summary.guestCount !== null
              ? `Margem técnica de segurança (~10%): ${Math.round(summary.guestCount * 1.1)} pessoas (Sugestão)`
              : 'Definir para dimensionamento de insumos'}
          </div>
        </div>

        {/* Card 2: Horário Cerimônia */}
        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <span className="font-semibold text-stone-700">Cerimônia</span>
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              summary.hasCeremonyTime ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-amber-100 text-amber-800'
            }`}>
              {summary.hasCeremonyTime ? 'Dado do Cliente' : 'A definir'}
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-stone-900 font-mono">
            {summary.ceremonyTime}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Recepção: {summary.receptionTime} | Término: {summary.endTime}
          </div>
        </div>

        {/* Card 3: Staff Sugerido */}
        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span className="font-semibold text-stone-700">Equipe Técnica</span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200/70">
              Sugestão IA
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-stone-900 font-mono">
            {summary.estimatedStaff !== null ? `${summary.estimatedStaff} cerimonialistas` : 'A definir'}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 leading-tight">
            {summary.estimatedStaff !== null
              ? 'Referência: 1 profissional a cada 50-60 convidados'
              : 'Informe a quantidade de convidados'}
          </div>
        </div>

        {/* Card 4: Contagem Regressiva Dinâmica */}
        <div className={`p-4 rounded-xl border shadow-xs ${
          summary.isPastDate
            ? 'bg-rose-50/50 border-rose-200'
            : 'bg-white border-stone-200/80'
        }`}>
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-700" />
              <span className="font-semibold text-stone-700">Contagem de Dias</span>
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              summary.isPastDate ? 'bg-rose-100 text-rose-800' : 'bg-stone-100 text-stone-600'
            }`}>
              {summary.isPastDate ? 'Data no Passado' : 'Cálculo Dinâmico'}
            </span>
          </div>
          <div className="text-lg sm:text-xl font-bold text-stone-900 font-mono">
            {summary.daysUntilLabel}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            {summary.weddingDateFormatted}
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Conceito e Pessoas */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-700 uppercase tracking-wider">
                <Palette className="w-4 h-4 text-amber-700" />
                <span>Estilo do Casamento</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                summary.hasStyle ? 'bg-blue-50 text-blue-700' : 'bg-stone-100 text-stone-500'
              }`}>
                {summary.hasStyle ? 'Dado do Cliente' : 'Não informado'}
              </span>
            </div>
            <p className="text-sm text-stone-900 font-medium">
              {summary.style}
            </p>
          </div>

          <div className="pt-3 border-t border-stone-100">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-700 uppercase tracking-wider">
                <UserCheck className="w-4 h-4 text-stone-500" />
                <span>Padrinhos e Pessoas Importantes</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                formData.vipPeople ? 'bg-blue-50 text-blue-700' : 'bg-stone-100 text-stone-500'
              }`}>
                {formData.vipPeople ? 'Dado do Cliente' : 'Não informado'}
              </span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed whitespace-pre-wrap">
              {formData.vipPeople ? formData.vipPeople : 'Nenhum participante especial ou lista de padrinhos informada pelo cliente.'}
            </p>
          </div>
        </div>

        {/* Card 2: Fornecedores e Necessidades Especiais */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-700 uppercase tracking-wider">
                <Truck className="w-4 h-4 text-amber-700" />
                <span>Fornecedores Contratados</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                formData.contractedVendors ? 'bg-blue-50 text-blue-700' : 'bg-stone-100 text-stone-500'
              }`}>
                {formData.contractedVendors ? 'Dado do Cliente' : 'Não informado'}
              </span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              {formData.contractedVendors
                ? formData.contractedVendors
                : 'Nenhum fornecedor informado pelo cliente.'}
            </p>
          </div>

          <div className="pt-3 border-t border-stone-100">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4 text-amber-700" />
                <span>Necessidades Especiais & Acessibilidade</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                formData.specialNeeds ? 'bg-amber-100 text-amber-900 font-semibold' : 'bg-stone-100 text-stone-500'
              }`}>
                {formData.specialNeeds ? 'Dado do Cliente (Preservado)' : 'Nenhuma'}
              </span>
            </div>
            <p className="text-xs text-stone-800 leading-relaxed bg-amber-50/70 p-2.5 rounded-lg border border-amber-200/60 font-medium">
              {formData.specialNeeds
                ? formData.specialNeeds
                : 'Nenhuma necessidade especial cadastrada pelo cliente.'}
            </p>
          </div>
        </div>
      </div>

      {formData.notes && (
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-700 uppercase tracking-wider">
              <FileText className="w-4 h-4 text-amber-700" />
              <span>Observações Fornecidas pelo Cliente</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
              Dado do Cliente
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic bg-stone-50 p-3 rounded-xl border border-stone-100">
            &ldquo;{formData.notes}&rdquo;
          </p>
        </div>
      )}
    </section>
  );
};
