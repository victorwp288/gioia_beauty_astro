import { jsxs, jsx } from 'react/jsx-runtime';
import 'react';
import { Resend } from 'resend';
import { z } from 'zod';
export { renderers } from '../../renderers.mjs';

const CancelEmailTemplate = ({
  name,
  date,
  startTime,
  duration,
  appointmentType
}) => /* @__PURE__ */ jsxs("div", { children: [
  /* @__PURE__ */ jsxs("h1", { children: [
    "Gentile ",
    name,
    ","
  ] }),
  /* @__PURE__ */ jsxs("p", { children: [
    "Il tuo appuntamento per il ",
    date,
    " è stato cancellato."
  ] }),
  /* @__PURE__ */ jsxs("p", { children: [
    /* @__PURE__ */ jsx("strong", { children: "Tipo di appuntamento:" }),
    " ",
    appointmentType
  ] }),
  /* @__PURE__ */ jsxs("p", { children: [
    /* @__PURE__ */ jsx("strong", { children: "Data:" }),
    " ",
    date
  ] }),
  /* @__PURE__ */ jsxs("p", { children: [
    /* @__PURE__ */ jsx("strong", { children: "Ora:" }),
    " ",
    startTime
  ] }),
  /* @__PURE__ */ jsxs("p", { children: [
    /* @__PURE__ */ jsx("strong", { children: "Durata:" }),
    " ",
    duration,
    " minuti"
  ] }),
  /* @__PURE__ */ jsx("p", { children: "Ci scusiamo per l'incovenienza." }),
  /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx("i", { children: "Non è possibile rispondere a questa mail." }) })
] });

const prerender = false;
const resend = new Resend("re_XfJDJhtr_AYV1wbcr8UdqpyYsFL68Bz6p");
const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
  client_name: z.string().min(1, "Name is required"),
  appointment_type: z.string().min(1, "Appointment type is required"),
  start_time: z.string().min(1, "Start time is required"),
  duration_minutes: z.number().min(1, "Duration is required")
});
const POST = async ({ request }) => {
  console.log("Request method:", request.method);
  console.log("Request headers:", Object.fromEntries(request.headers));
  try {
    const body = await request.json();
    console.log("Received request body:", body);
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
          minute: "2-digit"
        }),
        duration: validatedData.duration_minutes,
        appointmentType: validatedData.appointment_type
      })
    });
    if (error) {
      console.error("Resend error:", error);
      return new Response(JSON.stringify({ message: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(
      JSON.stringify({
        message: "Email sent successfully",
        data: emailResponse
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("API error:", error);
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          message: "Validation error",
          errors: error.errors
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    return new Response(
      JSON.stringify({
        message: "Failed to send email",
        error: error.message
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};
const GET = () => {
  return new Response(
    JSON.stringify({
      message: "Method not allowed. Please use POST request."
    }),
    {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        Allow: "POST"
      }
    }
  );
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
