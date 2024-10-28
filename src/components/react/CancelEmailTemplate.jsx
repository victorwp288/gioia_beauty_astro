import * as React from "react";

export const CancelEmailTemplate = ({
  name,
  date,
  startTime,
  duration,
  appointmentType
}) => (
  <div>
    <h1>Gentile {name},</h1>
    <p>Il tuo appuntamento per il {date} è stato cancellato.</p>
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
    <p>Ci scusiamo per l'incovenienza.</p>
    <p>
      <i>Non è possibile rispondere a questa mail.</i>
    </p>
  </div>
);

export default CancelEmailTemplate;
