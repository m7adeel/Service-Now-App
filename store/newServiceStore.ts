import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Client {
  id?: string;
  name: string;
  phoneNumber: string;
  email: string;
  location: string;
  notes: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  duration: number;
  quantity: number;
  total: number;
}

export interface QuoteData {
  quoteNumber: string;
  issueDate: string;
  expiryDate: string;
  services: ServiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  terms: string;
  notes: string;
}

export interface JobData {
  jobTitle: string;
  scheduledDate: string;
  startTime: string;
  estimatedDuration: number;
  location: string;
  specialInstructions: string;
  priority: 'low' | 'medium' | 'high';
  teamSize: number;
  equipment: string;
  notes: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  services: ServiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  terms: string;
  notes: string;
}

export interface NewServiceState {
  // Step 1: Client Information
  client: Client | null;
  
  // Step 2: Quote Information
  quote: QuoteData;
  
  // Step 3: Job Scheduling
  job: JobData;
  
  // Step 4: Invoice Information
  invoice: InvoiceData;
  
  // Current step tracking (0-4: Client, Quote, Job, Invoice, Summary)
  currentStep: number;
  
  // Actions
  setClient: (client: Client) => void;
  updateClient: (updates: Partial<Client>) => void;
  
  setQuote: (quote: QuoteData) => void;
  updateQuote: (updates: Partial<QuoteData>) => void;
  addServiceToQuote: (service: ServiceItem) => void;
  removeServiceFromQuote: (serviceId: string) => void;
  updateServiceQuantity: (serviceId: string, quantity: number) => void;
  
  setJob: (job: JobData) => void;
  updateJob: (updates: Partial<JobData>) => void;
  
  setInvoice: (invoice: InvoiceData) => void;
  updateInvoice: (updates: Partial<InvoiceData>) => void;
  
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  
  resetAll: () => void;
  canProceedToNextStep: () => boolean;
  isStepComplete: (step: number) => boolean;
  getCompletedSteps: () => number[];
}

const initialQuoteData: QuoteData = {
  quoteNumber: '',
  issueDate: new Date().toISOString().split('T')[0],
  expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  services: [],
  subtotal: 0,
  taxRate: 8.5,
  taxAmount: 0,
  total: 0,
  terms: 'Payment due within 30 days. 50% deposit required to begin work.',
  notes: ''
};

const initialJobData: JobData = {
  jobTitle: '',
  scheduledDate: new Date().toISOString().split('T')[0],
  startTime: '09:00 AM',
  estimatedDuration: 0,
  location: '',
  specialInstructions: '',
  priority: 'medium',
  teamSize: 1,
  equipment: '',
  notes: ''
};

const initialInvoiceData: InvoiceData = {
  invoiceNumber: '',
  issueDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  services: [],
  subtotal: 0,
  taxRate: 8.5,
  taxAmount: 0,
  total: 0,
  terms: 'Payment due within 30 days. 50% deposit required to begin work.',
  notes: ''
};

export const useNewServiceStore = create<NewServiceState>()(
  persist(
    (set, get) => ({
      client: null,
      quote: initialQuoteData,
      job: initialJobData,
      invoice: initialInvoiceData,
      currentStep: 0,

      setClient: (client: Client) => set({ client }),
      
      updateClient: (updates: Partial<Client>) => set((state) => ({
        client: state.client ? { ...state.client, ...updates } : null
      })),

      setQuote: (quote: QuoteData) => set({ quote }),
      
      updateQuote: (updates: Partial<QuoteData>) => set((state) => ({
        quote: { ...state.quote, ...updates }
      })),

      addServiceToQuote: (service: ServiceItem) => set((state) => {
        const existingService = state.quote.services.find(s => s.id === service.id);
        let updatedServices: ServiceItem[];

        if (existingService) {
          updatedServices = state.quote.services.map(s =>
            s.id === service.id
              ? { ...s, quantity: s.quantity + 1, total: (s.quantity + 1) * s.basePrice }
              : s
          );
        } else {
          const newService = {
            ...service,
            quantity: 1,
            total: service.basePrice
          };
          updatedServices = [...state.quote.services, newService];
        }

        const subtotal = updatedServices.reduce((sum, s) => sum + s.total, 0);
        const taxAmount = subtotal * (state.quote.taxRate / 100);
        const total = subtotal + taxAmount;

        return {
          quote: {
            ...state.quote,
            services: updatedServices,
            subtotal,
            taxAmount,
            total
          }
        };
      }),

      removeServiceFromQuote: (serviceId: string) => set((state) => {
        const updatedServices = state.quote.services.filter(s => s.id !== serviceId);
        const subtotal = updatedServices.reduce((sum, s) => sum + s.total, 0);
        const taxAmount = subtotal * (state.quote.taxRate / 100);
        const total = subtotal + taxAmount;

        return {
          quote: {
            ...state.quote,
            services: updatedServices,
            subtotal,
            taxAmount,
            total
          }
        };
      }),

      updateServiceQuantity: (serviceId: string, quantity: number) => set((state) => {
        if (quantity <= 0) {
          const updatedServices = state.quote.services.filter(s => s.id !== serviceId);
          const subtotal = updatedServices.reduce((sum, s) => sum + s.total, 0);
          const taxAmount = subtotal * (state.quote.taxRate / 100);
          const total = subtotal + taxAmount;

          return {
            quote: {
              ...state.quote,
              services: updatedServices,
              subtotal,
              taxAmount,
              total
            }
          };
        }

        const updatedServices = state.quote.services.map(s =>
          s.id === serviceId
            ? { ...s, quantity, total: quantity * s.basePrice }
            : s
        );

        const subtotal = updatedServices.reduce((sum, s) => sum + s.total, 0);
        const taxAmount = subtotal * (state.quote.taxRate / 100);
        const total = subtotal + taxAmount;

        return {
          quote: {
            ...state.quote,
            services: updatedServices,
            subtotal,
            taxAmount,
            total
          }
        };
      }),

      setJob: (job: JobData) => set({ job }),
      
      updateJob: (updates: Partial<JobData>) => set((state) => ({
        job: { ...state.job, ...updates }
      })),

      setInvoice: (invoice: InvoiceData) => set({ invoice }),
      
      updateInvoice: (updates: Partial<InvoiceData>) => set((state) => ({
        invoice: { ...state.invoice, ...updates }
      })),

      setCurrentStep: (step: number) => set({ currentStep: step }),
      
      nextStep: () => set((state) => ({
        currentStep: Math.min(state.currentStep + 1, 4) // Now goes to step 4 (Summary)
      })),
      
      previousStep: () => set((state) => ({
        currentStep: Math.max(state.currentStep - 1, 0)
      })),

      resetAll: () => set({
        client: null,
        quote: initialQuoteData,
        job: initialJobData,
        invoice: initialInvoiceData,
        currentStep: 0
      }),

      canProceedToNextStep: () => {
        const state = get();
        
        switch (state.currentStep) {
          case 0: // Client step
            return state.client !== null && 
                   state.client.name.trim() !== '' && 
                   state.client.phoneNumber.trim() !== '';
          
          case 1: // Quote step
            return state.quote.services.length > 0 && 
                   state.quote.quoteNumber.trim() !== '';
          
          case 2: // Job step
            return state.job.jobTitle.trim() !== '' && 
                   state.job.location.trim() !== '';
          
          case 3: // Invoice step
            return true; // Always can proceed from invoice step
          
          case 4: // Summary step
            return false; // Can't proceed from summary step
          
          default:
            return false;
        }
      },

      isStepComplete: (step: number) => {
        const state = get();
        
        switch (step) {
          case 0: // Client step
            return state.client !== null && 
                   state.client.name.trim() !== '' && 
                   state.client.phoneNumber.trim() !== '';
          
          case 1: // Quote step
            return state.quote.services.length > 0 && 
                   state.quote.quoteNumber.trim() !== '';
          
          case 2: // Job step
            return state.job.jobTitle.trim() !== '' && 
                   state.job.location.trim() !== '';
          
          case 3: // Invoice step
            return state.invoice.services.length > 0;
          
          case 4: // Summary step
            return state.isStepComplete(0) && 
                   state.isStepComplete(1) && 
                   state.isStepComplete(2) && 
                   state.isStepComplete(3);
          
          default:
            return false;
        }
      },

      getCompletedSteps: () => {
        const state = get();
        const completedSteps: number[] = [];
        
        for (let i = 0; i <= 4; i++) {
          if (state.isStepComplete(i)) {
            completedSteps.push(i);
          }
        }
        
        return completedSteps;
      }
    }),
    {
      name: 'new-service-store',
      partialize: (state) => ({
        client: state.client,
        quote: state.quote,
        job: state.job,
        invoice: state.invoice,
        currentStep: state.currentStep
      })
    }
  )
);
