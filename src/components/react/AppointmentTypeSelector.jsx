// src/components/AppointmentTypeSelector.jsx

import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const AppointmentTypeSelector = ({
  appointmentTypes,
  selectedType,
  setAppointmentType,
  selectedVariant,
  setSelectedVariant,
}) => {
  const selectedAppointment = appointmentTypes.find(
    (type) => type.type === selectedType
  );

  return (
    <>
      {/* Appointment Type */}
      <FormField
        name="appointmentType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Trattamento*</FormLabel>
            <FormControl>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                {...field}
                onChange={(e) => {
                  setAppointmentType(e.target.value);
                  field.onChange(e.target.value);
                }}
              >
                {appointmentTypes.map((appointmentType) => (
                  <option key={appointmentType.id} value={appointmentType.type}>
                    {appointmentType.type}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Variant Selector */}
      {selectedAppointment.durations.length > 1 && (
        <FormField
          name="variant"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Durata del trattamento</FormLabel>
              <FormControl>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  {...field}
                  onChange={(e) => {
                    setSelectedVariant(e.target.value);
                    field.onChange(e.target.value);
                  }}
                >
                  <option value="">Seleziona durata</option>
                  {selectedAppointment.durations.map((duration, index) => (
                    <option key={index} value={duration}>
                      {duration} minuti
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
};

export default AppointmentTypeSelector;
