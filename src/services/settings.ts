
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database.types';

export type Setting = Database['public']['Tables']['settings']['Row'];
export type SettingInsert = Database['public']['Tables']['settings']['Insert'];
export type SettingUpdate = Database['public']['Tables']['settings']['Update'];

export interface BusinessInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface BookingSettings {
  allowSameDayBookings: boolean;
  requirePhoneVerification: boolean;
  sendSmsReminders: boolean;
}

export interface TimeSlots {
  startTime: string;
  endTime: string;
  slotDuration: number;
}

export interface ServiceSettings {
  id: string;
  name: string;
  price: number;
  description: string;
  active: boolean;
}

export const settingsService = {
  async getBusinessInfo(): Promise<BusinessInfo> {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('id', 'business_info')
      .single();

    if (error) throw error;

    const defaultInfo: BusinessInfo = {
      name: 'Klin Ride Mobile Car Detailing',
      email: 'klinride25@gmail.com',
      phone: '+256 776 041 056',
      address: 'L2B Butenga Estate, Kira-Kasangati Rd'
    };

    return (data?.value as BusinessInfo) || defaultInfo;
  },

  async updateBusinessInfo(info: BusinessInfo): Promise<void> {
    const { error } = await supabase
      .from('settings')
      .update({ value: info })
      .eq('id', 'business_info');

    if (error) throw error;
  },

  async getBookingSettings(): Promise<BookingSettings> {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('id', 'booking_settings')
      .single();

    if (error) throw error;

    const defaultSettings: BookingSettings = {
      allowSameDayBookings: true,
      requirePhoneVerification: false,
      sendSmsReminders: false
    };

    return (data?.value as BookingSettings) || defaultSettings;
  },

  async updateBookingSettings(settings: BookingSettings): Promise<void> {
    const { error } = await supabase
      .from('settings')
      .update({ value: settings })
      .eq('id', 'booking_settings');

    if (error) throw error;
  },

  async getTimeSlots(): Promise<TimeSlots> {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('id', 'time_slots')
      .single();

    if (error) throw error;

    const defaultTimeSlots: TimeSlots = {
      startTime: '08:00',
      endTime: '18:00',
      slotDuration: 60
    };

    return (data?.value as TimeSlots) || defaultTimeSlots;
  },

  async updateTimeSlots(timeSlots: TimeSlots): Promise<void> {
    const { error } = await supabase
      .from('settings')
      .update({ value: timeSlots })
      .eq('id', 'time_slots');

    if (error) throw error;
  }
};
