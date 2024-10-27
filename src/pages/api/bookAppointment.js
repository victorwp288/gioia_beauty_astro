// src/pages/api/bookAppointment.ts

import { z } from 'zod';
import { formatISO } from 'date-fns';

// Define the schema using zod
const appointmentSchema = z.object({
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
  note: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  number: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email address').optional(),
  timeSlot: z.string().min(1, 'Time slot is required'),
  appointmentType: z.string().min(1, 'Appointment type is required'),
  variant: z.string().optional(),
  duration: z.number().min(1, 'Duration is required'),
});

// Mock database (replace with your actual database logic)
let appointments = [];

export async function POST({ request }) {
  try {
    const data = await request.json();

    // Validate the data
    const validatedData = appointmentSchema.parse(data);

    const appointmentDate = new Date(validatedData.date);
    const now = new Date();

    // Disallow booking today or past dates
    if (appointmentDate <= now) {
      return new Response(
        JSON.stringify({ message: 'Cannot book today or past dates' }),
        { status: 400 }
      );
    }

    // Check for overlapping appointments
    const overlapping = appointments.some((appt) => {
      return (
        appt.date === validatedData.date &&
        appt.timeSlot === validatedData.timeSlot
      );
    });

    if (overlapping) {
      return new Response(
        JSON.stringify({ message: 'Time slot is already booked' }),
        { status: 400 }
      );
    }

    // Save the appointment (replace with your database logic)
    appointments.push({
      ...validatedData,
      createdAt: formatISO(new Date()),
    });

    // Here you can add email sending logic using a service like SendGrid, Mailgun, etc.

    return new Response(JSON.stringify({ message: 'Appointment booked successfully' }), {
      status: 200,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ message: error.errors[0].message }), {
        status: 400,
      });
    }
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
