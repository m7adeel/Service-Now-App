import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

type Service = Database['public']['Tables']['services']['Row'] & {
  profiles: {
    full_name: string;
    avatar_url: string | null;
    phone: string | null;
    email: string;
    location: any | null;
  };
};

interface ServicesState {
  services: Service[];
  isLoading: boolean;
  searchQuery: string;
  selectedCategory: string | null;
  fetchServices: () => Promise<void>;
  fetchProviderServices: (providerId: string) => Promise<void>;
  searchServices: (query: string) => void;
  filterByCategory: (category: string | null) => void;
  createService: (service: Database['public']['Tables']['services']['Insert']) => Promise<void>;
  updateService: (id: string, updates: Database['public']['Tables']['services']['Update']) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  toggleServiceStatus: (id: string) => Promise<void>;
}

export const useServicesStore = create<ServicesState>((set, get) => ({
  services: [],
  isLoading: false,
  searchQuery: '',
  selectedCategory: null,

  fetchServices: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          profiles:provider_id (
            full_name,
            avatar_url,
            phone,
            email,
            location
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ services: data || [] });
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchProviderServices: async (providerId: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          profiles:provider_id (
            full_name,
            avatar_url,
            phone,
            email,
            location
          )
        `)
        .eq('provider_id', providerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ services: data || [] });
    } catch (error) {
      console.error('Error fetching provider services:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  searchServices: (query: string) => {
    set({ searchQuery: query });
  },

  filterByCategory: (category: string | null) => {
    set({ selectedCategory: category });
  },

  createService: async (service) => {
    const { data, error } = await supabase
      .from('services')
      .insert(service)
      .select()
      .single();

    if (error) throw error;
    await get().fetchServices();
  },

  updateService: async (id: string, updates) => {
    const { error } = await supabase
      .from('services')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    await get().fetchServices();
  },

  deleteService: async (id: string) => {
    const { error } = await supabase
      .from('services')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;
    await get().fetchServices();
  },

  toggleServiceStatus: async (id: string) => {
    const service = get().services.find(s => s.id === id);
    if (!service) throw new Error('Service not found');

    const { error } = await supabase
      .from('services')
      .update({ is_active: !service.is_active })
      .eq('id', id);

    if (error) throw error;
    await get().fetchServices();
  },
}));