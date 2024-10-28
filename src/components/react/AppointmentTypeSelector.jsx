// src/components/AppointmentTypeSelector.jsx

import React from "react";

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
    <div className="space-y-4">
      {/* Appointment Type */}
      <div className="flex flex-col gap-2">
        <label htmlFor="appointmentType" className="text-sm font-medium">
          Trattamento*
        </label>
        <select
          id="appointmentType"
          className="w-full rounded-md border p-2"
          value={selectedType}
          onChange={(e) => setAppointmentType(e.target.value)}
        >
          {appointmentTypes.map((appointmentType) => (
            <option key={appointmentType.id} value={appointmentType.type}>
              {appointmentType.type}
            </option>
          ))}
        </select>
      </div>

      {/* Variant Selector */}
      {selectedAppointment?.durations.length > 1 && (
        <div className="flex flex-col gap-2">
          <label htmlFor="variant" className="text-sm font-medium">
            Durata del trattamento
          </label>
          <select
            id="variant"
            className="w-full rounded-md border p-2"
            value={selectedVariant}
            onChange={(e) => setSelectedVariant(e.target.value)}
          >
            <option value="">Seleziona durata</option>
            {selectedAppointment.durations.map((duration, index) => (
              <option key={index} value={duration}>
                {duration} minuti
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default AppointmentTypeSelector;
