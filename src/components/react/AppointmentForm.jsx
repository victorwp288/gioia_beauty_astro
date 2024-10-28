import React, { useEffect, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addDays, format, parse, isBefore } from "date-fns"; // Added isBefore
import appointmentTypesData from "../../../data/appointmentTypes.json";
import { supabase } from '../../lib/supabaseClient';

// Define the zod schema
const formSchema = z.object({
  client_name: z.string().min(1, "Name is required"),
  phone_number: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address").optional(),
  appointment_type: z.string().min(1, "Appointment type is required"),
  // Change this to handle string date input
  start_time: z.string().min(1, "Date is required"),
  timeSlot: z.string().min(1, "Time slot is required"),
  duration_minutes: z.number().min(1, "Duration is required"),
  notes: z.string().optional(),
});

// Opening and closing hours
const openCloseHours = {
  1: { open: "09:00", close: "19:00" }, // Monday
  2: { open: "10:00", close: "20:00" }, // Tuesday
  3: { open: "09:00", close: "19:00" }, // Wednesday
  4: { open: "10:00", close: "20:00" }, // Thursday
  5: { open: "09:00", close: "18:30" }, // Friday
  6: null, // Saturday Closed
  0: null, // Sunday Closed
};

const AppointmentForm = () => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [showAllTimeSlots, setShowAllTimeSlots] = useState(false);
  const initialVisibleSlots = 12;
  const [modalIsOpen, setIsOpen] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const appointmentTypes = appointmentTypesData;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client_name: "",
      phone_number: "",
      email: "",
      appointment_type: appointmentTypes[0]?.type || "",
      start_time: format(new Date(), 'yyyy-MM-dd'), // Format as string
      timeSlot: "",
      duration_minutes: appointmentTypes[0]?.durations[0] || 30,
      notes: "",
    },
  });

  // Function to check if a day should be disabled
  const isDisabledDay = (day) => {
    const today = new Date();
    const tomorrow = addDays(today, 1);
    return isBefore(day, tomorrow) || !openCloseHours[day.getDay()];
  };

  // Fetch available time slots based on selected date and appointment type
  const fetchTimeSlots = useCallback(
    async (selectedDate, appointmentType) => {
      if (!selectedDate || !appointmentType) {
        console.log("Missing required data:", { selectedDate, appointmentType });
        setTimeSlots([]);
        return;
      }

      setLoadingSlots(true);

      try {
        // Format the date properly for the query
        const queryDate = format(new Date(selectedDate), 'yyyy-MM-dd');
        const startOfDay = `${queryDate}T00:00:00.000Z`;
        const endOfDay = `${queryDate}T23:59:59.999Z`;

        console.log("Fetching appointments for:", {
          startOfDay,
          endOfDay,
          appointmentType
        });

        // Fetch existing appointments for the selected date
        const { data: existingAppointments, error } = await supabase
          .from('appointments')
          .select('*')
          .gte('start_time', startOfDay)
          .lt('start_time', endOfDay)
          .order('start_time');

        if (error) {
          console.error("Supabase query error:", error);
          throw error;
        }

        console.log("Existing appointments:", existingAppointments);

        const date = new Date(selectedDate);
        const dayOfWeek = date.getDay();
        const hours = openCloseHours[dayOfWeek];

        if (!hours) {
          console.log("No hours for day:", dayOfWeek);
          setTimeSlots([]);
          return;
        }

        const duration = parseInt(form.getValues("duration_minutes"));
        const availableTimeSlots = generateTimeSlots(
          date,
          existingAppointments || [],
          hours,
          duration
        );

        console.log("Generated time slots:", availableTimeSlots);

        setTimeSlots(availableTimeSlots);
        
        // Only set the first time slot if none is selected
        if (availableTimeSlots.length > 0 && !form.getValues("timeSlot")) {
          form.setValue("timeSlot", availableTimeSlots[0]);
        }
      } catch (error) {
        console.error("Detailed error:", {
          message: error.message,
          error: error,
          stack: error.stack
        });
        alert(`Error fetching time slots: ${error.message}`);
      } finally {
        setLoadingSlots(false);
      }
    },
    [form]
  );

  // Generate time slots
  const generateTimeSlots = (date, existingAppointments, hours, duration) => {
    try {
      const [openHours, openMinutes] = hours.open.split(":").map(Number);
      const [closeHours, closeMinutes] = hours.close.split(":").map(Number);
      const openingTime = openHours * 60 + openMinutes;
      const closingTime = closeHours * 60 + closeMinutes;

      const slots = [];
      let time = openingTime;

      const dateStr = format(date, 'yyyy-MM-dd');

      while (time + duration <= closingTime) {
        const hours = Math.floor(time / 60);
        const minutes = time % 60;
        const slotTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        // Check if the slot is already booked
        const isBooked = existingAppointments.some(appt => {
          const appointmentStart = new Date(appt.start_time);
          const appointmentEnd = new Date(appointmentStart.getTime() + appt.duration_minutes * 60000);
          const slotStart = new Date(`${dateStr}T${slotTime}`);
          const slotEnd = new Date(slotStart.getTime() + duration * 60000);

          return (
            (slotStart >= appointmentStart && slotStart < appointmentEnd) ||
            (slotEnd > appointmentStart && slotEnd <= appointmentEnd)
          );
        });

        if (!isBooked) {
          slots.push(slotTime);
        }
        time += 15; // 15-minute intervals
      }

      return slots;
    } catch (error) {
      console.error("Error generating time slots:", error);
      return [];
    }
  };

  // Handle date and appointment type changes to fetch time slots
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      console.log("Form value changed:", { name, value });
      
      const values = form.getValues();
      if (values.start_time && values.appointment_type) {
        fetchTimeSlots(
          values.start_time,
          {
            type: values.appointment_type,
            durations: [parseInt(values.duration_minutes)]
          }
        );
      }
    });

    // Initial fetch
    const values = form.getValues();
    if (values.start_time && values.appointment_type) {
      console.log("Initial fetch with values:", values);
      fetchTimeSlots(
        values.start_time,
        {
          type: values.appointment_type,
          durations: [parseInt(values.duration_minutes)]
        }
      );
    }

    return () => subscription.unsubscribe();
  }, [fetchTimeSlots]);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      // Combine date and time slot into a single timestamp
      const dateStr = format(data.start_time, 'yyyy-MM-dd');
      const startDateTime = new Date(`${dateStr}T${data.timeSlot}`);

      const appointmentData = {
        client_name: data.client_name,
        phone_number: data.phone_number,
        email: data.email || null,
        appointment_type: data.appointment_type,
        start_time: startDateTime.toISOString(),
        duration_minutes: data.duration_minutes,
        notes: data.notes || null,
      };

      // Insert into Supabase
      const { data: newAppointment, error } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select()
        .single();

      if (error) throw error;

      // Send confirmation email if email is provided
      if (newAppointment.email) {
        try {
          const response = await fetch('/api/sendConfirmation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: newAppointment.email,
              client_name: newAppointment.client_name,
              appointment_type: newAppointment.appointment_type,
              start_time: newAppointment.start_time,
              duration_minutes: newAppointment.duration_minutes,
            }),
          });

          if (!response.ok) {
            console.warn('Failed to send confirmation email');
          }
        } catch (emailError) {
          console.error('Error sending confirmation email:', emailError);
          // Don't throw here - we still want to show success even if email fails
        }
      }

      // Open confirmation modal
      setIsOpen(true);
      form.reset();
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Si è verificato un errore durante la prenotazione.");
    } finally {
      setSubmitting(false);
    }
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div className="m-auto mt-12 w-[90vw] space-y-4 md:w-[70vw]">
      {/* Section Header */}
      <div className="flex flex-col gap-2 py-1 md:gap-4 md:py-4">
        <h4 className="text-xs font-extrabold text-primary">
          CONCEDITI UN MOMENTO DI RELAX
        </h4>
        <h2 className="font-serif text-3xl font-bold tracking-tight md:text-3xl">
          Prenota un appuntamento
        </h2>
      </div>

      {/* Appointment Form */}
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2">
          {/* Date Picker */}
          <div>
            <label htmlFor="start_time">Seleziona data*</label>
            <input
              type="date"
              id="start_time"
              {...form.register("start_time")}
              min={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
              className="w-full p-2 border rounded"
            />
            {form.formState.errors.start_time && (
              <span className="text-red-500">{form.formState.errors.start_time.message}</span>
            )}
          </div>

          {/* Time Slot Selector */}
          <div>
            <label htmlFor="timeSlot">Orario*</label>
            <select
              id="timeSlot"
              {...form.register("timeSlot")}
              className="w-full p-2 border rounded"
              disabled={loadingSlots}
            >
              <option value="">
                {loadingSlots ? "Caricamento orari..." : "Seleziona orario"}
              </option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            {timeSlots.length === 0 && !loadingSlots && (
              <span className="text-yellow-600">
                Nessun orario disponibile per questa data
              </span>
            )}
            {form.formState.errors.timeSlot && (
              <span className="text-red-500">
                {form.formState.errors.timeSlot.message}
              </span>
            )}
          </div>

          {/* Appointment Type */}
          <div>
            <label htmlFor="appointment_type">Tipo di appuntamento*</label>
            <select
              id="appointment_type"
              {...form.register("appointment_type")}
              className="w-full p-2 border rounded"
            >
              {appointmentTypes.map((type) => (
                <option key={type.type} value={type.type}>
                  {type.type}
                </option>
              ))}
            </select>
            {form.formState.errors.appointment_type && (
              <span className="text-red-500">{form.formState.errors.appointment_type.message}</span>
            )}
          </div>

          {/* Note Field */}
          <div>
            <label htmlFor="notes">Note</label>
            <input
              type="text"
              id="notes"
              {...form.register("notes")}
              className="w-full p-2 border rounded"
              placeholder="Note"
            />
          </div>

          {/* Name Field */}
          <div>
            <label htmlFor="client_name">Nome e Cognome*</label>
            <input
              type="text"
              id="client_name"
              {...form.register("client_name")}
              className="w-full p-2 border rounded"
            />
            {form.formState.errors.client_name && (
              <span className="text-red-500">{form.formState.errors.client_name.message}</span>
            )}
          </div>

          {/* Phone Number Field */}
          <div>
            <label htmlFor="phone_number">Numero di telefono*</label>
            <input
              type="tel"
              id="phone_number"
              {...form.register("phone_number", {
                required: "Phone number is required",
                pattern: {
                  value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                  message: "Please enter a valid phone number"
                }
              })}
              className="w-full p-2 border rounded"
              placeholder="+39 XXX XXX XXXX"
            />
            {form.formState.errors.phone_number && (
              <span className="text-red-500">{form.formState.errors.phone_number.message}</span>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email">Email (opzionale)</label>
            <input
              type="email"
              id="email"
              {...form.register("email")}
              className="w-full p-2 border rounded"
            />
            {form.formState.errors.email && (
              <span className="text-red-500">{form.formState.errors.email.message}</span>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="mt-3 px-4 py-2 bg-primary rounded disabled:opacity-50"
        >
          {submitting ? "Prenotando..." : "Prenota appuntamento"}
        </button>
      </form>

      {/* Booking Confirmation Modal */}
      {modalIsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className=" p-4 rounded">
            <h2>Prenotazione Confermata</h2>
            <button onClick={closeModal}>Chiudi</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentForm;
