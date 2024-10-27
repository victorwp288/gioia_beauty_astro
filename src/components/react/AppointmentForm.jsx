import React, { useEffect, useState, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { format, isBefore, addDays } from "date-fns";
import appointmentTypesData from "../../../data/appointmentTypes.json";

// Define the zod schema
const formSchema = z.object({
  date: z.date(),
  note: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  number: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address").optional(),
  timeSlot: z.string().min(1, "Time slot is required"),
  appointmentType: z.string().min(1, "Appointment type is required"),
  variant: z.string().optional(),
  duration: z.number().min(1, "Duration is required"),
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
      date: null,
      note: "",
      name: "",
      number: "",
      email: "",
      timeSlot: "",
      appointmentType: appointmentTypes[0].type,
      variant: "",
      duration: appointmentTypes[0].durations[0],
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
    async (date, appointmentType) => {
      if (!date || !appointmentType) {
        setTimeSlots([]);
        return;
      }

      const dayOfWeek = date.getDay();
      const hours = openCloseHours[dayOfWeek];

      if (!hours) {
        setTimeSlots([]);
        return; // Closed day, no available slots
      }

      setLoadingSlots(true);

      try {
        // Fetch existing appointments for the selected date
        const response = await fetch(
          `/api/fetchAppointments?date=${format(date, "yyyy-MM-dd")}`
        );
        const existingAppointments = await response.json();

        const availableTimeSlots = generateTimeSlots(
          date,
          existingAppointments,
          hours,
          appointmentType.durations.find((d) => d === form.getValues("duration")) || appointmentType.durations[0]
        );

        setTimeSlots(availableTimeSlots);
        if (availableTimeSlots.length > 0) {
          setSelectedTimeSlot(availableTimeSlots[0]);
          form.setValue("timeSlot", availableTimeSlots[0]);
        } else {
          // Handle no available slots
          alert("No available time slots for the selected date.");
          form.setValue("timeSlot", "");
        }
      } catch (error) {
        console.error("Error fetching time slots:", error);
        alert("An error occurred while fetching time slots.");
      } finally {
        setLoadingSlots(false);
      }
    },
    [form]
  );

  // Generate time slots
  const generateTimeSlots = (date, existingAppointments, hours, duration) => {
    const [openHours, openMinutes] = hours.open.split(":").map(Number);
    const [closeHours, closeMinutes] = hours.close.split(":").map(Number);
    const openingTime = openHours * 60 + openMinutes;
    const closingTime = closeHours * 60 + closeMinutes;

    const slots = [];
    let time = openingTime;

    while (time + duration <= closingTime) {
      const slotTime = format(new Date(date.setHours(0, 0, 0, 0) + time * 60000), "HH:mm");
      // Check if the slot is already booked
      const isBooked = existingAppointments.some((appt) => appt.timeSlot === slotTime);
      if (!isBooked) {
        slots.push(slotTime);
      }
      time += 15; // Increment by 15 minutes
    }

    return slots;
  };

  // Handle date and appointment type changes to fetch time slots
  useEffect(() => {
    const subscription = form.watch(({ date, appointmentType, duration }) => {
      if (date && appointmentType && duration) {
        fetchTimeSlots(date, { type: appointmentType, durations: [duration] });
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, fetchTimeSlots]);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      const response = await fetch("/api/bookAppointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          date: data.date.toISOString(),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Open confirmation modal
        setIsOpen(true);
        form.reset();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("An error occurred while booking your appointment.");
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
            <label htmlFor="date">Seleziona data*</label>
            <input
              type="date"
              id="date"
              {...form.register("date")}
              min={addDays(new Date(), 1).toISOString().split('T')[0]}
              className="w-full p-2 border rounded"
            />
            {form.formState.errors.date && (
              <span className="text-red-500">{form.formState.errors.date.message}</span>
            )}
          </div>

          {/* Time Slot Selector */}
          <div>
            <label htmlFor="timeSlot">Orario*</label>
            <select
              id="timeSlot"
              {...form.register("timeSlot")}
              className="w-full p-2 border rounded"
            >
              <option value="">Seleziona orario</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            {form.formState.errors.timeSlot && (
              <span className="text-red-500">{form.formState.errors.timeSlot.message}</span>
            )}
          </div>

          {/* Appointment Type */}
          <div>
            <label htmlFor="appointmentType">Tipo di appuntamento*</label>
            <select
              id="appointmentType"
              {...form.register("appointmentType")}
              className="w-full p-2 border rounded"
            >
              {appointmentTypes.map((type) => (
                <option key={type.type} value={type.type}>
                  {type.type}
                </option>
              ))}
            </select>
            {form.formState.errors.appointmentType && (
              <span className="text-red-500">{form.formState.errors.appointmentType.message}</span>
            )}
          </div>

          {/* Note Field */}
          <div>
            <label htmlFor="note">Note</label>
            <input
              type="text"
              id="note"
              {...form.register("note")}
              className="w-full p-2 border rounded"
              placeholder="Note"
            />
          </div>

          {/* Name Field */}
          <div>
            <label htmlFor="name">Nome e Cognome*</label>
            <input
              type="text"
              id="name"
              {...form.register("name")}
              className="w-full p-2 border rounded"
            />
            {form.formState.errors.name && (
              <span className="text-red-500">{form.formState.errors.name.message}</span>
            )}
          </div>

          {/* Phone Number Field */}
          <div>
            <label htmlFor="number">Numero di telefono*</label>
            <input
              type="tel"
              id="number"
              {...form.register("number", {
                required: "Phone number is required",
                pattern: {
                  value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                  message: "Please enter a valid phone number"
                }
              })}
              className="w-full p-2 border rounded"
              placeholder="+39 XXX XXX XXXX"
            />
            {form.formState.errors.number && (
              <span className="text-red-500">{form.formState.errors.number.message}</span>
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
