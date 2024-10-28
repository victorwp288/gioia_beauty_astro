// src/components/TimeSlotSelector.jsx

import React from "react";
import { Clock } from "lucide-react";

const TimeSlotSelector = ({
  timeSlots,
  selectedTimeSlot,
  setSelectedTimeSlot,
  showAllTimeSlots,
  setShowAllTimeSlots,
  initialVisibleSlots,
  loading,
}) => {
  return (
    <div className="space-y-4">
      <label className="mb-3 flex items-center gap-2 text-sm font-medium">
        <Clock className="h-5 w-5 text-primary" />
        Seleziona orario*
      </label>
      
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2 rounded-lg border p-5">
          {loading ? (
            <p>Caricamento orari...</p>
          ) : (
            (showAllTimeSlots
              ? timeSlots
              : timeSlots.slice(0, initialVisibleSlots)
            ).map((time, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedTimeSlot(time)}
                className={`cursor-pointer rounded-full border p-2 text-center hover:bg-primary hover:text-white ${
                  time === selectedTimeSlot ? "bg-primary text-white" : ""
                }`}
              >
                {time}
              </button>
            ))
          )}
        </div>
        
        {timeSlots.length > initialVisibleSlots && !loading && (
          <button
            type="button"
            className="w-full rounded-md border p-2 hover:bg-gray-50"
            onClick={() => setShowAllTimeSlots(!showAllTimeSlots)}
          >
            {showAllTimeSlots
              ? "Mostra meno"
              : `Mostra più (${timeSlots.length - initialVisibleSlots} altri)`}
          </button>
        )}
      </div>
    </div>
  );
};

export default TimeSlotSelector;
