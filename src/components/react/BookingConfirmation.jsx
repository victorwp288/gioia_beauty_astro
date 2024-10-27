// src/components/BookingConfirmation.jsx

import React from "react";
import Modal from "react-modal";
import { Button } from "@/components/ui/button";

Modal.setAppElement("#__astro"); // Ensure accessibility by setting the root element

const BookingConfirmation = ({ isOpen, onRequestClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Booking Confirmation"
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      overlayClassName="fixed inset-0"
    >
      <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Appuntamento Confermato</h2>
        <p className="mb-4">
          Grazie per aver prenotato un appuntamento con noi! Ti abbiamo inviato
          una conferma via email.
        </p>
        <Button onClick={onRequestClose} className="w-full">
          Chiudi
        </Button>
      </div>
    </Modal>
  );
};

export default BookingConfirmation;
