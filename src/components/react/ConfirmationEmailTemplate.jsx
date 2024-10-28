import * as React from "react";

export const ConfirmationEmailTemplate = ({
  name,
  date,
  startTime,
  duration,
  appointmentType
}) => (
  <div>
    <h1>Gentile {name},</h1>
    <p>Il tuo appuntamento è stato confermato.</p>
    <p>
      <strong>Tipo di appuntamento:</strong> {appointmentType}
    </p>
    <p>
      <strong>Data:</strong> {date}
    </p>
    <p>
      <strong>Ora:</strong> {startTime}
    </p>
    <p>
      <strong>Durata:</strong> {duration} minuti
    </p>
    <p>Ti aspettiamo!</p>
    <p>
      Se hai bisogno di cancellare o modificare l'appuntamento, contattaci direttamente.
    </p>
    <p>
      <i>Non è possibile rispondere a questa mail.</i>
    </p>
  </div>
);

export default ConfirmationEmailTemplate;

