import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Calendar from "react-calendar";
import { format } from "date-fns";
import "react-calendar/dist/Calendar.css";

const Dashboard = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [fetchingAppointments, setFetchingAppointments] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);

  useEffect(() => {
    // Check current session
    const checkSession = async () => {
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();
        console.log("Current session:", currentSession);

        if (!currentSession) {
          console.log("No session found, redirecting to login");
          window.location.replace("/login");
          return;
        }

        setSession(currentSession);
      } catch (error) {
        console.error("Session check error:", error);
        window.location.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("Auth state changed:", event, newSession);
      if (!newSession) {
        window.location.replace("/login");
        return;
      }
      setSession(newSession);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch appointments for selected date
  useEffect(() => {
    const fetchAppointments = async () => {
      setFetchingAppointments(true);
      try {
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

        const { data, error } = await supabase
          .from("appointments")
          .select("*")
          .gte("start_time", startOfDay.toISOString())
          .lt("start_time", endOfDay.toISOString())
          .order("start_time", { ascending: true });

        if (error) throw error;
        setAppointments(data || []);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setFetchingAppointments(false);
      }
    };

    if (selectedDate) {
      fetchAppointments();
    }
  }, [selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.replace("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleDeleteClick = (appointment) => {
    setAppointmentToDelete(appointment);
    setDeleteModalOpen(true);
  };
  
  const sendConfirmationEmail = async (appointment) => {
    try {
      const response = await fetch("/api/sendConfirmation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: appointment.email,
          client_name: appointment.client_name,
          appointment_type: appointment.appointment_type,
          start_time: appointment.start_time,
          duration_minutes: appointment.duration_minutes,
        }),
      });

      const result = await response.json();
      console.log("Confirmation email response:", result);

      if (!response.ok) {
        throw new Error(result.message || "Failed to send confirmation email");
      }

      return true;
    } catch (error) {
      console.error("Confirmation email error:", error);
      return false;
    }
  };
  const sendCancellationEmail = async (appointment) => {
    try {
      // Send the raw appointment data
      const response = await fetch("/api/sendCancellation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: appointment.email,
          client_name: appointment.client_name,
          appointment_type: appointment.appointment_type,
          start_time: appointment.start_time,
          duration_minutes: appointment.duration_minutes,
        }),
      });

      const result = await response.json();
      console.log("Server response:", result);

      if (!response.ok) {
        throw new Error(result.message || "Failed to send email");
      }

      return true;
    } catch (error) {
      console.error("Email sending error:", error);
      return false;
    }
  };

  const handleConfirmDelete = async () => {
    if (!appointmentToDelete) return;

    try {
      if (appointmentToDelete.email) {
        const emailSent = await sendCancellationEmail(appointmentToDelete);
        if (
          !emailSent &&
          !confirm(
            "Failed to send notification email. Continue with cancellation?"
          )
        ) {
          return;
        }
      }

      // Archive appointment
      const { error: archiveError } = await supabase
        .from("archived_appointments")
        .insert([
          {
            client_name: appointmentToDelete.client_name,
            phone_number: appointmentToDelete.phone_number,
            email: appointmentToDelete.email,
            notes: appointmentToDelete.notes,
            appointment_type: appointmentToDelete.appointment_type,
            start_time: appointmentToDelete.start_time,
            duration_minutes: appointmentToDelete.duration_minutes,
            archived_at: new Date().toISOString(),
            archived_by: session.user.email,
          },
        ]);

      if (archiveError) throw archiveError;

      // Delete from appointments
      const { error: deleteError } = await supabase
        .from("appointments")
        .delete()
        .match({ id: appointmentToDelete.id });

      if (deleteError) throw deleteError;

      // Update UI
      setAppointments(
        appointments.filter((app) => app.id !== appointmentToDelete.id)
      );
      setDeleteModalOpen(false);
      setAppointmentToDelete(null);

      alert(
        "Appuntamento archiviato con successo" +
          (appointmentToDelete.email ? " e email di notifica inviata" : "")
      );
    } catch (error) {
      console.error("Error in archive process:", error);
      alert("Errore durante la cancellazione dell'appuntamento");
    }
  };

  const DeleteConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Confirm Archive</h3>
        <p className="mb-6">
          Are you sure you want to archive the appointment for{" "}
          <span className="font-semibold">
            {appointmentToDelete?.client_name}
          </span>{" "}
          on{" "}
          {appointmentToDelete &&
            format(
              new Date(appointmentToDelete.start_time),
              "dd/MM/yyyy HH:mm"
            )}
          ?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => {
              setDeleteModalOpen(false);
              setAppointmentToDelete(null);
            }}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Archive
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!session?.user) {
    return <div className="p-4">Redirecting to login...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {session.user.email}</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Calendar Section */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Calendar</h2>
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            className="w-full"
          />
        </div>

        {/* Updated Appointments List Section */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Appointments for {format(selectedDate, "dd/MM/yyyy")}
          </h2>

          {fetchingAppointments ? (
            <div className="text-center py-4">Loading appointments...</div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No appointments for this date
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="border p-4 rounded-lg hover:bg-gray-50 relative"
                >
                  <button
                    onClick={() => handleDeleteClick(appointment)}
                    className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                    title="Archive appointment"
                  >
                    ×
                  </button>
                  <div className="flex justify-between items-start pr-8">
                    <div>
                      <h3 className="font-semibold">
                        {appointment.client_name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {format(new Date(appointment.start_time), "HH:mm")} -
                        {format(
                          new Date(
                            new Date(appointment.start_time).getTime() +
                              appointment.duration_minutes * 60000
                          ),
                          "HH:mm"
                        )}
                      </p>
                      <p className="text-sm">{appointment.appointment_type}</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>{appointment.phone_number}</p>
                      <p>{appointment.email}</p>
                    </div>
                  </div>
                  {appointment.notes && (
                    <p className="mt-2 text-sm text-gray-600">
                      Notes: {appointment.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {deleteModalOpen && <DeleteConfirmationModal />}
    </div>
  );
};

export default Dashboard;
