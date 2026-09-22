export interface WeddingFormData {
  coupleNames: string;
  weddingDate: string;
  cityAndVenue: string;
  guestCount: number | '';
  ceremonyTime: string;
  receptionTime: string;
  endTime: string;
  weddingStyle: string;
  contractedVendors: string;
  vipPeople: string;
  specialNeeds: string;
  notes: string;
}

export interface PendingInfoItem {
  id: string;
  field: string;
  label: string;
  status: 'missing' | 'incomplete';
  description: string;
  impact: string;
  recommendation: string;
}

export interface ServiceStatusItem {
  id: string;
  serviceName: string;
  isInformed: boolean;
  statusLabel: 'Contratado (Informado pelo cliente)' | 'Serviço não informado';
  details: string;
}

export interface PreparationChecklistPhase {
  phaseTitle: string;
  timelineBadge: string;
  items: {
    id: string;
    task: string;
    category: string;
    completed: boolean;
    sourceType: 'CLIENT_DATA' | 'CERIMONIAL_SUGGESTION';
  }[];
}

export interface DayTimelineItem {
  id: string;
  time: string;
  title: string;
  description: string;
  responsible: string;
  phase: 'pre' | 'ceremony' | 'reception' | 'post';
  sourceType: 'CLIENT_DATA' | 'CERIMONIAL_SUGGESTION';
  sourceLabel: string;
  isTimeDefined: boolean;
}

export interface VendorAssignment {
  id: string;
  category: string;
  vendorName: string;
  arrivalTime: string;
  arrivalTimeType: 'CLIENT_DATA' | 'CERIMONIAL_SUGGESTION';
  responsibilities: string[];
  contactPlaceholder?: string;
  checkpoint: string;
  sourceType: 'CLIENT_DATA' | 'CERIMONIAL_SUGGESTION';
}

export interface WhatsAppTemplate {
  id: string;
  title: string;
  recipientGroup: 'Noivos' | 'Padrinhos' | 'Fornecedores' | 'Convidados';
  description: string;
  messageText: string;
}

export interface CeremonyStep {
  order: number;
  title: string;
  participants: string;
  participantsSource: 'CLIENT_DATA' | 'CERIMONIAL_SUGGESTION';
  details: string;
  tip?: string;
}

export interface ContingencyPlanItem {
  id: string;
  risk: string;
  severity: 'Alta' | 'Média' | 'Preventiva';
  actionPlan: string;
  itemsNeeded: string;
}

export interface GeneratedPlan {
  summary: {
    coupleNames: string;
    hasCoupleNames: boolean;
    weddingDateRaw: string;
    weddingDateFormatted: string;
    daysUntil: number | null;
    daysUntilLabel: string;
    daysUntilStatus: 'defined' | 'today' | 'passed' | 'missing';
    isPastDate: boolean;
    cityAndVenue: string;
    hasCityAndVenue: boolean;
    guestCount: number | null;
    guestCountLabel: string;
    ceremonyTime: string;
    hasCeremonyTime: boolean;
    receptionTime: string;
    hasReceptionTime: boolean;
    endTime: string;
    hasEndTime: boolean;
    style: string;
    hasStyle: boolean;
    totalHours: number | null;
    totalHoursLabel: string;
    estimatedStaff: number | null;
    estimatedStaffLabel: string;
  };
  pendingInformation: PendingInfoItem[];
  servicesOverview: ServiceStatusItem[];
  preparationChecklist: PreparationChecklistPhase[];
  timeline: DayTimelineItem[];
  vendors: VendorAssignment[];
  whatsappMessages: WhatsAppTemplate[];
  ceremonyScript: CeremonyStep[];
  contingencyPlan: ContingencyPlanItem[];
  dayDChecklist: {
    id: string;
    task: string;
    done: boolean;
    area: 'Maleta SOS' | 'Cerimônia' | 'Recepção' | 'Coordenação';
  }[];
  postEventChecklist: {
    id: string;
    task: string;
    done: boolean;
    responsible: string;
    deadline: string;
  }[];
}
