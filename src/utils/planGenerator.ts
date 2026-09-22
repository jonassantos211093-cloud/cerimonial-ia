import {
  WeddingFormData,
  GeneratedPlan,
  DayTimelineItem,
  VendorAssignment,
  WhatsAppTemplate,
  CeremonyStep,
  ContingencyPlanItem,
  PendingInfoItem,
  ServiceStatusItem,
  PreparationChecklistPhase,
} from '../types';

export const EMPTY_WEDDING_DATA: WeddingFormData = {
  coupleNames: '',
  weddingDate: '',
  cityAndVenue: '',
  guestCount: '',
  ceremonyTime: '',
  receptionTime: '',
  endTime: '',
  weddingStyle: '',
  contractedVendors: '',
  vipPeople: '',
  specialNeeds: '',
  notes: '',
};

// Demonstração opcional claramente identificada como "Exemplo"
export const DEMO_EXAMPLE_DATA: WeddingFormData = {
  coupleNames: 'Jéssica e Pedro',
  weddingDate: '2027-12-25',
  cityAndVenue: 'Belo Horizonte, Espaço Ilustríssimo',
  guestCount: 150,
  ceremonyTime: '16:30',
  receptionTime: '18:00',
  endTime: '02:00',
  weddingStyle: 'Romântico contemporâneo com toques clássicos',
  contractedVendors: 'Buffet Ilustríssimo Gastronomia, Decoração & Flores Bella, Fotografia e Vídeo Lumina, DJ & Sonorização Becker, Banda acústica da cerimônia, Bar de drinks, Vestido e terno dos noivos, Dia da noiva/maquiagem',
  vipPeople: '8 casais de padrinhos (4 da noiva, 4 do noivo), pais dos noivos, 1 dama de honra, 2 pajens',
  specialNeeds: 'Avó da noiva necessita de acesso térreo/rampa. No buffet: 3 convidados vegetarianos.',
  notes: 'Votos escritos pelos noivos. O corte do bolo acontecerá logo na entrada dos noivos na recepção. Fotos protocolares com limite de 20 minutos.',
};

export const INITIAL_WEDDING_DATA: WeddingFormData = DEMO_EXAMPLE_DATA;

export function formatDatePtBR(dateStr: string): string {
  if (!dateStr || !dateStr.trim()) return 'Data não informada';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  } catch {
    // fallback
  }
  return dateStr;
}

/**
 * Cálculo dinâmico de dias restantes.
 * Utiliza estritamente a data atual do dispositivo/sistema e a data informada pelo cliente.
 * NUNCA armazena nem utiliza número fixo.
 * Se a data estiver no passado, informa claramente.
 */
export function calculateDaysUntil(dateStr: string): {
  status: 'defined' | 'today' | 'passed' | 'missing';
  days: number | null;
  label: string;
  isPast: boolean;
} {
  if (!dateStr || !dateStr.trim()) {
    return {
      status: 'missing',
      days: null,
      label: 'Data não informada',
      isPast: false,
    };
  }

  const parts = dateStr.split('-');
  if (parts.length !== 3) {
    return {
      status: 'missing',
      days: null,
      label: 'Data não informada',
      isPast: false,
    };
  }

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return {
      status: 'missing',
      days: null,
      label: 'Data inválida',
      isPast: false,
    };
  }

  const targetDate = new Date(year, month, day);
  const now = new Date();
  const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffMs = targetDate.getTime() - todayDate.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    return {
      status: 'defined',
      days: diffDays,
      label: `${diffDays} ${diffDays === 1 ? 'dia restante' : 'dias restantes'}`,
      isPast: false,
    };
  } else if (diffDays === 0) {
    return {
      status: 'today',
      days: 0,
      label: 'É hoje!',
      isPast: false,
    };
  } else {
    const passed = Math.abs(diffDays);
    return {
      status: 'passed',
      days: passed,
      label: `Data no passado (evento realizado há ${passed} ${passed === 1 ? 'dia' : 'dias'})`,
      isPast: true,
    };
  }
}

function parseTimeToMinutes(timeStr: string): number | null {
  if (!timeStr || !timeStr.trim()) return null;
  const [hStr, mStr] = timeStr.split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (isNaN(h) || isNaN(m)) return null;
  return h * 60 + m;
}

function minutesToTimeString(minutes: number): string {
  let normalized = minutes % (24 * 60);
  if (normalized < 0) normalized += 24 * 60;
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function generateWeddingPlan(data: WeddingFormData): GeneratedPlan {
  // Check pending / missing information
  const pendingInformation: PendingInfoItem[] = [];

  const hasCoupleNames = Boolean(data.coupleNames && data.coupleNames.trim());
  const hasWeddingDate = Boolean(data.weddingDate && data.weddingDate.trim());
  const hasCityAndVenue = Boolean(data.cityAndVenue && data.cityAndVenue.trim());
  const guestCountNum = typeof data.guestCount === 'number' && data.guestCount > 0 ? data.guestCount : null;
  const hasGuestCount = guestCountNum !== null;
  const hasCeremonyTime = Boolean(data.ceremonyTime && data.ceremonyTime.trim());
  const hasReceptionTime = Boolean(data.receptionTime && data.receptionTime.trim());
  const hasEndTime = Boolean(data.endTime && data.endTime.trim());
  const hasStyle = Boolean(data.weddingStyle && data.weddingStyle.trim());
  const hasVendors = Boolean(data.contractedVendors && data.contractedVendors.trim());
  const hasVipPeople = Boolean(data.vipPeople && data.vipPeople.trim());
  const hasSpecialNeeds = Boolean(data.specialNeeds && data.specialNeeds.trim());

  if (!hasCoupleNames) {
    pendingInformation.push({
      id: 'pend-couple',
      field: 'coupleNames',
      label: 'Nome dos noivos',
      status: 'missing',
      description: 'O nome dos noivos não foi informado.',
      impact: 'O planejamento usará a denominação genérica "Noivos".',
      recommendation: 'Cadastre o nome do casal para personalizar o roteiro, mensagens e comunicados.',
    });
  }

  if (!hasWeddingDate) {
    pendingInformation.push({
      id: 'pend-date',
      field: 'weddingDate',
      label: 'Data do casamento',
      status: 'missing',
      description: 'A data do evento não foi informada.',
      impact: 'A contagem de dias restantes e os prazos retroativos dos checklists ficam como "A definir".',
      recommendation: 'Defina a data para que o sistema calcule os dias restantes e a linha do tempo preparatória.',
    });
  }

  if (!hasCityAndVenue) {
    pendingInformation.push({
      id: 'pend-venue',
      field: 'cityAndVenue',
      label: 'Cidade e local',
      status: 'missing',
      description: 'O local e a cidade do evento não foram informados.',
      impact: 'Pontos de montagem, logística e rotas de fornecedores permanecem a definir.',
      recommendation: 'Informe cidade e espaço para alinhamento logístico do cerimonial e das equipes.',
    });
  }

  if (!hasGuestCount) {
    pendingInformation.push({
      id: 'pend-guests',
      field: 'guestCount',
      label: 'Número de convidados',
      status: 'missing',
      description: 'A quantidade de convidados não foi informada.',
      impact: 'O dimensionamento técnico da equipe de cerimonialistas fica a definir.',
      recommendation: 'Informe a previsão de convidados para obter a sugestão técnica de equipe necessária.',
    });
  }

  if (!hasCeremonyTime) {
    pendingInformation.push({
      id: 'pend-ceremony-time',
      field: 'ceremonyTime',
      label: 'Horário da cerimônia',
      status: 'missing',
      description: 'O horário da cerimônia não foi informado.',
      impact: 'O cronograma minuto a minuto depende deste marco central. Horários marcados como "A definir".',
      recommendation: 'Preencha o horário previsto no convite para calibrar os horários de montagem e cortejo.',
    });
  }

  if (!hasReceptionTime) {
    pendingInformation.push({
      id: 'pend-reception-time',
      field: 'receptionTime',
      label: 'Horário da recepção',
      status: 'missing',
      description: 'O horário da recepção não foi informado.',
      impact: 'Os horários de transição entre cerimônia, fotos protocolares e início da recepção ficam a definir.',
      recommendation: 'Preencha o horário de abertura do salão para calibrar as fotos e o início da recepção.',
    });
  }

  if (!hasEndTime) {
    pendingInformation.push({
      id: 'pend-end-time',
      field: 'endTime',
      label: 'Horário de encerramento',
      status: 'missing',
      description: 'O horário de término não foi informado.',
      impact: 'A duração total do evento e o início da desmontagem ficam como "A definir".',
      recommendation: 'Informe o horário limite de encerramento contratado com o espaço.',
    });
  }

  if (!hasVendors) {
    pendingInformation.push({
      id: 'pend-vendors',
      field: 'contractedVendors',
      label: 'Fornecedores contratados',
      status: 'missing',
      description: 'Nenhum fornecedor foi informado pelo cliente.',
      impact: 'A matriz de fornecedores e checkpoints operacionais não presume serviços contratados.',
      recommendation: 'Liste os serviços e empresas contratadas (ex: Buffet, Fotógrafo, DJ) para estruturar a checagem.',
    });
  }

  if (!hasVipPeople) {
    pendingInformation.push({
      id: 'pend-vip',
      field: 'vipPeople',
      label: 'Padrinhos e cortejo',
      status: 'missing',
      description: 'A lista e quantidade de padrinhos/pessoas de honra não foram informadas.',
      impact: 'O roteiro da cerimônia manterá a estrutura do cortejo como "Quantidade a definir".',
      recommendation: 'Informe quantos casais de padrinhos, damas e pajens participarão do cortejo.',
    });
  }

  // Strictly check which specific services were informed by the client
  const vendorsText = (data.contractedVendors || '').toLowerCase();
  const checkServiceInformed = (keywords: string[]): boolean => {
    if (!hasVendors) return false;
    return keywords.some((kw) => vendorsText.includes(kw));
  };

  const serviceStatus = {
    buffet: checkServiceInformed(['buffet', 'gastronom', 'jantar', 'almoço', 'coquetel', 'comida', 'buffê']),
    dj: checkServiceInformed(['dj', 'som', 'sonoriza']),
    musicos: checkServiceInformed(['banda', 'músic', 'music', 'orquestra', 'acústic', 'acustic', 'coral']),
    fotografia: checkServiceInformed(['foto', 'fotógraf', 'fotograf', 'film', 'vídeo', 'video']),
    decoracao: checkServiceInformed(['decor', 'flor', 'cenograf', 'ambient']),
    celebrante: checkServiceInformed(['celebrant', 'padre', 'pastor', 'juiz', 'diácon', 'diacon']),
    gerador: checkServiceInformed(['gerador', 'energia']),
  };

  // Structured Services Overview (Contratado vs Serviço Não Informado)
  const servicesOverview: ServiceStatusItem[] = [
    {
      id: 'srv-buffet',
      serviceName: 'Buffet / Gastronomia',
      isInformed: serviceStatus.buffet,
      statusLabel: serviceStatus.buffet ? 'Contratado (Informado pelo cliente)' : 'Serviço não informado',
      details: serviceStatus.buffet
        ? 'Serviço gastronômico informado pelo cliente no briefing.'
        : 'Não informado pelo cliente. Não presumir contratação; caso contratado, alinhar cardápio e horários.',
    },
    {
      id: 'srv-dj',
      serviceName: 'DJ & Sonorização',
      isInformed: serviceStatus.dj,
      statusLabel: serviceStatus.dj ? 'Contratado (Informado pelo cliente)' : 'Serviço não informado',
      details: serviceStatus.dj
        ? 'Serviço de DJ/som informado pelo cliente no briefing.'
        : 'Não informado pelo cliente. Não presumir contratação; caso contratado, alinhar rider técnico.',
    },
    {
      id: 'srv-musicos',
      serviceName: 'Músicos / Banda da Cerimônia',
      isInformed: serviceStatus.musicos,
      statusLabel: serviceStatus.musicos ? 'Contratado (Informado pelo cliente)' : 'Serviço não informado',
      details: serviceStatus.musicos
        ? 'Serviço musical informado pelo cliente no briefing.'
        : 'Não informado pelo cliente. Não presumir contratação; caso contratado, alinhar cortejo musical.',
    },
    {
      id: 'srv-foto',
      serviceName: 'Fotografia & Filmagem',
      isInformed: serviceStatus.fotografia,
      statusLabel: serviceStatus.fotografia ? 'Contratado (Informado pelo cliente)' : 'Serviço não informado',
      details: serviceStatus.fotografia
        ? 'Serviço de fotografia/vídeo informado pelo cliente no briefing.'
        : 'Não informado pelo cliente. Não presumir contratação; caso contratado, alinhar lista de fotos protocolares.',
    },
    {
      id: 'srv-decor',
      serviceName: 'Decoração & Flores',
      isInformed: serviceStatus.decoracao,
      statusLabel: serviceStatus.decoracao ? 'Contratado (Informado pelo cliente)' : 'Serviço não informado',
      details: serviceStatus.decoracao
        ? 'Serviço de decoração informado pelo cliente no briefing.'
        : 'Não informado pelo cliente. Não presumir contratação; caso contratado, alinhar layout e montagem.',
    },
    {
      id: 'srv-celebrante',
      serviceName: 'Celebrante / Autoridade Religiosa ou Civil',
      isInformed: serviceStatus.celebrante,
      statusLabel: serviceStatus.celebrante ? 'Contratado (Informado pelo cliente)' : 'Serviço não informado',
      details: serviceStatus.celebrante
        ? 'Celebrante informado pelo cliente no briefing.'
        : 'Não informado pelo cliente. Não presumir contratação; definir condutor dos votos e ritos solenes.',
    },
    {
      id: 'srv-gerador',
      serviceName: 'Gerador Elétrico',
      isInformed: serviceStatus.gerador,
      statusLabel: serviceStatus.gerador ? 'Contratado (Informado pelo cliente)' : 'Serviço não informado',
      details: serviceStatus.gerador
        ? 'Gerador de energia informado pelo cliente no briefing.'
        : 'Não informado pelo cliente. Não presumir gerador contratado; verificar capacidade elétrica do local.',
    },
  ];

  // Calculate times
  const ceremonyMin = parseTimeToMinutes(data.ceremonyTime);
  const receptionMin = parseTimeToMinutes(data.receptionTime);
  let endMin = parseTimeToMinutes(data.endTime);

  let totalHours: number | null = null;
  let totalHoursLabel = 'A definir';

  if (ceremonyMin !== null && endMin !== null) {
    let diff = endMin - ceremonyMin;
    if (diff <= 0) {
      diff += 24 * 60; // passes midnight
    }
    totalHours = Math.max(1, Math.round(diff / 60));
    totalHoursLabel = `${totalHours} horas (estimativa baseada nos horários informados)`;
  }

  let estimatedStaff: number | null = null;
  let estimatedStaffLabel = 'A definir conforme número de convidados';
  if (guestCountNum) {
    estimatedStaff = Math.max(2, Math.ceil(guestCountNum / 60));
    estimatedStaffLabel = `${estimatedStaff} cerimonialistas (Sugestão técnica: 1 profissional a cada 50-60 convidados)`;
  }

  const daysUntilObj = calculateDaysUntil(data.weddingDate);

  // Build Day Timeline - strictly separating CLIENT_DATA from CERIMONIAL_SUGGESTION
  // STRICT RULE: If vendor/service was not informed by client, responsible is 'Responsável: A definir'
  const timeline: DayTimelineItem[] = [];

  const coupleDisplayName = hasCoupleNames ? data.coupleNames : 'Noivos';
  const venueDisplayName = hasCityAndVenue ? data.cityAndVenue : 'local do evento (a definir)';

  const getTimeString = (offsetMinutes: number, fallbackLabel: string): { time: string; isDefined: boolean } => {
    if (ceremonyMin !== null) {
      return {
        time: minutesToTimeString(ceremonyMin + offsetMinutes),
        isDefined: true,
      };
    }
    return {
      time: `A definir (${fallbackLabel})`,
      isDefined: false,
    };
  };

  // 1. Início da Montagem
  const tMontagem = getTimeString(-390, 'Sugestão: ~6h30 antes da cerimônia');
  timeline.push({
    id: 'time-montagem',
    time: tMontagem.time,
    isTimeDefined: tMontagem.isDefined,
    title: serviceStatus.decoracao
      ? 'Início da Montagem da Decoração & Cenografia'
      : 'Início da Montagem no Local (Serviço de decoração não informado)',
    description: serviceStatus.decoracao
      ? `Abertura do espaço e acompanhamento da chegada da decoração informada em ${venueDisplayName}. Vistoria de layout e pontos de energia.`
      : `Abertura do espaço em ${venueDisplayName}. Serviço de decoração não informado pelo cliente. Sugestão: caso contratado, prever ~6h30 de antecedência.`,
    responsible: serviceStatus.decoracao
      ? 'Equipe de Decoração Informada & Cerimonial'
      : 'Responsável: A definir',
    phase: 'pre',
    sourceType: 'CERIMONIAL_SUGGESTION',
    sourceLabel: 'SUGESTÃO DO CERIMONIAL IA',
  });

  // 2. Montagem de Gastronomia / Buffet
  const tBuffet = getTimeString(-210, 'Sugestão: ~3h30 antes da cerimônia');
  timeline.push({
    id: 'time-buffet-chegada',
    time: tBuffet.time,
    isTimeDefined: tBuffet.isDefined,
    title: serviceStatus.buffet
      ? 'Chegada da Equipe de Buffet & Gastronomia'
      : 'Chegada da Gastronomia (Serviço de buffet não informado)',
    description: serviceStatus.buffet
      ? `Chegada da equipe do buffet contratado para montagem de louças, mise-en-place e refrigeração de bebidas.`
      : `Serviço de buffet não informado pelo cliente. Não presumir buffet contratado; caso haja serviço de alimentação, sugerir chegada com ~3h30 de antecedência.`,
    responsible: serviceStatus.buffet
      ? 'Equipe do Buffet Informada'
      : 'Responsável: A definir',
    phase: 'pre',
    sourceType: 'CERIMONIAL_SUGGESTION',
    sourceLabel: 'SUGESTÃO DO CERIMONIAL IA',
  });

  // 3. Chegada de DJ / Som
  const tSom = getTimeString(-150, 'Sugestão: ~2h30 antes da cerimônia');
  timeline.push({
    id: 'time-som',
    time: tSom.time,
    isTimeDefined: tSom.isDefined,
    title: serviceStatus.dj || serviceStatus.musicos
      ? 'Chegada da Equipe de Som e Passagem de Áudio'
      : 'Testes de Áudio e Sonorização (Serviço de som/DJ não informado)',
    description: serviceStatus.dj || serviceStatus.musicos
      ? `Montagem de cabos, microfones da cerimônia e passagem de som no espaço.`
      : `Serviço de som/DJ não informado pelo cliente. Sugestão técnica: caso haja músicos ou DJ contratados, testar microfones e caixas com ~2h30 de antecedência.`,
    responsible: serviceStatus.dj || serviceStatus.musicos
      ? 'Equipe Musical / DJ Informada'
      : 'Responsável: A definir',
    phase: 'pre',
    sourceType: 'CERIMONIAL_SUGGESTION',
    sourceLabel: 'SUGESTÃO DO CERIMONIAL IA',
  });

  // 4. Chegada de Foto e Vídeo
  const tFotoPre = getTimeString(-120, 'Sugestão: ~2h antes da cerimônia');
  timeline.push({
    id: 'time-foto-pre',
    time: tFotoPre.time,
    isTimeDefined: tFotoPre.isDefined,
    title: serviceStatus.fotografia
      ? 'Início da Cobertura de Foto & Filme no Local'
      : 'Cobertura Fotográfica no Local (Serviço de foto/filme não informado)',
    description: serviceStatus.fotografia
      ? `Fotos do espaço decorado antes da entrada de convidados e detalhes de ambientação.`
      : `Serviço de foto/filme não informado pelo cliente. Sugestão: caso contratado, registrar cenografia antes da entrada do público.`,
    responsible: serviceStatus.fotografia
      ? 'Fotografia & Vídeo Informados'
      : 'Responsável: A definir',
    phase: 'pre',
    sourceType: 'CERIMONIAL_SUGGESTION',
    sourceLabel: 'SUGESTÃO DO CERIMONIAL IA',
  });

  // 5. Chegada do Cerimonial
  const tCerimonial = getTimeString(-120, 'Sugestão: ~2h antes da cerimônia');
  timeline.push({
    id: 'time-cerimonial-chegada',
    time: tCerimonial.time,
    isTimeDefined: tCerimonial.isDefined,
    title: 'Chegada da Equipe de Cerimonial no Local',
    description: `Conferência do checklist do Dia D, colocação do kit toalete, checagem de caneta da ata e alinhamento de postos.`,
    responsible: 'Coordenação do Cerimonial',
    phase: 'pre',
    sourceType: 'CERIMONIAL_SUGGESTION',
    sourceLabel: 'SUGESTÃO DO CERIMONIAL IA',
  });

  // 6. Chegada do Noivo
  const tNoivo = getTimeString(-60, 'Sugestão: ~1h antes da cerimônia');
  timeline.push({
    id: 'time-noivo',
    time: tNoivo.time,
    isTimeDefined: tNoivo.isDefined,
    title: 'Chegada do Noivo ao Local da Cerimônia',
    description: `Recepção do noivo, colocação da flor de lapela pelo cerimonial e direcionamento a sala privativa.`,
    responsible: 'Coordenação do Cerimonial & Noivo',
    phase: 'pre',
    sourceType: 'CERIMONIAL_SUGGESTION',
    sourceLabel: 'SUGESTÃO DO CERIMONIAL IA',
  });

  // 7. Chegada dos Padrinhos
  const tPadrinhos = getTimeString(-45, 'Sugestão: ~45 min antes da cerimônia');
  timeline.push({
    id: 'time-padrinhos',
    time: tPadrinhos.time,
    isTimeDefined: tPadrinhos.isDefined,
    title: 'Chegada dos Padrinhos, Madrinhas e Cortejo',
    description: `Recepção dos casais de padrinhos, colocação de corsages/lapelas e alinhamento da ordem de entrada do cortejo.`,
    responsible: 'Cerimonial & Padrinhos',
    phase: 'pre',
    sourceType: 'CERIMONIAL_SUGGESTION',
    sourceLabel: 'SUGESTÃO DO CERIMONIAL IA',
  });

  // 8. Chegada da Noiva
  const tNoiva = getTimeString(-20, 'Sugestão: ~20 min antes da cerimônia');
  timeline.push({
    id: 'time-noiva',
    time: tNoiva.time,
    isTimeDefined: tNoiva.isDefined,
    title: 'Chegada da Noiva e Posicionamento em Carro / Antessala',
    description: `Recepção do carro da noiva pelo cerimonial, entrega do buquê e conferência do véu e vestido.`,
    responsible: 'Cerimonialista Responsável',
    phase: 'pre',
    sourceType: 'CERIMONIAL_SUGGESTION',
    sourceLabel: 'SUGESTÃO DO CERIMONIAL IA',
  });

  // 9. INÍCIO DA CERIMÔNIA (DADO INFORMADO PELO CLIENTE se fornecido)
  timeline.push({
    id: 'time-cerimonia',
    time: hasCeremonyTime ? data.ceremonyTime : 'A definir (Horário da cerimônia não informado)',
    isTimeDefined: hasCeremonyTime,
    title: 'Início Oficial da Cerimônia de Casamento',
    description: `Fechamento das portas / acesso, início do cortejo solene (noivo, pais, padrinhos, crianças e noiva).`,
    responsible: serviceStatus.celebrante
      ? 'Celebrante Informado, Cerimonial & Noivos'
      : 'Cerimonial & Noivos (Celebrante não informado - a definir)',
    phase: 'ceremony',
    sourceType: hasCeremonyTime ? 'CLIENT_DATA' : 'CERIMONIAL_SUGGESTION',
    sourceLabel: hasCeremonyTime ? 'DADO INFORMADO PELO CLIENTE' : 'SUGESTÃO DO CERIMONIAL IA',
  });

  // 10. Troca de Alianças e Votos
  const tVotos = getTimeString(30, 'Sugestão: ~30 min após início da cerimônia');
  timeline.push({
    id: 'time-votos',
    time: tVotos.time,
    isTimeDefined: tVotos.isDefined,
    title: 'Votos Matrimoniais & Troca das Alianças',
    description: `Entrada das alianças, bênção solene, leitura dos votos dos noivos e recolhimento temporário do buquê pelo cerimonial.`,
    responsible: 'Celebrante & Noivos',
    phase: 'ceremony',
    sourceType: 'CERIMONIAL_SUGGESTION',
    sourceLabel: 'SUGESTÃO DO CERIMONIAL IA',
  });

  // 11. Saída dos Noivos
  const tSaida = getTimeString(50, 'Sugestão: ~50 min após início da cerimônia');
  timeline.push({
    id: 'time-saida-cerimonia',
    time: tSaida.time,
    isTimeDefined: tSaida.isDefined,
    title: 'Cortejo de Saída dos Recém-Casados',
    description: `Saída triunfal dos noivos sob aplausos e condução dos convidados ao espaço de recepção.`,
    responsible: 'Cerimonial & Noivos',
    phase: 'ceremony',
    sourceType: 'CERIMONIAL_SUGGESTION',
    sourceLabel: 'SUGESTÃO DO CERIMONIAL IA',
  });

  // 12. Fotos Protocolares
  const tFotos = getTimeString(60, 'Sugestão: ~1h após início da cerimônia');
  timeline.push({
    id: 'time-fotos-oficiais',
    time: tFotos.time,
    isTimeDefined: tFotos.isDefined,
    title: serviceStatus.fotografia
      ? 'Sessão de Fotos Protocolares com Padrinhos e Pais'
      : 'Fotos Protocolares com Pais e Padrinhos (Serviço de foto não informado)',
    description: serviceStatus.fotografia
      ? `Fotos formais no altar ou espaço cenográfico. Limite sugerido de 20 minutos para permitir aos noivos aproveitarem a recepção.`
      : `Serviço de fotografia não informado pelo cliente. Sugestão: destinar até 20 minutos para fotos com padrinhos e familiares imediatos.`,
    responsible: serviceStatus.fotografia
      ? 'Fotografia Informada & Cerimonial'
      : 'Responsável: A definir',
    phase: 'reception',
    sourceType: 'CERIMONIAL_SUGGESTION',
    sourceLabel: 'SUGESTÃO DO CERIMONIAL IA',
  });

  // 13. ABERTURA DA RECEPÇÃO (DADO INFORMADO PELO CLIENTE se fornecido)
  timeline.push({
    id: 'time-recepcao',
    time: hasReceptionTime ? data.receptionTime : 'A definir (Horário da recepção não informado)',
    isTimeDefined: hasReceptionTime,
    title: 'Abertura da Recepção & Coquetel de Boas-Vindas',
    description: `Abertura oficial do salão de festas e recepção de convidados.`,
    responsible: serviceStatus.buffet
      ? 'Equipe do Buffet Informada & Cerimonial'
      : 'Responsável: A definir',
    phase: 'reception',
    sourceType: hasReceptionTime ? 'CLIENT_DATA' : 'CERIMONIAL_SUGGESTION',
    sourceLabel: hasReceptionTime ? 'DADO INFORMADO PELO CLIENTE' : 'SUGESTÃO DO CERIMONIAL IA',
  });

  // 14. Serviço Gastronômico Principal
  const baseReceptionMin = receptionMin !== null
    ? receptionMin
    : (ceremonyMin !== null ? ceremonyMin + 75 : null);

  const tJantar = baseReceptionMin !== null
    ? { time: minutesToTimeString(baseReceptionMin + 45), isDefined: true }
    : { time: 'A definir (~45 min após início da recepção)', isDefined: false };

  timeline.push({
    id: 'time-jantar',
    time: tJantar.time,
    isTimeDefined: tJantar.isDefined,
    title: serviceStatus.buffet
      ? 'Serviço Gastronômico Principal (Buffet Informado)'
      : 'Momento Gastronômico (Serviço de buffet não informado)',
    description: serviceStatus.buffet
      ? `Serviço do buffet liberado para os convidados. Atenção especial a restrições alimentares informadas pelo cliente (${hasSpecialNeeds ? data.specialNeeds : 'nenhuma restrição cadastrada'}).`
      : `Serviço de buffet não informado pelo cliente. Não presumir contratação; caso haja serviço gastronômico contratado, alinhar horário de abertura com a equipe responsável.`,
    responsible: serviceStatus.buffet
      ? 'Equipe do Buffet Informada'
      : 'Responsável: A definir',
    phase: 'reception',
    sourceType: 'CERIMONIAL_SUGGESTION',
    sourceLabel: 'SUGESTÃO DO CERIMONIAL IA',
  });

  // 15. Dança e Pista
  const tPista = baseReceptionMin !== null
    ? { time: minutesToTimeString(baseReceptionMin + 120), isDefined: true }
    : { time: 'A definir (~2h após início da recepção)', isDefined: false };

  timeline.push({
    id: 'time-pista',
    time: tPista.time,
    isTimeDefined: tPista.isDefined,
    title: serviceStatus.dj || serviceStatus.musicos
      ? 'Primeira Dança dos Noivos & Abertura da Pista'
      : 'Abertura da Pista de Dança (Serviço de DJ/música não informado)',
    description: serviceStatus.dj || serviceStatus.musicos
      ? `Dança do casal, seguida por abertura da pista de dança com a equipe de som informada.`
      : `Serviço de som/DJ não informado pelo cliente. Sugestão: caso haja atração musical contratada, sincronizar abertura da pista com o cerimonial.`,
    responsible: serviceStatus.dj || serviceStatus.musicos
      ? 'DJ / Músicos informados'
      : 'Responsável: A definir',
    phase: 'reception',
    sourceType: 'CERIMONIAL_SUGGESTION',
    sourceLabel: 'SUGESTÃO DO CERIMONIAL IA',
  });

  // 16. Buquê
  const tBuque = baseReceptionMin !== null
    ? { time: minutesToTimeString(baseReceptionMin + 240), isDefined: true }
    : { time: 'A definir (~4h após início da recepção)', isDefined: false };

  timeline.push({
    id: 'time-buque',
    time: tBuque.time,
    isTimeDefined: tBuque.isDefined,
    title: 'Momento do Buquê & Mesa de Doces',
    description: `Momento descontraído da jogada do buquê e liberação da mesa de café e lembrancinhas.`,
    responsible: 'Cerimonial & Noivos',
    phase: 'reception',
    sourceType: 'CERIMONIAL_SUGGESTION',
    sourceLabel: 'SUGESTÃO DO CERIMONIAL IA',
  });

  // 17. Encerramento (DADO INFORMADO PELO CLIENTE se fornecido)
  timeline.push({
    id: 'time-encerramento',
    time: hasEndTime ? data.endTime : 'A definir (Horário de encerramento não informado)',
    isTimeDefined: hasEndTime,
    title: 'Encerramento Musical & Despedida',
    description: `Término da música, guarda dos pertences pessoais dos noivos e recolhimento de presentes.`,
    responsible: 'Cerimonial & Noivos',
    phase: 'post',
    sourceType: hasEndTime ? 'CLIENT_DATA' : 'CERIMONIAL_SUGGESTION',
    sourceLabel: hasEndTime ? 'DADO INFORMADO PELO CLIENTE' : 'SUGESTÃO DO CERIMONIAL IA',
  });

  // 18. Desmontagem
  const tDesmontagem = endMin !== null
    ? { time: minutesToTimeString(endMin + 45), isDefined: true }
    : { time: 'A definir (~45 min após encerramento)', isDefined: false };

  timeline.push({
    id: 'time-desmontagem',
    time: tDesmontagem.time,
    isTimeDefined: tDesmontagem.isDefined,
    title: 'Conferência Final & Início da Desmontagem',
    description: `Conferência de itens junto ao espaço e liberação das equipes informadas para desmontagem técnica.`,
    responsible: hasVendors ? 'Fornecedores Informados & Cerimonial' : 'Responsável: A definir',
    phase: 'post',
    sourceType: 'CERIMONIAL_SUGGESTION',
    sourceLabel: 'SUGESTÃO DO CERIMONIAL IA',
  });

  // VENDORS: STRICT RULE - NEVER INVENT SUPPLIERS
  // Only parse vendors the user actually listed in `contractedVendors`
  const vendorsList: VendorAssignment[] = [];
  if (hasVendors) {
    const vendorItems = data.contractedVendors
      .split(/[,;\n]+/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    vendorItems.forEach((vendorText, idx) => {
      let arrivalTimeSuggestion = 'Sugestão: A definir com fornecedor';
      if (ceremonyMin !== null) {
        const lower = vendorText.toLowerCase();
        if (lower.includes('decor') || lower.includes('flor') || lower.includes('cenograf')) {
          arrivalTimeSuggestion = `Sugestão técnica: ${minutesToTimeString(ceremonyMin - 390)} (~6h30 antes)`;
        } else if (lower.includes('buffet') || lower.includes('gastronom') || lower.includes('bar') || lower.includes('bebida')) {
          arrivalTimeSuggestion = `Sugestão técnica: ${minutesToTimeString(ceremonyMin - 210)} (~3h30 antes)`;
        } else if (lower.includes('foto') || lower.includes('vídeo') || lower.includes('video') || lower.includes('film')) {
          arrivalTimeSuggestion = `Sugestão técnica: ${minutesToTimeString(ceremonyMin - 240)} (~4h antes)`;
        } else if (lower.includes('som') || lower.includes('dj') || lower.includes('banda') || lower.includes('músic') || lower.includes('music')) {
          arrivalTimeSuggestion = `Sugestão técnica: ${minutesToTimeString(ceremonyMin - 150)} (~2h30 antes)`;
        } else {
          arrivalTimeSuggestion = `Sugestão técnica: ${minutesToTimeString(ceremonyMin - 120)} (~2h antes)`;
        }
      }

      vendorsList.push({
        id: `v-user-${idx}`,
        category: 'Fornecedor Contratado',
        vendorName: vendorText,
        arrivalTime: arrivalTimeSuggestion,
        arrivalTimeType: 'CERIMONIAL_SUGGESTION',
        responsibilities: [
          `Execução do serviço contratado conforme escopo alinhado pelo cliente.`,
          `Cumprimento pontual dos horários de montagem, passagem de som e desmontagem.`,
          `Contato prévio com a equipe de cerimonial em caso de necessidade de apoio no local.`,
        ],
        checkpoint: `Vistoria e conferência do cumprimento do serviço no local (${venueDisplayName}).`,
        sourceType: 'CLIENT_DATA',
      });
    });
  }

  // Preparation Checklist - strictly factual
  const prepDateLabel = hasWeddingDate ? formatDatePtBR(data.weddingDate) : 'Data a definir';
  const prepVenueLabel = hasCityAndVenue ? data.cityAndVenue : 'Local a definir';
  const prepGuestsLabel = hasGuestCount ? `${guestCountNum} convidados` : 'Número de convidados a definir';
  const prepStyleLabel = hasStyle ? data.weddingStyle : 'Estilo a definir';

  const preparationChecklist: PreparationChecklistPhase[] = [
    {
      phaseTitle: 'Fase Inicial (12 a 6 meses antes)',
      timelineBadge: 'Planejamento Estrutural',
      items: [
        {
          id: 'prep-1',
          task: `Definição e contrato da data (${prepDateLabel}) e espaço (${prepVenueLabel})`,
          category: 'Local',
          completed: Boolean(hasWeddingDate && hasCityAndVenue),
          sourceType: hasWeddingDate && hasCityAndVenue ? 'CLIENT_DATA' : 'CERIMONIAL_SUGGESTION',
        },
        {
          id: 'prep-2',
          task: serviceStatus.buffet
            ? `Contratação de buffet (${prepGuestsLabel}) [Informado pelo cliente]`
            : `Contratação de buffet / gastronomia (Serviço não informado pelo cliente - Sugestão se aplicável)`,
          category: 'Gastronomia',
          completed: serviceStatus.buffet,
          sourceType: serviceStatus.buffet ? 'CLIENT_DATA' : 'CERIMONIAL_SUGGESTION',
        },
        {
          id: 'prep-3',
          task: serviceStatus.fotografia
            ? 'Contratação de Fotografia e Filmagem [Informado pelo cliente]'
            : 'Contratação de Foto & Vídeo (Serviço não informado pelo cliente - Sugestão se aplicável)',
          category: 'Equipe Base',
          completed: serviceStatus.fotografia,
          sourceType: serviceStatus.fotografia ? 'CLIENT_DATA' : 'CERIMONIAL_SUGGESTION',
        },
        {
          id: 'prep-4',
          task: serviceStatus.decoracao
            ? `Contratação de Decoração e Cenografia: ${prepStyleLabel} [Informado pelo cliente]`
            : `Definição de estilo decorativo e cenografia (Serviço não informado - Sugestão se aplicável)`,
          category: 'Design',
          completed: serviceStatus.decoracao,
          sourceType: serviceStatus.decoracao ? 'CLIENT_DATA' : 'CERIMONIAL_SUGGESTION',
        },
        {
          id: 'prep-5',
          task: 'Criação do site dos noivos e lista de presentes (Sugestão operacional)',
          category: 'Comunicação',
          completed: false,
          sourceType: 'CERIMONIAL_SUGGESTION',
        },
      ],
    },
    {
      phaseTitle: 'Fase Intermediária (5 a 2 meses antes)',
      timelineBadge: 'Detalhes & Provas',
      items: [
        {
          id: 'prep-6',
          task: serviceStatus.buffet
            ? `Degustação e alinhamento do menu do buffet (${hasSpecialNeeds ? `observando: ${data.specialNeeds}` : 'verificar restrições alimentares'})`
            : `Degustação de buffet (Serviço não informado pelo cliente - Sugestão se aplicável)`,
          category: 'Buffet',
          completed: false,
          sourceType: 'CERIMONIAL_SUGGESTION',
        },
        {
          id: 'prep-7',
          task: 'Provas do vestido de noiva, terno e alfaiataria (Sugestão)',
          category: 'Vestuário',
          completed: false,
          sourceType: 'CERIMONIAL_SUGGESTION',
        },
        {
          id: 'prep-8',
          task: 'Envio dos convites oficiais e abertura de confirmação de presença (RSVP)',
          category: 'Convidados',
          completed: false,
          sourceType: 'CERIMONIAL_SUGGESTION',
        },
        {
          id: 'prep-9',
          task: hasVipPeople
            ? `Alinhamento dos padrinhos e cortejo (${data.vipPeople}) [Informado pelo cliente]`
            : 'Alinhamento da lista de padrinhos e cortejo (Lista não informada pelo cliente - a definir)',
          category: 'Cortejo',
          completed: hasVipPeople,
          sourceType: hasVipPeople ? 'CLIENT_DATA' : 'CERIMONIAL_SUGGESTION',
        },
        {
          id: 'prep-10',
          task: serviceStatus.dj || serviceStatus.musicos
            ? 'Escolha da trilha sonora e repertório [Música informada pelo cliente]'
            : 'Definição da trilha sonora da cerimônia e festa (Serviço musical não informado - Sugestão se aplicável)',
          category: 'Música',
          completed: serviceStatus.dj || serviceStatus.musicos,
          sourceType: serviceStatus.dj || serviceStatus.musicos ? 'CLIENT_DATA' : 'CERIMONIAL_SUGGESTION',
        },
      ],
    },
    {
      phaseTitle: 'Reta Final (30 a 7 dias antes)',
      timelineBadge: 'Alinhamentos Cruciais',
      items: [
        {
          id: 'prep-11',
          task: 'Fechamento do número final de presenças confirmadas (RSVP)',
          category: 'Coordenação',
          completed: false,
          sourceType: 'CERIMONIAL_SUGGESTION' as const,
        },
        {
          id: 'prep-12',
          task: `Mapeamento das mesas e assentos reservados (${hasSpecialNeeds ? `prioridades: ${data.specialNeeds}` : 'prioridades familiares'})`,
          category: 'Layout',
          completed: false,
          sourceType: 'CERIMONIAL_SUGGESTION' as const,
        },
        {
          id: 'prep-13',
          task: hasVendors
            ? 'Envio do cronograma operacional para fornecedores contratados informados'
            : 'Envio do cronograma (Fornecedores não informados - Sugestão após contratações)',
          category: 'Produção',
          completed: false,
          sourceType: 'CERIMONIAL_SUGGESTION' as const,
        },
        {
          id: 'prep-14',
          task: 'Reunião final de alinhamento com a equipe de cerimonial',
          category: 'Cerimonial',
          completed: false,
          sourceType: 'CERIMONIAL_SUGGESTION' as const,
        },
        {
          id: 'prep-15',
          task: 'Ensaio presencial ou virtual do cortejo com os noivos',
          category: 'Cerimônia',
          completed: false,
          sourceType: 'CERIMONIAL_SUGGESTION' as const,
        },
      ],
    },
  ];

  // WhatsApp Templates - strictly using factual data with placeholders when missing
  const dateFormattedDisplay = hasWeddingDate ? formatDatePtBR(data.weddingDate) : 'data a definir';
  const ceremonyTimeDisplay = hasCeremonyTime ? data.ceremonyTime : 'horário a definir';
  const venueDisplay = hasCityAndVenue ? data.cityAndVenue : 'local a definir';
  const padrinhosArrivalDisplay = ceremonyMin !== null
    ? minutesToTimeString(ceremonyMin - 45)
    : '45 minutos antes do horário oficial (a definir)';

  const whatsappMessages: WhatsAppTemplate[] = [
    {
      id: 'wpp-noivos-d1',
      title: 'Véspera do Casamento (Para os Noivos)',
      recipientGroup: 'Noivos',
      description: 'Mensagem de alinhamento e tranquilidade no D-1.',
      messageText: `Olá, ${coupleDisplayName}! Amanhã é a realização de um grande momento. Toda a equipe do cerimonial já está com os cronogramas operacionais prontos. Tenham uma boa noite de descanso e contem conosco em cada detalhe amanhã!`,
    },
    {
      id: 'wpp-padrinhos',
      title: 'Guia e Horários dos Padrinhos (D-7)',
      recipientGroup: 'Padrinhos',
      description: 'Orientações de pontualidade e chegada para padrinhos e cortejo.',
      messageText: `Queridos padrinhos de ${coupleDisplayName}! O casamento será no dia ${dateFormattedDisplay}, em ${venueDisplay}. Pedimos a gentileza de chegarem às ${padrinhosArrivalDisplay} para colocação de lapelas, fotos e organização do cortejo. A presença e pontualidade de vocês é essencial!`,
    },
    {
      id: 'wpp-fornecedores-d3',
      title: 'Alinhamento Geral com Fornecedores (D-3)',
      recipientGroup: 'Fornecedores',
      description: 'Confirmação de horários de montagem e pontos de apoio.',
      messageText: `Prezada equipe parceira do casamento de ${coupleDisplayName}! Confirmamos a data do evento para ${dateFormattedDisplay}, em ${venueDisplay}. Início da cerimônia previsto para as ${ceremonyTimeDisplay}. Segue cronograma em anexo para conferência dos horários de montagem e passagem de som.`,
    },
    {
      id: 'wpp-convidados-rsvp',
      title: 'Lembrete de RSVP e Orientações aos Convidados',
      recipientGroup: 'Convidados',
      description: 'Lembrete de confirmação de presença e endereço.',
      messageText: `Olá! O casamento de ${coupleDisplayName} será realizado no dia ${dateFormattedDisplay}, com início às ${ceremonyTimeDisplay}, em ${venueDisplay}.${hasStyle ? ` Estilo sugerido: ${data.weddingStyle}.` : ''} Por favor, confirme sua presença antecipadamente. Contamos com sua presença!`,
    },
  ];

  // Ceremony Script - strictly no invented quantities
  const padrinhosParticipants = hasVipPeople
    ? data.vipPeople
    : 'Cortejo de padrinhos (Quantidade não informada pelo cliente - a definir)';

  const ceremonyScript: CeremonyStep[] = [
    {
      order: 1,
      title: 'Entrada do Noivo',
      participants: 'Noivo acompanhado por mãe ou figura de honra',
      participantsSource: 'CERIMONIAL_SUGGESTION',
      details: 'Posicionamento do noivo no altar à espera dos demais participantes.',
      tip: 'Verificar alinhamento da lapela e respiração antes da entrada.',
    },
    {
      order: 2,
      title: 'Entrada dos Pais dos Noivos',
      participants: 'Pai do Noivo e Mãe da Noiva (ou composição definida pela família)',
      participantsSource: 'CERIMONIAL_SUGGESTION',
      details: 'Posicionamento dos pais em seus respectivos lados no altar.',
    },
    {
      order: 3,
      title: 'Cortejo de Padrinhos e Madrinhas',
      participants: padrinhosParticipants,
      participantsSource: hasVipPeople ? 'CLIENT_DATA' : 'CERIMONIAL_SUGGESTION',
      details: 'Entrada compassada dos casais mantendo espaçamento adequado para visibilidade e fotos.',
      tip: 'Sugestão técnica: manter intervalo de 3 a 4 metros entre cada casal.',
    },
    {
      order: 4,
      title: 'Entrada de Pajens e Crianças de Honra',
      participants: 'Pajens / Damas de honra (conforme definido pelos noivos)',
      participantsSource: 'CERIMONIAL_SUGGESTION',
      details: 'Entrada com plaquinha, floristas ou anúncio da chegada da noiva.',
      tip: 'Sugestão técnica: ter sempre um familiar de apoio próximo ao altar.',
    },
    {
      order: 5,
      title: 'Entrada Triunfal da Noiva',
      participants: 'Noiva acompanhada pelo pai ou acompanhante de honra',
      participantsSource: 'CERIMONIAL_SUGGESTION',
      details: 'Momento solene da entrada e encontro com o noivo no altar.',
    },
    {
      order: 6,
      title: serviceStatus.celebrante ? 'Mensagem do Celebrante e Votos' : 'Mensagem e Votos (Celebrante não informado - a definir)',
      participants: serviceStatus.celebrante
        ? 'Celebrante Informado e Noivos'
        : 'Celebrante (Serviço não informado - a definir) e Noivos',
      participantsSource: serviceStatus.celebrante ? 'CLIENT_DATA' : 'CERIMONIAL_SUGGESTION',
      details: `${data.notes ? `Instrução do cliente: ${data.notes}` : 'Mensagem celebrativa e confirmação do consentimento mútuo.'}`,
    },
    {
      order: 7,
      title: 'Entrada das Alianças e Bênção',
      participants: 'Porta-alianças',
      participantsSource: 'CERIMONIAL_SUGGESTION',
      details: 'Entrega das alianças para a bênção solene e troca dos anéis.',
      tip: 'O cerimonial recolhe o buquê da noiva durante a troca de alianças.',
    },
    {
      order: 8,
      title: 'Assinaturas e Bênção Final',
      participants: 'Noivos, Testemunhas e Celebrante',
      participantsSource: 'CERIMONIAL_SUGGESTION',
      details: 'Assinatura dos livros oficiais / ata civil ou religiosa.',
    },
    {
      order: 9,
      title: 'Cortejo de Saída dos Recém-Casados',
      participants: 'Noivos seguidos pelo cortejo',
      participantsSource: 'CERIMONIAL_SUGGESTION',
      details: 'Saída festiva sob aplausos e condução dos convidados à recepção.',
    },
  ];

  // Contingency Plan - NO MEDICATIONS, FLORALS, TREATMENTS OR SUBSTANCES!
  // No presumption of generator or uncontracted services
  const contingencyPlan: ContingencyPlanItem[] = [
    {
      id: 'cont-1',
      risk: 'Chuva ou Condições Climáticas Adversas',
      severity: 'Alta',
      actionPlan: 'Caso o evento tenha áreas abertas, acionamento do plano B de cobertura ou tenda (se contratado pelo cliente). Condução do altar e mobiliário para área coberta e uso de guarda-chuvas grandes de apoio no desembarque.',
      itemsNeeded: 'Guarda-chuvas de portaria, toalhas para secagem de piso e lona/tenda de cobertura (se contratada pelo cliente).',
    },
    {
      id: 'cont-2',
      risk: 'Atraso de Padrinhos ou Celebrante',
      severity: 'Média',
      actionPlan: serviceStatus.celebrante
        ? 'Contato telefônico imediato com o celebrante e reordenação discreta do cortejo se necessário.'
        : 'Celebrante não informado pelo cliente. Contato telefônico com participantes e reordenação do cortejo para preservar a pontualidade.',
      itemsNeeded: 'Lista telefônica de contatos dos participantes na prancheta do cerimonial.',
    },
    {
      id: 'cont-3',
      risk: 'Interrupção de Energia ou Falha de Áudio',
      severity: 'Alta',
      actionPlan: serviceStatus.gerador
        ? 'Acionamento do gerador contratado/informado e verificação de canais de áudio de suporte.'
        : 'Serviço de gerador não informado pelo cliente. Sugestão: verificar se o espaço possui gerador próprio ou luzes de emergência recarregáveis para iluminação essencial.',
      itemsNeeded: serviceStatus.gerador
        ? 'Gerador informado e testado previamente.'
        : 'Iluminação de emergência portátil, lanternas e verificação prévia do quadro de disjuntores do local.',
    },
    {
      id: 'cont-4',
      risk: 'Avaria em Traje, Zíper, Botão ou Barra de Vestido',
      severity: 'Preventiva',
      actionPlan: 'Ação rápida com kit operacional de costura da cerimonialista: alfinetes de segurança, linha reforçada, agulhas e fita dupla face para tecidos.',
      itemsNeeded: 'Maleta SOS operacional (kit costura, tesoura, fita para tecidos, alfinetes de segurança).',
    },
    {
      id: 'cont-5',
      risk: 'Tensão Emocional ou Nervosismo Antes da Entrada',
      severity: 'Preventiva',
      actionPlan: 'Direcionamento a ambiente privativo e ventilado, oferecimento de água mineral fresca, uso de leque e pausa de 5 a 10 minutos com respiração pausada orientada pelo cerimonial.',
      itemsNeeded: 'Ambiente arejado, copos com água fresca, leque manual e lenços de papel.',
    },
  ];

  // Day D Checklist - NO MEDICATIONS! Only operational items
  const dayDChecklist = [
    { id: 'dd-1', task: 'Conferência da Maleta SOS operacional (agulhas, linhas, tesoura, alfinetes de segurança, fita dupla face para tecidos, lenços de papel)', done: true, area: 'Maleta SOS' as const },
    { id: 'dd-2', task: 'Vistoria da passadeira, altar e alinhamento das cadeiras da cerimônia', done: false, area: 'Cerimônia' as const },
    { id: 'dd-3', task: 'Checagem da climatização, iluminação e reposição nos toaletes', done: false, area: 'Coordenação' as const },
    { id: 'dd-4', task: serviceStatus.buffet ? 'Conferência do estoque e temperatura de bebidas recebidas junto ao buffet informado' : 'Conferência de bebidas recebidas (se aplicável)', done: false, area: 'Recepção' as const },
    { id: 'dd-5', task: 'Guarda segura das alianças e caneta oficial para assinaturas da ata', done: false, area: 'Cerimônia' as const },
    { id: 'dd-6', task: 'Conferência da mesa de doces e lembrancinhas conforme orientações do cliente', done: false, area: 'Recepção' as const },
    { id: 'dd-7', task: 'Entrega e fixação das flores de lapela para noivo, pais e padrinhos', done: false, area: 'Cerimônia' as const },
    { id: 'dd-8', task: 'Acompanhamento do noivo na chegada e recepção da noiva no carro', done: false, area: 'Coordenação' as const },
  ];

  // Post Event Checklist - STRICT RULE: When vendor not informed, responsible is 'Responsável: A definir'
  const postEventChecklist = [
    {
      id: 'pe-1',
      task: 'Recolhimento dos pertences pessoais dos noivos e presentes recebidos na festa',
      done: false,
      responsible: 'Responsável designado pela família / Cerimonial',
      deadline: 'Final do evento',
    },
    {
      id: 'pe-2',
      task: 'Conferência de eventuais quebras ou avarias com a gerência do espaço',
      done: false,
      responsible: hasCityAndVenue ? 'Gerência do espaço informado & Cerimonial' : 'Responsável: A definir',
      deadline: 'Encerramento',
    },
    {
      id: 'pe-3',
      task: 'Embalagem e entrega de sobras de bolo, doces e garrafas abertas para a família',
      done: false,
      responsible: serviceStatus.buffet ? 'Buffet informado & Cerimonial' : 'Responsável: A definir',
      deadline: 'Final da festa',
    },
    {
      id: 'pe-4',
      task: 'Devolução de trajes alugados (conforme regras e prazos das lojas)',
      done: false,
      responsible: 'Noivos / Família',
      deadline: 'D+1 ou D+2 dias',
    },
    {
      id: 'pe-5',
      task: 'Acompanhamento dos prazos de envio de prévias de fotos e filmagem',
      done: false,
      responsible: serviceStatus.fotografia ? 'Fotografia informada & Cerimonial' : 'Responsável: A definir',
      deadline: 'Conforme contrato',
    },
    {
      id: 'pe-6',
      task: 'Mensagem formal de agradecimento e envio de pesquisa de satisfação',
      done: false,
      responsible: 'Cerimonial IA',
      deadline: 'D+3 dias',
    },
  ];

  return {
    summary: {
      coupleNames: hasCoupleNames ? data.coupleNames : 'Não informado',
      hasCoupleNames,
      weddingDateRaw: data.weddingDate,
      weddingDateFormatted: formatDatePtBR(data.weddingDate),
      daysUntil: daysUntilObj.days,
      daysUntilLabel: daysUntilObj.label,
      daysUntilStatus: daysUntilObj.status,
      isPastDate: daysUntilObj.isPast,
      cityAndVenue: hasCityAndVenue ? data.cityAndVenue : 'Não informado',
      hasCityAndVenue,
      guestCount: guestCountNum,
      guestCountLabel: hasGuestCount ? `${guestCountNum} convidados` : 'Não informado',
      ceremonyTime: hasCeremonyTime ? data.ceremonyTime : 'A definir',
      hasCeremonyTime,
      receptionTime: hasReceptionTime ? data.receptionTime : 'A definir',
      hasReceptionTime,
      endTime: hasEndTime ? data.endTime : 'A definir',
      hasEndTime,
      style: hasStyle ? data.weddingStyle : 'Não informado',
      hasStyle,
      totalHours,
      totalHoursLabel,
      estimatedStaff,
      estimatedStaffLabel,
    },
    pendingInformation,
    servicesOverview,
    preparationChecklist,
    timeline,
    vendors: vendorsList,
    whatsappMessages,
    ceremonyScript,
    contingencyPlan,
    dayDChecklist,
    postEventChecklist,
  };
}

export function formatPlanAsPlainText(plan: GeneratedPlan, formData: WeddingFormData): string {
  const s = plan.summary;
  let text = `======================================================
CERIMONIAL IA — ASSISTENTE DE PRÉ-EVENTO
PLANEJAMENTO COMPLETO DE CASAMENTO
======================================================
Noivos: ${s.coupleNames} [${s.hasCoupleNames ? 'DADO INFORMADO PELO CLIENTE' : 'NÃO INFORMADO'}]
Data: ${s.weddingDateFormatted} (${s.daysUntilLabel}) [${s.weddingDateRaw ? 'DADO INFORMADO PELO CLIENTE' : 'NÃO INFORMADA'}]
Local: ${s.cityAndVenue} [${s.hasCityAndVenue ? 'DADO INFORMADO PELO CLIENTE' : 'NÃO INFORMADO'}]
Convidados: ${s.guestCountLabel} [${s.guestCount !== null ? 'DADO INFORMADO PELO CLIENTE' : 'NÃO INFORMADO'}]
Horários:
 - Cerimônia: ${s.ceremonyTime} [${s.hasCeremonyTime ? 'DADO INFORMADO PELO CLIENTE' : 'A DEFINIR'}]
 - Recepção: ${s.receptionTime} [${s.hasReceptionTime ? 'DADO INFORMADO PELO CLIENTE' : 'A DEFINIR'}]
 - Encerramento: ${s.endTime} [${s.hasEndTime ? 'DADO INFORMADO PELO CLIENTE' : 'A DEFINIR'}]
Estilo: ${s.style} [${s.hasStyle ? 'DADO INFORMADO PELO CLIENTE' : 'NÃO INFORMADO'}]
Dimensionamento sugerido de staff: ${s.estimatedStaffLabel} [SUGESTÃO DO CERIMONIAL IA]

`;

  if (s.isPastDate) {
    text += `[ATENÇÃO: A data deste casamento está no passado (${s.daysUntilLabel}). Planejamento com finalidade de registro ou modelo histórico.]\n\n`;
  }

  if (plan.pendingInformation.length > 0) {
    text += `------------------------------------------------------
INFORMAÇÕES PENDENTES (A DEFINIR PELO CLIENTE)
------------------------------------------------------
`;
    plan.pendingInformation.forEach((p) => {
      text += `* ${p.label}: ${p.description}
  Impacto: ${p.impact}
  Recomendação: ${p.recommendation}\n\n`;
    });
  }

  text += `------------------------------------------------------
1. STATUS DOS SERVIÇOS (CONTRATADO VS. NÃO INFORMADO)
------------------------------------------------------
`;
  plan.servicesOverview.forEach((srv) => {
    text += `* ${srv.serviceName}: [${srv.statusLabel}]
  ${srv.details}\n`;
  });
  text += `\n`;

  text += `------------------------------------------------------
2. DADOS DE BRIEFING INFORMADOS PELO CLIENTE
------------------------------------------------------
Fornecedores Contratados:
${formData.contractedVendors ? formData.contractedVendors : 'Não informado pelo cliente'}

Pessoas Importantes e Padrinhos:
${formData.vipPeople ? formData.vipPeople : 'Não informado pelo cliente'}

Necessidades Especiais:
${formData.specialNeeds ? formData.specialNeeds : 'Nenhuma restrição ou necessidade informada'}

Observações do Cliente:
${formData.notes ? formData.notes : 'Nenhuma observação informada'}

------------------------------------------------------
3. CRONOGRAMA OPERACIONAL MINUTO A MINUTO (DIA D)
(Diferenciação clara entre dados do cliente e sugestões)
------------------------------------------------------
`;

  plan.timeline.forEach((item) => {
    text += `[${item.time}] ${item.title.toUpperCase()}
Origem: [${item.sourceLabel}]
${item.responsible.startsWith('Responsável:') ? item.responsible : `Responsável: ${item.responsible}`}
${item.description}
\n`;
  });

  text += `------------------------------------------------------
4. ROTEIRO BÁSICO DA CERIMÔNIA
------------------------------------------------------
`;

  plan.ceremonyScript.forEach((step) => {
    text += `${step.order}. ${step.title}
Participantes: ${step.participants} [${step.participantsSource === 'CLIENT_DATA' ? 'DADO INFORMADO PELO CLIENTE' : 'SUGESTÃO DO CERIMONIAL IA'}]
Detalhes: ${step.details}
${step.tip ? `Dica do Cerimonial: ${step.tip}` : ''}
\n`;
  });

  text += `------------------------------------------------------
5. FORNECEDORES & RESPONSABILIDADES
------------------------------------------------------
`;

  if (plan.vendors.length === 0) {
    text += `Nenhum fornecedor informado pelo cliente no briefing.\n\n`;
  } else {
    plan.vendors.forEach((v) => {
      text += `Fornecedor: ${v.vendorName} [DADO INFORMADO PELO CLIENTE]
Horário de Chegada: ${v.arrivalTime} [SUGESTÃO DO CERIMONIAL IA]
Checkpoint: ${v.checkpoint}
Responsabilidades:
${v.responsibilities.map((r) => ` - ${r}`).join('\n')}
\n`;
    });
  }

  return text;
}
