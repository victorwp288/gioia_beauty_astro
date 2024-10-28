// src/pages/api/bookAppointment.ts

import { z } from 'zod';
import { formatISO } from 'date-fns';
import { supabase } from '../../lib/supabaseClient';

// Updated schema to match your Supabase structure
const appointmentSchema = z.object({
  client_name: z.string().min(1, 'Name is required'),
  phone_number: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email address').optional().nullable(),
  notes: z.string().optional().nullable(),
  appointment_type: z.string().min(1, 'Appointment type is required'),
  start_time: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
  duration_minutes: z.number().min(1, 'Duration is required'),
});

// Add export for GET method to handle unsupported method
export function GET() {
  return new Response(
    JSON.stringify({ 
      message: 'Method not allowed. Please use POST request.' 
    }), 
    { 
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Allow': 'POST'
      }
    }
  );
}

export async function POST({ request }) {
  try {
    const data = await request.json();

    // Log the incoming data for debugging
    console.log('Received appointment data:', data);

    // Combine date and time into a single timestamp
    const startDateTime = new Date(`${data.date}T${data.timeSlot}`);

    // Transform the incoming data to match our schema
    const appointmentData = {
      client_name: data.client_name, // Updated from data.name
      phone_number: data.phone_number, // Updated from data.number
      email: data.email || null,
      notes: data.notes || null, // Updated from data.note
      appointment_type: data.appointment_type, // Updated from data.appointmentType
      start_time: startDateTime.toISOString(),
      duration_minutes: parseInt(data.duration_minutes), // Updated from data.duration
    };

    console.log('Transformed appointment data:', appointmentData);

    // Validate the transformed data
    const validatedData = appointmentSchema.parse(appointmentData);

    // Check if the appointment is in the past
    if (startDateTime <= new Date()) {
      return new Response(
        JSON.stringify({ message: 'Cannot book appointments in the past' }),
        { status: 400 }
      );
    }

    // Check for overlapping appointments
    const endDateTime = new Date(startDateTime.getTime() + validatedData.duration_minutes * 60000);
    
    const { data: existingAppointments, error: fetchError } = await supabase
      .from('appointments')
      .select('*')
      .gte('start_time', startDateTime.toISOString())
      .lt('start_time', endDateTime.toISOString());

    if (fetchError) throw fetchError;

    if (existingAppointments && existingAppointments.length > 0) {
      return new Response(
        JSON.stringify({ message: 'Time slot is already booked' }),
        { status: 400 }
      );
    }

    // Insert the appointment into Supabase
    const { error: insertError } = await supabase
      .from('appointments')
      .insert([validatedData]);

    if (insertError) throw insertError;

    return new Response(
      JSON.stringify({ 
        message: 'Appointment booked successfully',
        appointment: validatedData 
      }), 
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Detailed booking error:', {
      message: error.message,
      stack: error.stack,
      data: error
    });

    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ message: error.errors[0].message }), 
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ 
        message: 'Internal Server Error',
        error: error.message 
      }), 
      { status: 500 }
    );
  }
}
