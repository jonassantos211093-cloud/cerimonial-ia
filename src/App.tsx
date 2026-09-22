import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { EventForm } from './components/EventForm';
import { PlanHeader } from './components/PlanHeader';
import { PendingInfoSection } from './components/PendingInfoSection';
import { EventSummaryCard } from './components/EventSummaryCard';
import { TimelineSection } from './components/TimelineSection';
import { PreparationChecklistSection } from './components/PreparationChecklistSection';
import { VendorsSection } from './components/VendorsSection';
import { WhatsAppSection } from './components/WhatsAppSection';
import { CeremonyScriptSection } from './components/CeremonyScriptSection';
import { ContingencySection } from './components/ContingencySection';
import { DayDChecklistSection } from './components/DayDChecklistSection';
import { PostEventChecklistSection } from './components/PostEventChecklistSection';
import { WeddingFormData, GeneratedPlan } from './types';
import {
  INITIAL_WEDDING_DATA,
  EMPTY_WEDDING_DATA,
  generateWeddingPlan,
  formatPlanAsPlainText,
} from './utils/planGenerator';
import { CheckCircle2, ArrowUp, Sparkles, HeartHandshake } from 'lucide-react';

export default function App() {
  const [formData, setFormData] = useState<WeddingFormData>(INITIAL_WEDDING_DATA);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);
  const [viewMode, setViewMode] = useState<'form' | 'plan'>('form');
  const [activeSection, setActiveSection] = useState<string>('resumo');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize with plan on mount so user can see it or immediately generate
  useEffect(() => {
    // Generate initial plan with default demo data
    const initialPlan = generateWeddingPlan(INITIAL_WEDDING_DATA);
    setGeneratedPlan(initialPlan);
  }, []);

  const handleGeneratePlan = (e: React.FormEvent) => {
    e.preventDefault();
    const newPlan = generateWeddingPlan(formData);
    setGeneratedPlan(newPlan);
    setViewMode('plan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Planejamento operacional gerado com sucesso!');
  };

  const handleRegenerate = () => {
    const updatedPlan = generateWeddingPlan(formData);
    setGeneratedPlan(updatedPlan);
    showToast('Planejamento recalculado e atualizado!');
  };

  const handleResetToExample = () => {
    setFormData(INITIAL_WEDDING_DATA);
    const examplePlan = generateWeddingPlan(INITIAL_WEDDING_DATA);
    setGeneratedPlan(examplePlan);
    showToast('Exemplo de Jéssica e Pedro carregado com sucesso.');
  };

  const handleClearForm = () => {
    setFormData(EMPTY_WEDDING_DATA);
    showToast('Formulário limpo. Preencha apenas os campos desejados.');
  };

  const handleCopyPlan = () => {
    if (!generatedPlan) return;
    const plainText = formatPlanAsPlainText(generatedPlan, formData);
    navigator.clipboard.writeText(plainText);
    setIsCopied(true);
    showToast('Planejamento completo copiado para a área de transferência!');
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSelectSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col justify-between">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-stone-100 px-5 py-3 rounded-2xl shadow-xl border border-stone-700 flex items-center gap-2.5 text-xs sm:text-sm font-medium animate-in fade-in slide-in-from-top-3"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-3 text-stone-400 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Navbar */}
      <Navbar
        onResetToExample={handleResetToExample}
        hasGeneratedPlan={!!generatedPlan && viewMode === 'plan'}
        onEditForm={() => setViewMode('form')}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {viewMode === 'form' ? (
          <EventForm
            formData={formData}
            onChange={setFormData}
            onSubmit={handleGeneratePlan}
            onResetExample={handleResetToExample}
            onClearForm={handleClearForm}
          />
        ) : (
          generatedPlan && (
            <div className="space-y-8 sm:space-y-12">
              {/* Header with quick stats & action buttons */}
              <PlanHeader
                plan={generatedPlan}
                onEdit={() => setViewMode('form')}
                onRegenerate={handleRegenerate}
                onCopyAll={handleCopyPlan}
                onPrint={handlePrint}
                activeSection={activeSection}
                onSelectSection={handleSelectSection}
                isCopied={isCopied}
              />

              {/* Sections Container */}
              <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-12 sm:space-y-16 pb-16">
                {/* 0. Informações Pendentes (Se houver campos não informados no briefing) */}
                {generatedPlan.pendingInformation.length > 0 && (
                  <PendingInfoSection
                    pendingItems={generatedPlan.pendingInformation}
                    onFocusField={() => setViewMode('form')}
                  />
                )}

                {/* 1. Resumo do evento */}
                <EventSummaryCard plan={generatedPlan} formData={formData} />

                {/* 2. Cronograma Minuto a Minuto */}
                <TimelineSection timeline={generatedPlan.timeline} />

                {/* 3. Checklist de Preparação */}
                <PreparationChecklistSection
                  phases={generatedPlan.preparationChecklist}
                />

                {/* 4. Fornecedores e responsabilidades */}
                <VendorsSection
                  vendors={generatedPlan.vendors}
                  servicesOverview={generatedPlan.servicesOverview}
                />

                {/* 5. Mensagens prontas para WhatsApp */}
                <WhatsAppSection messages={generatedPlan.whatsappMessages} />

                {/* 6. Roteiro básico da cerimônia */}
                <CeremonyScriptSection steps={generatedPlan.ceremonyScript} />

                {/* 7. Plano para imprevistos */}
                <ContingencySection
                  contingencies={generatedPlan.contingencyPlan}
                />

                {/* 8. Checklist do Dia D */}
                <DayDChecklistSection items={generatedPlan.dayDChecklist} />

                {/* 9. Checklist pós-evento */}
                <PostEventChecklistSection
                  items={generatedPlan.postEventChecklist}
                />
              </div>

              {/* Bottom Quick Return Bar */}
              <div className="no-print border-t border-stone-200/80 bg-white/80 backdrop-blur-md py-4 px-4 sm:px-8 sticky bottom-0 z-30">
                <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
                  <div className="text-xs text-stone-500 hidden sm:block">
                    Casamento de <strong>{generatedPlan.summary.coupleNames}</strong> &bull; {generatedPlan.summary.weddingDateFormatted}
                  </div>

                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      type="button"
                      onClick={() => setViewMode('form')}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
                    >
                      Editar Informações
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyPlan}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors cursor-pointer"
                    >
                      {isCopied ? 'Copiado!' : 'Copiar Planejamento'}
                    </button>

                    <button
                      type="button"
                      onClick={handlePrint}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 transition-colors cursor-pointer shadow-xs"
                    >
                      Imprimir / Salvar PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-stone-200 bg-white py-8 px-4 text-center text-xs text-stone-500">
        <div className="max-w-4xl mx-auto space-y-2">
          <div className="flex items-center justify-center gap-2 font-['Cormorant_Garamond',serif] text-base font-bold text-stone-800">
            <HeartHandshake className="w-4 h-4 text-amber-700" />
            <span>Cerimonial IA — Assistente de Pré-Evento</span>
          </div>
          <p>
            Do briefing ao Dia D, organize seu evento com inteligência &middot; Ferramenta para cerimonialistas de casamento
          </p>
        </div>
      </footer>
    </div>
  );
}
