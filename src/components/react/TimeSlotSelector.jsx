// src/components/TimeSlotSelector.jsx

import React from "react";
import { Clock } from "lucide-react";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

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
    <FormItem>
      <FormLabel className="mb-3 flex items-center gap-2">
        <Clock className="h-5 w-5 text-primary" />
        Seleziona orario*
      </FormLabel>
      <FormControl>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2 rounded-lg border p-5">
            {loading ? (
              <p>Caricamento orari...</p>
            ) : (
              (showAllTimeSlots
                ? timeSlots
                : timeSlots.slice(0, initialVisibleSlots)
              ).map((time, index) => (
                <h2
                  key={index}
                  onClick={() => setSelectedTimeSlot(time)}
                  className={`cursor-pointer rounded-full border p-2 text-center hover:bg-primary hover:text-white ${
                    time === selectedTimeSlot && "bg-primary text-white"
                  }`}
                >
                  {time}
                </h2>
              ))
            )}
          </div>
          {timeSlots.length > initialVisibleSlots && !loading && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setShowAllTimeSlots(!showAllTimeSlots)}
            >
              {showAllTimeSlots
                ? "Mostra meno"
                : `Mostra più (${
                    timeSlots.length - initialVisibleSlots
                  } altri)`}
            </Button>
          )}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default TimeSlotSelector;
