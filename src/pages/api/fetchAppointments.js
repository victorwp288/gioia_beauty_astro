// src/pages/api/fetchAppointments.ts

import { supabase } from '../../lib/supabaseClient';
import { z } from 'zod';

const fetchSchema = z.object({
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
});

export async function GET({ request }) {
  try {
    const url = new URL(request.url);
    const date = url.searchParams.get("date");

    if (!date) {
      return new Response(JSON.stringify({ message: "Date is required" }), {
        status: 400,
      });
    }

    // Validate the date
    fetchSchema.parse({ date });

    // Convert date to start and end of day in ISO format
    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);

    // Fetch appointments for the given date from Supabase
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('*')
      .gte('start_time', startOfDay.toISOString())
      .lte('start_time', endOfDay.toISOString())
      .order('start_time', { ascending: true });

    if (error) throw error;

    // Transform the data to match your frontend expectations
    const transformedAppointments = appointments.map(appointment => ({
      date: new Date(appointment.start_time).toISOString().split('T')[0],
      timeSlot: new Date(appointment.start_time).toLocaleTimeString('it-IT', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }),
      duration_minutes: appointment.duration_minutes,
    }));

    // Fetch appointments for the given date
    const filteredAppointments = appointments.filter(
      (appt) => appt.date === date
    );

    return new Response(JSON.stringify(filteredAppointments), {
      status: 200,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ message: error.errors[0].message }), {
        status: 400,
      });
    }
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
