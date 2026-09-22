import React, { useState } from 'react';
import { MessageSquare, Copy, Check, Send } from 'lucide-react';
import { WhatsAppTemplate } from '../types';

interface WhatsAppSectionProps {
  messages: WhatsAppTemplate[];
}

export const WhatsAppSection: React.FC<WhatsAppSectionProps> = ({ messages }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section id="whatsapp" className="break-before-page space-y-6">
      <div className="pb-4 border-b border-stone-200">
        <h2 className="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl font-bold text-stone-900">
          Mensagens Prontas para WhatsApp
        </h2>
        <p className="text-xs sm:text-sm text-stone-500">
          Textos calibrados para comunicação rápida com noivos, padrinhos, fornecedores e convidados, preenchidos estritamente com os dados fornecidos no briefing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.map((item) => {
          const isCopied = copiedId === item.id;
          const encoded = encodeURIComponent(item.messageText);
          const whatsappUrl = `https://api.whatsapp.com/send?text=${encoded}`;

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {item.recipientGroup}
                  </span>
                  <span className="text-xs text-stone-400">Texto formatado</span>
                </div>

                <h3 className="text-base font-bold text-stone-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-500 mb-3">
                  {item.description}
                </p>

                {/* Message Box */}
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-800 leading-relaxed font-sans whitespace-pre-line select-all">
                  {item.messageText}
                </div>
              </div>

              {/* Actions */}
              <div className="no-print mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(item.id, item.messageText)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-stone-600" />
                      <span>Copiar texto</span>
                    </>
                  )}
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar no WhatsApp</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
