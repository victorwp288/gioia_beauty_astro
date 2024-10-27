// src/components/NewsletterSignup.jsx

import React, { useState } from "react";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter signup logic here
    // For demonstration, we'll show a success message
    setMessage("Iscrizione avvenuta con successo!");
    setEmail("");
  };

  return (
    <div className="w-full bg-rose-200 mt-16 py-12 text-center">
      <div className="max-w-md mx-auto mt-10 md:w-full md:mt-0">
        <div className="text-white px-4 pt-6">
          <h2 className="font-bold text-2xl pb-4">Newsletter</h2>
          <p className="text-sm">
            Per rimanere aggiornato sulle offerte e promozioni, puoi iscriverti
            alla newsletter mensile che, ogni primo giorno del mese, arriverà
            nella tua casella di posta.
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 container mt-12"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Inserisci la tua mail"
            required
            className="bg-primary placeholder-white text-white p-2 rounded"
          />
          <button
            className="text-primary inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:shadow disabled:pointer-events-none disabled:opacity-50 bg-white hover:bg-gray-100 h-10 px-4 py-2 mt-3"
            type="submit"
          >
            Iscriviti alla newsletter
          </button>
        </form>
        {message && <div className="mt-4 text-white">{message}</div>}
      </div>
    </div>
  );
};

export default NewsletterSignup;
