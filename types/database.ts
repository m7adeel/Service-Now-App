export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          user_type: 'client' | 'provider';
          avatar_url: string | null;
          location: any | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          phone?: string | null;
          user_type?: 'client' | 'provider';
          avatar_url?: string | null;
          location?: any | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          phone?: string | null;
          user_type?: 'client' | 'provider';
          avatar_url?: string | null;
          location?: any | null;
          updated_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          provider_id: string;
          title: string;
          description: string | null;
          category: string;
          price: number;
          duration_minutes: number;
          image_url: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          provider_id: string;
          title: string;
          description?: string | null;
          category: string;
          price: number;
          duration_minutes?: number;
          image_url?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          provider_id?: string;
          title?: string;
          description?: string | null;
          category?: string;
          price?: number;
          duration_minutes?: number;
          image_url?: string | null;
          is_active?: boolean;
        };
      };
      bookings: {
        Row: {
          id: string;
          client_id: string;
          service_id: string;
          provider_id: string;
          scheduled_date: string;
          scheduled_time: string;
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          service_id: string;
          provider_id: string;
          scheduled_date: string;
          scheduled_time: string;
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          service_id?: string;
          provider_id?: string;
          scheduled_date?: string;
          scheduled_time?: string;
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          notes?: string | null;
        };
      };
      messages: {
        Row: {
          id: string;
          booking_id: string;
          sender_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          sender_id: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          sender_id?: string;
          content?: string;
        };
      };
      invoices: {
        Row: {
          id: string;
          booking_id: string;
          provider_id: string;
          amount: number;
          status: 'draft' | 'sent' | 'paid';
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          provider_id: string;
          amount: number;
          status?: 'draft' | 'sent' | 'paid';
          created_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          provider_id?: string;
          amount?: number;
          status?: 'draft' | 'sent' | 'paid';
        };
      };
    };
  };
}