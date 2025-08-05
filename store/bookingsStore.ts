import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

type Booking = Database['public']['Tables']['bookings']['Row'] & {
  services: {
    title: string;
    price: number;
    duration_minutes: number;
  };
  client_profile: {
    full_name: string;
    phone: string | null;
  };
  provider_profile: {
    full_name: string;
    phone: string | null;
  };
};

interface BookingsState {
  bookings: Booking[];
  isLoading: boolean;
  fetchBookings: () => Promise<void>;
  createBooking: (booking: Database['public']['Tables']['bookings']['Insert']) => Promise<void>;
  updateBookingStatus: (id: string, status: 'pending' | 'confirmed' | 'completed' | 'cancelled') => Promise<void>;
}

export const useBookingsStore = create<BookingsState>((set, get) => ({
  bookings: [],
  isLoading: false,

  fetchBookings: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          services:service_id (
            title,
            price,
            duration_minutes
          ),
          client_profile:client_id (
            full_name,
            phone
          ),
          provider_profile:provider_id (
            full_name,
            phone
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ bookings: data || [] });
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  createBooking: async (booking) => {
    const { error } = await supabase
      .from('bookings')
      .insert(booking);

    if (error) throw error;
    await get().fetchBookings();
  },

  updateBookingStatus: async (id: string, status) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
    await get().fetchBookings();
  },
}));