import React from 'react';
import { Truck, Clock, CheckCircle2, ShieldCheck, Sparkles, Check, Info, AlertCircle } from 'lucide-react';
import { VendorAssignment, ServiceStatusItem } from '../types';

interface VendorsSectionProps {
  vendors: VendorAssignment[];
  servicesOverview?: ServiceStatusItem[];
}

export const VendorsSection: React.FC<VendorsSectionProps> = ({ vendors, servicesOverview }) => {
  return (
    <section id="fornecedores" className="break-before-page space-y-6">
      <div className="pb-4 border-b border-stone-200">
        <h2 className="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl font-bold text-stone-900">
          Fornecedores e Serviços
        </h2>
        <p className="text-xs sm:text-sm text-stone-500">
          Matriz de alinhamento operacional. O Cerimonial IA preserva estritamente os fornecedores informados pelo cliente e nunca presume serviços sem confirmação.
        </p>
      </div>

      {/* Painel de Status de Serviços: Contratado vs. Não Informado */}
      {servicesOverview && servicesOverview.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-stone-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-700" />
                <span>Verificação de Serviços Principais (Não Presunção)</span>
              </h3>
              <p className="text-xs text-stone-500">
                Itens como buffet, DJ, fotografia, músicos, decoração e gerador só constam como contratados quando informados.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-stone-500">
              Integridade do Briefing
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {servicesOverview.map((srv) => (
              <div
                key={srv.id}
                className={`p-3 rounded-xl border text-xs flex flex-col justify-between ${
                  srv.isInformed
                    ? 'bg-blue-50/40 border-blue-200/80 text-blue-950'
                    : 'bg-stone-50/70 border-stone-200 text-stone-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-stone-900">{srv.serviceName}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap ${
                        srv.isInformed
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {srv.statusLabel}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-snug mt-1">
                    {srv.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lista de Fornecedores Cadastrados */}
      {vendors.length === 0 ? (
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 sm:p-8 text-center max-w-xl mx-auto space-y-3">
          <div className="w-10 h-10 rounded-full bg-stone-200/80 flex items-center justify-center mx-auto text-stone-600">
            <Truck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-stone-900">
            Nenhum Fornecedor Informado pelo Cliente
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Nenhum profissional ou empresa foi informado no campo de fornecedores contratados. Para preservar a fidelidade aos dados do cliente, o sistema não inventa fornecedores ou contratos fictícios.
          </p>
          <p className="text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
            <strong>Dica do Cerimonial:</strong> Retorne ao formulário e liste os profissionais já contratados (ex: Buffet, DJ, Decoração, Fotógrafo) para gerar a matriz detalhada de chegada e vistorias.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vendors.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1">
                        <Check className="w-2.5 h-2.5" />
                        DADO INFORMADO PELO CLIENTE
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-stone-900">
                      {vendor.vendorName}
                    </h3>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 text-xs font-mono font-bold text-amber-900 bg-amber-50/70 border border-amber-200/60 px-2 py-1 rounded-md">
                      <Clock className="w-3.5 h-3.5 text-amber-700" />
                      <span>{vendor.arrivalTime}</span>
                    </div>
                    <span className="text-[10px] text-amber-800 flex items-center justify-end gap-1 mt-0.5">
                      <Sparkles className="w-2.5 h-2.5" />
                      Sugestão de chegada
                    </span>
                  </div>
                </div>

                {/* Checkpoint box */}
                <div className="my-3 p-3 rounded-xl bg-stone-50 border border-stone-200/70 text-xs text-stone-700">
                  <div className="font-semibold text-stone-900 flex items-center gap-1.5 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                    <span>Checkpoint Técnico (Sugestão do Cerimonial IA):</span>
                  </div>
                  <p className="leading-relaxed text-stone-600">
                    {vendor.checkpoint}
                  </p>
                </div>

                {/* Responsibilities list */}
                <div className="mt-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                    Responsabilidades Operacionais Sugeridas
                  </div>
                  <ul className="space-y-2">
                    {vendor.responsibilities.map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-stone-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span>Origem: Informado no briefing</span>
                <span className="text-[11px] text-stone-400">Contrato sob responsabilidade do cliente</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
