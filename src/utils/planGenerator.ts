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
  CerimonialSuggestionItem,
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

export const PEDRO_MARIA_TEST_DATA: WeddingFormData = {
  coupleNames: 'Pedro e Maria',
  weddingDate: '2027-02-04',
  cityAndVenue: '',
  guestCount: 50,
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

  // Análise detalhada do briefing para verificar o que foi expressamente informado
  const allBriefingText = `${data.contractedVendors || ''} ${data.vipPeople || ''} ${data.notes || ''}`.toLowerCase();
  const checkMention = (keywords: string[]): boolean => {
    return keywords.some((kw) => allBriefingText.includes(kw));
  };

  const hasInformedPadrinhos = Boolean(hasVipPeople && checkMention(['padrinho', 'padrinhos', 'madrinha', 'madrinhas', 'casais', 'cortejo']));
  const hasInformedPais = checkMention(['pais', 'pai', 'mãe', 'mae']);
  const hasInformedPajens = checkMention(['pajem', 'pajens', 'dama', 'damas', 'florista', 'criança', 'crianca', 'crianças']);
  const hasInformedAliancas = checkMention(['aliança', 'alianca', 'alianças', 'aliancas', 'porta-aliança', 'porta aliança']);
  const hasInformedAssinaturas = checkMention(['assinatura', 'assinaturas', 'ata', 'testemunha', 'testemunhas', 'livro']);
  const hasInformedBuque = checkMention(['buquê', 'buque']);
  const hasInformedBoloDoces = checkMention(['bolo', 'doce', 'doces', 'mesa de doce', 'mesa de doces']);

  // Build Day Timeline - strictly separating CLIENT_DATA from CERIMONIAL_SUGGESTION
  // STRICT RULE: momentos não informados pelo cliente NÃO entram como fatos confirmados do cronograma
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

  // 1. Abertura do Espaço & Vistoria Inicial
  const tAbertura = getTimeString(-390, 'Sugestão: ~6h30 antes da cerimônia');
  timeline.push({
    id: 'time-abertura-espaco',
    time: tAbertura.time,
    isTimeDefined: tAbertura.isDefined,
    title: 'Abertura do Espaço & Vistoria Inicial das Instalações',
    description: `Abertura das portas em ${venueDisplayName}. Vistoria de iluminação, pontos de energia, banheiros e climatização.`,
    responsible: hasCityAndVenue ? 'Administração do Espaço & Cerimonial' : 'Responsável: A definir',
    phase: 'pre',
    sourceType: 'CERIMONIAL_SUGGESTION',
    sourceLabel: 'SUGESTÃO',
  });

  // Se o cliente informou decoração
  if (serviceStatus.decoracao) {
    timeline.push({
      id: 'time-decoracao',
      time: getTimeString(-360, 'Sugestão: ~6h antes da cerimônia').time,
      isTimeDefined: ceremonyMin !== null,
      title: 'Montagem da Decoração & Cenografia (Informada)',
      description: `Início da montagem floral e cenográfica pela equipe de decoração informada pelo cliente em ${venueDisplayName}.`,
      responsible: 'Equipe de Decoração Informada & Cerimonial',
      phase: 'pre',
      sourceType: 'CERIMONIAL_SUGGESTION',
      sourceLabel: 'SUGESTÃO',
    });
  }

  // Se o cliente informou buffet
  if (serviceStatus.buffet) {
    timeline.push({
      id: 'time-buffet-chegada',
      time: getTimeString(-210, 'Sugestão: ~3h30 antes da cerimônia').time,
      isTimeDefined: ceremonyMin !== null,
      title: 'Chegada da Equipe de Buffet & Mise-en-place (Informado)',
      description: `Montagem de louças, mise-en-place das mesas e refrigeração de bebidas pela equipe de gastronomia informada.`,
      responsible: 'Equipe do Buffet Informada',
      phase: 'pre',
      sourceType: 'CERIMONIAL_SUGGESTION',
      sourceLabel: 'SUGESTÃO',
    });
  }

  // Se o cliente informou DJ ou som
  if (serviceStatus.dj || serviceStatus.musicos) {
    timeline.push({
      id: 'time-som-chegada',
      time: getTimeString(-150, 'Sugestão: ~2h30 antes da cerimônia').time,
      isTimeDefined: ceremonyMin !== null,
      title: 'Chegada da Equipe de Som e Passagem de Áudio (Informada)',
      description: `Passagem de som e teste de microfones da cerimônia e recepção com os profissionais informados pelo cliente.`,
      responsible: 'DJ / Músicos Informados',
      phase: 'pre',
      sourceType: 'CERIMONIAL_SUGGESTION',
      sourceLabel: 'SUGESTÃO',
    });
  }

  // Se o cliente informou fotografia
  if (serviceStatus.fotografia) {
    timeline.push({
      id: 'time-foto-pre',
      time: getTimeString(-120, 'Sugestão: ~2h antes da cerimônia').time,
      isTimeDefined: ceremonyMin !== null,
      title: 'Início da Cobertura de Foto & Filme no Local (Informada)',
      description: `Registros cenográficos do espaço decorado antes da entrada de convidados com a equipe de foto informada.`,
      responsible: 'Equipe de Foto & Filme Informada',
      phase: 'pre',
      sourceType: 'CERIMONIAL_SUGGESTION',
      sourceLabel: 'SUGESTÃO',
    });
  }

  // Chegada do Cerimonial
  const tCerimonial = getTimeString(-120, 'Sugestão: ~2h antes da cerimônia');
  timeline.push({
    id: 'time-cerimonial-chegada',
    time: tCerimonial.time,
    isTimeDefined: tCerimonial.isDefined,
    title: 'Chegada da Equipe de Cerimonial no Local',
    description: `Conferência do checklist operacional do Dia D, checagem dos postos de apoio e alinhamento da recepção.`,
    responsible: 'Coordenação do Cerimonial',
    phase: 'pre',
    sourceType: 'CERIMONIAL_SUGGESTION',
    sourceLabel: 'SUGESTÃO',
  });

  // Chegada dos Noivos
  const tNoivos = getTimeString(-60, 'Sugestão: ~1h antes da cerimônia');
  timeline.push({
    id: 'time-noivos-chegada',
    time: tNoivos.time,
    isTimeDefined: tNoivos.isDefined,
    title: 'Chegada dos Noivos ao Local do Evento',
    description: `Recepção dos noivos ${coupleDisplayName} pela coordenação do cerimonial e direcionamento às salas de apoio.`,
    responsible: 'Coordenação do Cerimonial & Noivos',
    phase: 'pre',
    sourceType: 'CERIMONIAL_SUGGESTION',
    sourceLabel: 'SUGESTÃO',
  });

  // Se o cliente informou padrinhos
  if (hasInformedPadrinhos) {
    timeline.push({
      id: 'time-padrinhos-chegada',
      time: getTimeString(-45, 'Sugestão: ~45 min antes da cerimônia').time,
      isTimeDefined: ceremonyMin !== null,
      title: 'Chegada dos Padrinhos e Madrinhas (Informados)',
      description: `Recepção do cortejo informado pelo cliente (${data.vipPeople}), colocação de lapelas e alinhamento de ordem.`,
      responsible: 'Cerimonial & Padrinhos Informados',
      phase: 'pre',
      sourceType: 'CERIMONIAL_SUGGESTION',
      sourceLabel: 'SUGESTÃO',
    });
  }

  // INÍCIO DA CERIMÔNIA
  timeline.push({
    id: 'time-cerimonia',
    time: hasCeremonyTime ? data.ceremonyTime : 'A definir (Horário da cerimônia não informado)',
    isTimeDefined: hasCeremonyTime,
    title: 'Início Oficial da Cerimônia de Casamento',
    description: `Início solene da celebração de casamento de ${coupleDisplayName}. Fechamento de portas e cortejo de entrada.`,
    responsible: serviceStatus.celebrante
      ? 'Celebrante Informado, Cerimonial & Noivos'
      : 'Cerimonial & Noivos (Celebrante não informado - a definir)',
    phase: 'ceremony',
    sourceType: hasCeremonyTime ? 'CLIENT_DATA' : 'CERIMONIAL_SUGGESTION',
    sourceLabel: hasCeremonyTime ? 'DADO INFORMADO PELO CLIENTE' : 'SUGESTÃO',
  });

  // Votos dos Noivos
  const tVotos = getTimeString(30, 'Sugestão: ~30 min após início da cerimônia');
  timeline.push({
    id: 'time-votos',
    time: tVotos.time,
    isTimeDefined: tVotos.isDefined,
    title: 'Votos Matrimoniais dos Noivos',
    description: `Momento solene da manifestação dos votos e confirmação da união de ${coupleDisplayName}.`,
    responsible: 'Noivos',
    phase: 'ceremony',
    sourceType: 'CERIMONIAL_SUGGESTION',
    sourceLabel: 'SUGESTÃO',
  });

  // Se o cliente informou alianças
  if (hasInformedAliancas) {
    timeline.push({
      id: 'time-aliancas-rito',
      time: getTimeString(40, 'Sugestão: ~40 min após início da cerimônia').time,
      isTimeDefined: ceremonyMin !== null,
      title: 'Troca Solene das Alianças (Rito Informado)',
      description: `Entrada das alianças e bênção dos anéis conforme informado pelo cliente no briefing.`,
      responsible: 'Celebrante & Noivos',
      phase: 'ceremony',
      sourceType: 'CERIMONIAL_SUGGESTION',
      sourceLabel: 'SUGESTÃO',
    });
  }

  // Saída dos Noivos
  const tSaida = getTimeString(50, 'Sugestão: ~50 min após início da cerimônia');
  timeline.push({
    id: 'time-saida-cerimonia',
    time: tSaida.time,
    isTimeDefined: tSaida.isDefined,
    title: 'Saída Solene dos Recém-Casados',
    description: `Término da cerimônia e saída de ${coupleDisplayName} sob aplausos dos convidados.`,
    responsible: 'Noivos & Cerimonial',
    phase: 'ceremony',
    sourceType: 'CERIMONIAL_SUGGESTION',
    sourceLabel: 'SUGESTÃO',
  });

  // Se o cliente informou fotografia
  if (serviceStatus.fotografia) {
    timeline.push({
      id: 'time-fotos-oficiais',
      time: getTimeString(60, 'Sugestão: ~1h após início da cerimônia').time,
      isTimeDefined: ceremonyMin !== null,
      title: 'Sessão de Fotos Protocolares (Fotografia Informada)',
      description: `Fotos formais dos noivos com familiares e cortejo junto à equipe de fotografia informada.`,
      responsible: 'Fotografia Informada & Cerimonial',
      phase: 'reception',
      sourceType: 'CERIMONIAL_SUGGESTION',
      sourceLabel: 'SUGESTÃO',
    });
  }

  // Abertura da Recepção / Confraternização
  timeline.push({
    id: 'time-recepcao',
    time: hasReceptionTime ? data.receptionTime : 'A definir (Horário da recepção não informado)',
    isTimeDefined: hasReceptionTime,
    title: 'Início da Recepção & Confraternização',
    description: `Acolhimento dos convidados no espaço de festa. Serviços gastronômicos e atrações a definir (não informados pelo cliente).`,
    responsible: serviceStatus.buffet
      ? 'Equipe do Buffet Informada & Cerimonial'
      : 'Responsável: A definir',
    phase: 'reception',
    sourceType: hasReceptionTime ? 'CLIENT_DATA' : 'CERIMONIAL_SUGGESTION',
    sourceLabel: hasReceptionTime ? 'DADO INFORMADO PELO CLIENTE' : 'SUGESTÃO',
  });

  // Se o cliente informou buffet
  if (serviceStatus.buffet) {
    const baseRecMin = receptionMin !== null ? receptionMin : (ceremonyMin !== null ? ceremonyMin + 75 : null);
    timeline.push({
      id: 'time-buffet-servico',
      time: baseRecMin !== null ? minutesToTimeString(baseRecMin + 45) : 'A definir (~45 min após início da recepção)',
      isTimeDefined: baseRecMin !== null,
      title: 'Serviço Gastronômico Principal (Buffet Informado)',
      description: `Abertura do serviço de alimentação aos convidados pela equipe informada. Atenção a restrições (${hasSpecialNeeds ? data.specialNeeds : 'nenhuma restrição informada'}).`,
      responsible: 'Equipe do Buffet Informada',
      phase: 'reception',
      sourceType: 'CERIMONIAL_SUGGESTION',
      sourceLabel: 'SUGESTÃO',
    });
  }

  // Se o cliente informou bolo / doces
  if (hasInformedBoloDoces) {
    const baseRecMin = receptionMin !== null ? receptionMin : (ceremonyMin !== null ? ceremonyMin + 75 : null);
    timeline.push({
      id: 'time-bolo-doces',
      time: baseRecMin !== null ? minutesToTimeString(baseRecMin + 100) : 'A definir (~1h40 após início da recepção)',
      isTimeDefined: baseRecMin !== null,
      title: 'Corte do Bolo & Liberação da Mesa de Doces (Informado)',
      description: `Momento fotográfico do casal junto ao bolo e liberação aos convidados conforme informado pelo cliente.`,
      responsible: 'Cerimonial & Noivos',
      phase: 'reception',
      sourceType: 'CERIMONIAL_SUGGESTION',
      sourceLabel: 'SUGESTÃO',
    });
  }

  // Se o cliente informou DJ ou música para pista
  if (serviceStatus.dj || serviceStatus.musicos) {
    const baseRecMin = receptionMin !== null ? receptionMin : (ceremonyMin !== null ? ceremonyMin + 75 : null);
    timeline.push({
      id: 'time-pista-danca',
      time: baseRecMin !== null ? minutesToTimeString(baseRecMin + 120) : 'A definir (~2h após início da recepção)',
      isTimeDefined: baseRecMin !== null,
      title: 'Primeira Dança dos Noivos & Abertura da Pista (Música Informada)',
      description: `Dança do casal e abertura oficial da pista com os profissionais de som informados pelo cliente.`,
      responsible: 'DJ / Músicos Informados & Cerimonial',
      phase: 'reception',
      sourceType: 'CERIMONIAL_SUGGESTION',
      sourceLabel: 'SUGESTÃO',
    });
  }

  // Se o cliente informou buquê
  if (hasInformedBuque) {
    const baseRecMin = receptionMin !== null ? receptionMin : (ceremonyMin !== null ? ceremonyMin + 75 : null);
    timeline.push({
      id: 'time-buque-momento',
      time: baseRecMin !== null ? minutesToTimeString(baseRecMin + 210) : 'A definir (~3h30 após início da recepção)',
      isTimeDefined: baseRecMin !== null,
      title: 'Momento da Jogada do Buquê (Informado)',
      description: `Atração da jogada do buquê aos convidados conforme informado pelo cliente no briefing.`,
      responsible: 'Cerimonial & Noiva',
      phase: 'reception',
      sourceType: 'CERIMONIAL_SUGGESTION',
      sourceLabel: 'SUGESTÃO',
    });
  }

  // Encerramento do Evento
  timeline.push({
    id: 'time-encerramento',
    time: hasEndTime ? data.endTime : 'A definir (Horário de encerramento não informado)',
    isTimeDefined: hasEndTime,
    title: 'Encerramento do Evento & Despedida',
    description: `Término da celebração, despedida dos convidados e recolhimento dos pertences pessoais dos noivos.`,
    responsible: 'Cerimonial & Noivos',
    phase: 'post',
    sourceType: hasEndTime ? 'CLIENT_DATA' : 'CERIMONIAL_SUGGESTION',
    sourceLabel: hasEndTime ? 'DADO INFORMADO PELO CLIENTE' : 'SUGESTÃO',
  });

  // Vistoria Final e Fechamento do Local
  const tFechamento = endMin !== null
    ? { time: minutesToTimeString(endMin + 45), isDefined: true }
    : { time: 'A definir (~45 min após encerramento)', isDefined: false };
  timeline.push({
    id: 'time-fechamento',
    time: tFechamento.time,
    isTimeDefined: tFechamento.isDefined,
    title: 'Vistoria Final & Fechamento do Local',
    description: `Conferência do espaço físico com a administração do local e entrega das chaves.`,
    responsible: hasCityAndVenue ? 'Administração do Espaço & Cerimonial' : 'Responsável: A definir',
    phase: 'post',
    sourceType: 'CERIMONIAL_SUGGESTION',
    sourceLabel: 'SUGESTÃO',
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

  // Verificação expressa de acompanhantes nas entradas informados no briefing
  const vipLower = (data.vipPeople || '').toLowerCase();
  const notesLower = (data.notes || '').toLowerCase();
  const entryBriefingText = `${vipLower} ${notesLower}`;

  // Entrada do Noivo: se o cliente mencionou expressamente quem entra com o noivo
  const groomHasCustomAcompanhante =
    entryBriefingText.includes('mãe do noivo') ||
    entryBriefingText.includes('mae do noivo') ||
    entryBriefingText.includes('pai do noivo') ||
    entryBriefingText.includes('noivo entra com') ||
    entryBriefingText.includes('acompanhante do noivo');

  const groomParticipants: string = groomHasCustomAcompanhante
    ? 'Noivo acompanhado conforme informado no briefing'
    : 'Não informado';
  const groomParticipantsSource: 'CLIENT_DATA' | 'NOT_INFORMED' = groomHasCustomAcompanhante
    ? 'CLIENT_DATA'
    : 'NOT_INFORMED';

  // Entrada da Noiva: se o cliente mencionou expressamente quem entra com a noiva
  const brideHasCustomAcompanhante =
    entryBriefingText.includes('pai da noiva') ||
    entryBriefingText.includes('mãe da noiva') ||
    entryBriefingText.includes('mae da noiva') ||
    entryBriefingText.includes('noiva entra com') ||
    entryBriefingText.includes('acompanhante da noiva');

  const brideParticipants: string = brideHasCustomAcompanhante
    ? 'Noiva acompanhada conforme informado no briefing'
    : 'Não informado';
  const brideParticipantsSource: 'CLIENT_DATA' | 'NOT_INFORMED' = brideHasCustomAcompanhante
    ? 'CLIENT_DATA'
    : 'NOT_INFORMED';

  // Ceremony Script - strictly confirmed moments only; unconfirmed items go to cerimonialSuggestions
  const ceremonyScript: CeremonyStep[] = [];
  let scriptOrder = 1;

  // 1. Entrada do Noivo
  ceremonyScript.push({
    order: scriptOrder++,
    title: 'Entrada do Noivo',
    participants: groomParticipants,
    participantsSource: groomParticipantsSource,
    details: groomParticipantsSource === 'CLIENT_DATA'
      ? 'Entrada solene do noivo ao altar acompanhado conforme especificado no briefing.'
      : 'Entrada solene do noivo ao altar. O cliente não informou acompanhante para a entrada (ex: mãe, pai ou entrada solo). Acompanhamento ou entrada solo a definir pelo casal.',
    tip: 'O cerimonial aguarda definição do casal sobre o acompanhamento para alinhar o cortejo.',
    isConfirmedByClient: true,
  });

  // 2. Pais dos noivos (SOMENTE se informado pelo cliente)
  if (hasInformedPais) {
    ceremonyScript.push({
      order: scriptOrder++,
      title: 'Entrada dos Pais dos Noivos',
      participants: data.vipPeople || 'Pais dos noivos conforme informado',
      participantsSource: 'CLIENT_DATA',
      details: 'Posicionamento solene dos pais em seus respectivos lados no altar.',
      isConfirmedByClient: true,
    });
  }

  // 3. Cortejo de Padrinhos (SOMENTE se informado pelo cliente)
  if (hasInformedPadrinhos) {
    ceremonyScript.push({
      order: scriptOrder++,
      title: 'Cortejo de Padrinhos e Madrinhas',
      participants: data.vipPeople,
      participantsSource: 'CLIENT_DATA',
      details: 'Entrada compassada dos casais de padrinhos informados pelo cliente no briefing.',
      tip: 'Sugestão técnica: manter intervalo de 3 a 4 metros entre cada casal.',
      isConfirmedByClient: true,
    });
  }

  // 4. Pajens e Floristas (SOMENTE se informado pelo cliente)
  if (hasInformedPajens) {
    ceremonyScript.push({
      order: scriptOrder++,
      title: 'Entrada de Pajens e Crianças de Honra',
      participants: 'Crianças de honra conforme informado pelo cliente',
      participantsSource: 'CLIENT_DATA',
      details: 'Entrada das crianças de honra informadas pelo cliente no briefing.',
      isConfirmedByClient: true,
    });
  }

  // 5. Entrada da Noiva
  ceremonyScript.push({
    order: scriptOrder++,
    title: 'Entrada da Noiva',
    participants: brideParticipants,
    participantsSource: brideParticipantsSource,
    details: brideParticipantsSource === 'CLIENT_DATA'
      ? 'Entrada solene da noiva acompanhada conforme especificado no briefing.'
      : 'Entrada solene da noiva ao local da celebração. O cliente não informou acompanhante para a entrada (ex: pai, mãe ou entrada solo). Acompanhamento ou entrada solo a definir pelo casal.',
    tip: 'O cerimonial aguarda definição do casal sobre o acompanhamento para orientar a porta de entrada.',
    isConfirmedByClient: true,
  });

  // 6. Celebração e Votos dos Noivos
  ceremonyScript.push({
    order: scriptOrder++,
    title: serviceStatus.celebrante ? 'Mensagem do Celebrante & Votos dos Noivos' : 'Celebração da União & Votos dos Noivos',
    participants: serviceStatus.celebrante
      ? 'Celebrante Informado e Noivos'
      : 'Noivos (Celebrante: Não informado)',
    participantsSource: serviceStatus.celebrante ? 'CLIENT_DATA' : 'NOT_INFORMED',
    details: serviceStatus.celebrante
      ? 'Mensagem matrimonial conduzida pelo celebrante informado e leitura dos votos dos noivos.'
      : 'Momento solene da manifestação dos votos do casal. O celebrante ou autoridade condutora não foi informado pelo cliente.',
    isConfirmedByClient: true,
  });

  // 7. Alianças (SOMENTE se informado pelo cliente)
  if (hasInformedAliancas) {
    ceremonyScript.push({
      order: scriptOrder++,
      title: 'Entrada das Alianças & Bênção dos Anéis',
      participants: 'Porta-alianças informado pelo cliente',
      participantsSource: 'CLIENT_DATA',
      details: 'Entrega solene das alianças para bênção e troca dos anéis entre os noivos.',
      isConfirmedByClient: true,
    });
  }

  // 8. Assinaturas (SOMENTE se informado pelo cliente)
  if (hasInformedAssinaturas) {
    ceremonyScript.push({
      order: scriptOrder++,
      title: 'Assinaturas da Ata & Testemunhas',
      participants: 'Noivos, Testemunhas e Celebrante',
      participantsSource: 'CLIENT_DATA',
      details: 'Assinatura dos livros oficiais ou ata solene de casamento.',
      isConfirmedByClient: true,
    });
  }

  // 9. Saída dos Recém-Casados
  ceremonyScript.push({
    order: scriptOrder++,
    title: 'Saída Solene dos Recém-Casados',
    participants: hasInformedPadrinhos
      ? 'Noivos seguidos pelo cortejo informado'
      : 'Noivos (Cortejo de saída: Não informado)',
    participantsSource: hasInformedPadrinhos ? 'CLIENT_DATA' : 'NOT_INFORMED',
    details: 'Saída solene dos recém-casados sob aplausos dos convidados ao término da celebração.',
    isConfirmedByClient: true,
  });

  // SEPARATED SECTION: "Sugestões do Cerimonial IA"
  // Itens, momentos e serviços não informados pelo cliente são listados EXCLUSIVAMENTE aqui como sugestões
  const cerimonialSuggestions: CerimonialSuggestionItem[] = [];

  if (!hasInformedAliancas) {
    cerimonialSuggestions.push({
      id: 'sug-aliancas',
      title: 'Rito de Entrada das Alianças & Bênção dos Anéis',
      category: 'Cerimônia & Cortejo',
      categoryLabel: 'Cerimônia & Cortejo',
      statusLabel: 'SUGESTÃO DO CERIMONIAL IA',
      description: 'Momento não informado pelo cliente no briefing. A presença de daminhas, pajens ou porta-alianças não está confirmada.',
      recommendation: 'Caso o casal planeje o momento da bênção e troca de alianças, definir previamente quem conduzirá as alianças (porta-alianças, pajem, avós ou noivo no bolso) e a música de fundo.',
      clientMention: 'Momento não informado pelo cliente no briefing',
      suggestion: 'Definir previamente quem conduzirá as alianças e a trilha sonora.',
      impact: 'Evita incertezas na condução da cerimônia e garante fotos de primeiro plano dos anéis.',
    });
  }

  if (!hasInformedAssinaturas) {
    cerimonialSuggestions.push({
      id: 'sug-assinaturas',
      title: 'Assinatura da Ata Civil, Religiosa ou Livro de Honra',
      category: 'Cerimônia & Cortejo',
      categoryLabel: 'Cerimônia & Cortejo',
      statusLabel: 'SUGESTÃO DO CERIMONIAL IA',
      description: 'Assinatura de ata civil ou religiosa não informada pelo cliente.',
      recommendation: 'Caso o casamento tenha efeito civil no local ou assinaturas com testemunhas, providenciar mesa de apoio discreta no altar com caneta de tinta preta testada.',
      clientMention: 'Momento não informado pelo cliente no briefing',
      suggestion: 'Providenciar mesa de apoio no altar com caneta testada caso haja assinaturas.',
      impact: 'Mantém a formalidade jurídica sem atrasar a saída dos noivos.',
    });
  }

  if (!hasInformedPadrinhos) {
    cerimonialSuggestions.push({
      id: 'sug-padrinhos',
      title: 'Cortejo de Padrinhos e Madrinhas no Altar',
      category: 'Cerimônia & Cortejo',
      categoryLabel: 'Cerimônia & Cortejo',
      statusLabel: 'SUGESTÃO DO CERIMONIAL IA',
      description: 'Padrinhos, madrinhas ou cortejo solene não informados pelo cliente.',
      recommendation: 'Caso optem por cortejo tradicional com padrinhos, informar a lista de casais com antecedência para que o cerimonial organize a ordem de entrada, lapelas e disposição dos lados no altar.',
      clientMention: 'Participantes e cortejo não informados pelo cliente',
      suggestion: 'Informar lista de padrinhos com antecedência para organizar lapelas e altar.',
      impact: 'Garante simetria estética no altar e fluxo harmonioso de fotos.',
    });
  }

  if (!hasInformedPais) {
    cerimonialSuggestions.push({
      id: 'sug-pais',
      title: 'Entrada Dedicada dos Pais dos Noivos',
      category: 'Cerimônia & Cortejo',
      categoryLabel: 'Cerimônia & Cortejo',
      statusLabel: 'SUGESTÃO DO CERIMONIAL IA',
      description: 'Composição e ordem de entrada dos pais não informadas pelo cliente.',
      recommendation: 'Definir se os pais entrarão juntos antes do noivo/noiva ou se acompanharão seus respectivos filhos na entrada solene ao altar.',
      clientMention: 'Composição de entrada dos pais não informada',
      suggestion: 'Alinhar com o casal se os pais entram antes ou acompanham os noivos.',
      impact: 'Previne dúvidas protocolares minutos antes do início do evento.',
    });
  }

  if (!hasInformedPajens) {
    cerimonialSuggestions.push({
      id: 'sug-pajens',
      title: 'Entrada de Crianças de Honra (Pajens, Floristas ou Damas)',
      category: 'Cerimônia & Cortejo',
      categoryLabel: 'Cerimônia & Cortejo',
      statusLabel: 'SUGESTÃO DO CERIMONIAL IA',
      description: 'Participantes infantis, pajens ou daminhas não informados no briefing.',
      recommendation: 'Caso haja crianças no cortejo, ter sempre um responsável familiar posicionado próximo ao altar com brinquedo ou atrativo para manter a criança tranquila.',
      clientMention: 'Participantes infantis não informados no briefing',
      suggestion: 'Posicionar familiar no altar com atrativo caso haja crianças de honra.',
      impact: 'Minimiza desvios no tapete da cerimônia e assegura entradas espontâneas.',
    });
  }

  if (!serviceStatus.celebrante) {
    cerimonialSuggestions.push({
      id: 'sug-celebrante',
      title: 'Celebrante, Cerimoniário ou Juiz de Paz',
      category: 'Serviços & Contratações',
      categoryLabel: 'Serviços & Contratações',
      statusLabel: 'SUGESTÃO DO CERIMONIAL IA',
      description: 'Serviço de celebração não informado como contratado no briefing.',
      recommendation: 'Definir quem oficializará o casamento (celebrante profissional, autoridade religiosa, juiz de paz ou amigo da família) e alinhar com ele a duração desejada da mensagem (sugestão: 25 a 35 min).',
      clientMention: 'Serviço de celebração não informado pelo cliente',
      suggestion: 'Contratar celebrante ou definir autoridade condutora da celebração.',
      impact: 'Essencial para a fluidez do roteiro e cumprimento do cronograma de início da festa.',
    });
  }

  if (!serviceStatus.fotografia) {
    cerimonialSuggestions.push({
      id: 'sug-fotografia',
      title: 'Cobertura de Fotografia e Cinema',
      category: 'Serviços & Contratações',
      categoryLabel: 'Serviços & Contratações',
      statusLabel: 'SUGESTÃO DO CERIMONIAL IA',
      description: 'Equipe de fotografia ou vídeo não informada como contratada no briefing.',
      recommendation: 'Caso contratem fotógrafo, orientar a equipe a chegar no local com 2h de antecedência para captar a cenografia antes da entrada dos convidados e acordar uma lista curta de fotos formais pós-cerimônia.',
      clientMention: 'Serviço de foto/filme não informado pelo cliente',
      suggestion: 'Contratar equipe de fotografia e cinema com alinhamento de fotos protocolares.',
      impact: 'Preserva a memória afetiva e evita retenção excessiva dos noivos em sessões fotográficas extensas.',
    });
  }

  if (!serviceStatus.dj && !serviceStatus.musicos) {
    cerimonialSuggestions.push({
      id: 'sug-musica',
      title: 'Sonorização da Cerimônia & DJ/Música da Festa',
      category: 'Serviços & Contratações',
      categoryLabel: 'Serviços & Contratações',
      statusLabel: 'SUGESTÃO DO CERIMONIAL IA',
      description: 'Equipe de sonorização, músicos ou DJ não informada como contratada.',
      recommendation: 'Garantir sonorização adequada com pelo menos dois microfones sem fio de alta sensibilidade para a cerimônia e sistema de som dimensionado para a pista da recepção.',
      clientMention: 'Serviço musical e de som não informado pelo cliente',
      suggestion: 'Contratar sonorização profissional para cerimônia e pista.',
      impact: 'Voz audível em todas as fileiras e transição animada para a festa.',
    });
  }

  if (!serviceStatus.buffet) {
    cerimonialSuggestions.push({
      id: 'sug-buffet',
      title: 'Serviço Gastronômico, Buffet & Bebidas',
      category: 'Serviços & Contratações',
      categoryLabel: 'Serviços & Contratações',
      statusLabel: 'SUGESTÃO DO CERIMONIAL IA',
      description: 'Serviço de buffet, alimentação ou bar não informado como contratado.',
      recommendation: 'Definir o formato de serviço (coquetel volante, finger food, ilhas gastronômicas ou empratado) e solicitar conferência das quantidades de gelo e bebidas antes do início da recepção.',
      clientMention: 'Serviço de buffet não informado pelo cliente',
      suggestion: 'Definir formato de serviço gastronômico e conferência de insumos.',
      impact: 'Conforto e satisfação imediata dos convidados ao chegarem da cerimônia.',
    });
  }

  if (!serviceStatus.decoracao) {
    cerimonialSuggestions.push({
      id: 'sug-decoracao',
      title: 'Decoração, Flores e Ambientação',
      category: 'Serviços & Contratações',
      categoryLabel: 'Serviços & Contratações',
      statusLabel: 'SUGESTÃO DO CERIMONIAL IA',
      description: 'Serviço de decoração e flores não informado como contratado no briefing.',
      recommendation: 'Caso haja equipe de decoração, solicitar cronograma de montagem com conclusão prevista para 1h antes da chegada dos convidados para que o cerimonial faça a vistoria de velas, toalhas e iluminação.',
      clientMention: 'Serviço de decoração não informado pelo cliente',
      suggestion: 'Alinhar cronograma de montagem floral e cenográfica com antecedência.',
      impact: 'Garante ambiente impecável e tempo hábil para ajustes florais.',
    });
  }

  if (!serviceStatus.gerador) {
    cerimonialSuggestions.push({
      id: 'sug-gerador',
      title: 'Gerador de Energia de Emergência',
      category: 'Serviços & Contratações',
      categoryLabel: 'Serviços & Contratações',
      statusLabel: 'SUGESTÃO DO CERIMONIAL IA',
      description: 'Gerador elétrico não informado como contratado ou disponível no espaço.',
      recommendation: 'Checar se o local possui gerador automático de standby para garantir o funcionamento ininterrupto de som, iluminação cênica e freezers de bebidas em caso de oscilação da concessionária elétrica.',
      clientMention: 'Gerador não informado pelo cliente',
      suggestion: 'Verificar redundância de energia para evitar apagões operacionais.',
      impact: 'Segurança absoluta contra apagões durante a celebração e a pista de dança.',
    });
  }

  if (!hasInformedBoloDoces) {
    cerimonialSuggestions.push({
      id: 'sug-doces',
      title: 'Corte do Bolo & Liberação da Mesa de Doces',
      category: 'Recepção & Tradições',
      categoryLabel: 'Recepção & Tradições',
      statusLabel: 'SUGESTÃO DO CERIMONIAL IA',
      description: 'Mesa de doces ou corte de bolo não informados pelo cliente.',
      recommendation: 'Caso haja mesa de doces e bolo cenográfico/de corte, sugerimos agendar o brinde e fotos do casal com os doces logo após a entrada na festa, liberando o consumo aos convidados após o serviço principal.',
      clientMention: 'Momento de bolo/doces não informado pelo cliente',
      suggestion: 'Agendar fotos e brinde com o bolo antes de liberar o consumo geral.',
      impact: 'Garante fotos da mesa intacta com iluminação perfeita.',
    });
  }

  if (!serviceStatus.dj && !serviceStatus.musicos) {
    cerimonialSuggestions.push({
      id: 'sug-danca',
      title: 'Primeira Dança dos Noivos & Abertura da Pista',
      category: 'Recepção & Tradições',
      categoryLabel: 'Recepção & Tradições',
      statusLabel: 'SUGESTÃO DO CERIMONIAL IA',
      description: 'Abertura oficial de pista ou primeira dança não informadas pelo cliente.',
      recommendation: 'Caso os noivos desejem dançar uma música especial, o cerimonial pode coordenar a transição da música ambiente para a dança dos noivos com convite para os padrinhos se juntarem na pista.',
      clientMention: 'Momento de dança/pista não informado pelo cliente',
      suggestion: 'Coordenar primeira dança como gatilho de abertura de pista.',
      impact: 'Transição energética que atrai os convidados naturalmente para a celebração festiva.',
    });
  }

  if (!hasInformedBuque) {
    cerimonialSuggestions.push({
      id: 'sug-buque',
      title: 'Momento da Jogada do Buquê da Noiva',
      category: 'Recepção & Tradições',
      categoryLabel: 'Recepção & Tradições',
      statusLabel: 'SUGESTÃO DO CERIMONIAL IA',
      description: 'Jogada do buquê da noiva não informada no briefing.',
      recommendation: 'Caso a noiva queira realizar a tradição do buquê, sugerimos encaixar por volta da 3ª ou 4ª hora de recepção, quando a pista já estiver movimentada e os convidados descontraídos.',
      clientMention: 'Jogada de buquê não informada pelo cliente',
      suggestion: 'Programar jogada do buquê durante o ápice da pista de dança.',
      impact: 'Momento lúdico e clássico de interação e registro fotográfico descontraído.',
    });
  }

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
    cerimonialSuggestions,
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
4. ROTEIRO DA CERIMÔNIA (ITENS CONFIRMADOS)
------------------------------------------------------
`;

  plan.ceremonyScript.forEach((step) => {
    text += `${step.order}. ${step.title}
Participantes: ${step.participants} [${step.participantsSource === 'CLIENT_DATA' ? 'DADO INFORMADO PELO CLIENTE' : 'NÃO INFORMADO'}]
Detalhes: ${step.details}
${step.tip ? `Dica do Cerimonial: ${step.tip}` : ''}
\n`;
  });

  if (plan.cerimonialSuggestions.length > 0) {
    text += `------------------------------------------------------
5. SUGESTÕES DO CERIMONIAL IA (ITENS NÃO INFORMADOS)
------------------------------------------------------
`;
    plan.cerimonialSuggestions.forEach((sug) => {
      text += `* [${(sug.categoryLabel || sug.category).toUpperCase()}] ${sug.title}
Status: [${sug.statusLabel}]
Situação no Briefing: ${sug.clientMention || sug.description}
Sugestão: ${sug.suggestion || sug.recommendation}
Impacto Operacional: ${sug.impact || 'Alinhamento preventivo'}
\n`;
    });
  }

  text += `------------------------------------------------------
6. FORNECEDORES & RESPONSABILIDADES
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
