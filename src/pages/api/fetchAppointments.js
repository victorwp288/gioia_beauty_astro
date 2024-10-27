// src/pages/api/fetchAppointments.ts

import { z } from 'zod';

// Mock database (replace with your actual database logic)
let appointments = [
  // Example appointment
  {
    date: '2024-05-01',
    timeSlot: '10:00',
    // ...other fields
  },
];

const fetchSchema = z.object({
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
});

export const get = async ({ request }) => {
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
};
