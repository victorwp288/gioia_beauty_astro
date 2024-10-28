export const prerender = false;

import { CancelEmailTemplate } from "../../components/react/CancelEmailTemplate";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

// Update schema to match your database structure
const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
  client_name: z.string().min(1, "Name is required"),
  appointment_type: z.string().min(1, "Appointment type is required"),
  start_time: z.string().min(1, "Start time is required"),
  duration_minutes: z.number().min(1, "Duration is required"),
});

export const POST = async ({ request }) => {
  console.log("Request method:", request.method);
  console.log("Request headers:", Object.fromEntries(request.headers));

  try {
    const body = await request.json();
    console.log("Received request body:", body);

    // Validate the data
    const validatedData = emailSchema.parse(body);
    console.log("Validated data:", validatedData);

    const startDate = new Date(validatedData.start_time);

    const { data: emailResponse, error } = await resend.emails.send({
      from: "Gioia Beauty <noreply@gioiabeauty.net>",
      to: [validatedData.email],
      subject: "Cancellazione appuntamento",
      react: CancelEmailTemplate({
        name: validatedData.client_name,
        date: startDate.toLocaleDateString("it-IT"),
        startTime: startDate.toLocaleTimeString("it-IT", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        duration: validatedData.duration_minutes,
        appointmentType: validatedData.appointment_type,
      }),
    });

    if (error) {
      console.error("Resend error:", error);
      return new Response(JSON.stringify({ message: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        message: "Email sent successfully",
        data: emailResponse,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("API error:", error);

    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          message: "Validation error",
          errors: error.errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Failed to send email",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

// Handle GET requests
export const GET = () => {
  return new Response(
    JSON.stringify({
      message: "Method not allowed. Please use POST request.",
    }),
    {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        Allow: "POST",
      },
    }
  );
};
