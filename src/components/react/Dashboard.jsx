import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Calendar from "react-calendar";
import { format } from "date-fns";
import "react-calendar/dist/Calendar.css";
import appointmentTypesData from "../../../data/appointmentTypes.json"; // Add this line
import SubscriberList from "./SubscriberList";

const Dashboard = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [fetchingAppointments, setFetchingAppointments] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [vacationModalOpen, setVacationModalOpen] = useState(false);
  const [vacationPeriods, setVacationPeriods] = useState([]);
  const [regularCustomers, setRegularCustomers] = useState([]);
  const [regularCustomerModalOpen, setRegularCustomerModalOpen] =
    useState(false);

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

  useEffect(() => {
    const fetchVacations = async () => {
      const { data, error } = await supabase
        .from("vacation_periods")
        .select("*")
        .gte("end_date", new Date().toISOString());

      if (!error && data) {
        setVacationPeriods(data);
      } else {
        console.error("Error fetching vacations:", error);
      }
    };

    fetchVacations();
  }, []);

  useEffect(() => {
    const fetchRegularCustomers = async () => {
      const { data, error } = await supabase
        .from("regular_customers")
        .select("*")
        .order("name");

      if (!error && data) {
        setRegularCustomers(data);
      }
    };

    fetchRegularCustomers();
  }, []);

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

  const handleDeleteVacation = async (vacationId) => {
    if (!confirm("Are you sure you want to delete this vacation period?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("vacation_periods")
        .delete()
        .eq("id", vacationId);

      if (error) throw error;

      // Update local state
      setVacationPeriods((prev) => prev.filter((v) => v.id !== vacationId));
      alert("Vacation period deleted successfully");
    } catch (error) {
      console.error("Error deleting vacation:", error);
      alert("Error deleting vacation period");
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

  const CreateAppointmentModal = () => {
    const [formData, setFormData] = useState({
      client_name: "",
      phone_number: "",
      email: "",
      appointment_type: appointmentTypesData[0]?.type || "",
      start_time: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      duration_minutes: appointmentTypesData[0]?.durations[0] || 60,
      notes: "",
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleCustomerSearch = (value) => {
      setSearchTerm(value);
      if (value.length > 1) {
        const filtered = regularCustomers.filter(customer =>
          customer.name.toLowerCase().includes(value.toLowerCase())
        );
        setSearchResults(filtered);
        setIsDropdownOpen(true);
      } else {
        setSearchResults([]);
        setIsDropdownOpen(false);
      }
    };

    const toggleDropdown = () => {
      setIsDropdownOpen(!isDropdownOpen);
      if (!isDropdownOpen) {
        setSearchResults(regularCustomers);
      } else {
        setSearchResults([]);
      }
    };

    const handleCustomerSelect = (customer) => {
      setFormData(prev => ({
        ...prev,
        client_name: customer.name,
        phone_number: customer.phone_number || '',
        email: customer.email || '',
        notes: customer.notes || ''
      }));
      setSearchTerm(customer.name);
      setSearchResults([]);
      setIsDropdownOpen(false);
    };

    const handleAppointmentTypeChange = (e) => {
      const newType = e.target.value;
      const typeData = appointmentTypesData.find((t) => t.type === newType);
      setFormData((prev) => ({
        ...prev,
        appointment_type: newType,
        duration_minutes: typeData?.durations[0] || 60,
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setCreating(true);

      try {
        const { data, error } = await supabase
          .from("appointments")
          .insert([
            {
              ...formData,
              start_time: new Date(formData.start_time).toISOString(),
            },
          ])
          .select()
          .single();

        if (error) throw error;

        // Send confirmation email
        if (formData.email) {
          await fetch("/api/sendConfirmation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: data.email,
              client_name: data.client_name,
              appointment_type: data.appointment_type,
              start_time: data.start_time,
              duration_minutes: data.duration_minutes,
            }),
          });
        }

        setAppointments((prev) => [...prev, data]);
        setCreateModalOpen(false);
        alert("Appointment created successfully");
      } catch (error) {
        console.error("Error creating appointment:", error);
        alert("Error creating appointment");
      } finally {
        setCreating(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
          <h3 className="text-xl font-bold mb-6">Create New Appointment</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Search Customer</h4>
              <div className="relative">
                <input
                  type="text"
                  className="w-full p-2 border rounded-md pr-8"
                  value={searchTerm}
                  onChange={(e) => handleCustomerSearch(e.target.value)}
                  placeholder="Search regular customers..."
                  onClick={() => setIsDropdownOpen(true)}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={toggleDropdown}
                >
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                      isDropdownOpen ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {(searchResults.length > 0 || isDropdownOpen) && (
                  <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
                    {searchResults.map(customer => (
                      <div
                        key={customer.id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleCustomerSelect(customer)}
                      >
                        <div>{customer.name}</div>
                        {(customer.phone_number || customer.email) && (
                          <div className="text-sm text-gray-500">
                            {customer.phone_number && <span>{customer.phone_number}</span>}
                            {customer.phone_number && customer.email && <span> • </span>}
                            {customer.email && <span>{customer.email}</span>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Client Name</h4>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={formData.client_name}
                onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
              />
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Phone Number</h4>
              <input
                type="tel"
                className="w-full p-2 border rounded-md"
                value={formData.phone_number}
                onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
              />
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Email</h4>
              <input
                type="email"
                className="w-full p-2 border rounded-md"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Appointment Type</h4>
              <select
                className="w-full p-2 border rounded-md"
                value={formData.appointment_type}
                onChange={handleAppointmentTypeChange}
              >
                {appointmentTypesData.map(type => (
                  <option key={type.id} value={type.type}>
                    {type.type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Start Time</h4>
              <input
                type="datetime-local"
                className="w-full p-2 border rounded-md"
                value={formData.start_time}
                onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
              />
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Notes</h4>
              <textarea
                className="w-full p-2 border rounded-md"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={() => setCreateModalOpen(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create Appointment
            </button>
          </div>
        </div>
      </div>
    );
  };

  const VacationModal = () => {
    const [dates, setDates] = useState({
      start_date: "",
      end_date: "",
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        // Get the current user's ID and log all the data
        const {
          data: { user },
        } = await supabase.auth.getUser();
        console.log("Current user data:", user); // Debug log

        if (!user) throw new Error("No user found");

        // Create the vacation period
        const vacationData = {
          start_date: new Date(dates.start_date).toISOString(),
          end_date: new Date(dates.end_date + "T23:59:59").toISOString(),
        };

        console.log("Inserting vacation data:", vacationData); // Debug log

        const { error } = await supabase
          .from("vacation_periods")
          .insert([vacationData]);

        if (error) throw error;
        setVacationModalOpen(false);
        alert("Vacation period added successfully");
      } catch (error) {
        console.error("Error adding vacation period:", error);
        alert("Error adding vacation period");
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold mb-4">Add Vacation Period</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                required
                min={format(new Date(), "yyyy-MM-dd")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={dates.start_date}
                onChange={(e) =>
                  setDates((prev) => ({ ...prev, start_date: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                required
                min={dates.start_date || format(new Date(), "yyyy-MM-dd")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={dates.end_date}
                onChange={(e) =>
                  setDates((prev) => ({ ...prev, end_date: e.target.value }))
                }
              />
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={() => setVacationModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add Vacation
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const RegularCustomerModal = () => {
    const [formData, setFormData] = useState({
      name: "",
      phone_number: "",
      email: "",
      notes: "",
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const { data, error } = await supabase
          .from("regular_customers")
          .insert([formData])
          .select()
          .single();

        if (error) throw error;

        setRegularCustomers((prev) => [...prev, data]);
        setRegularCustomerModalOpen(false);
        alert("Regular customer added successfully");
      } catch (error) {
        console.error("Error adding regular customer:", error);
        alert("Error adding regular customer");
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold mb-4">Add Regular Customer</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.phone_number}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    phone_number: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
              />
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={() => setRegularCustomerModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add Customer
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const RegularCustomersSection = () => {
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [editFormData, setEditFormData] = useState({
      name: "",
      phone_number: "",
      email: "",
      notes: "",
    });

    const handleEditClick = (customer) => {
      setEditingCustomer(customer);
      setEditFormData({
        name: customer.name,
        phone_number: customer.phone_number || "",
        email: customer.email || "",
        notes: customer.notes || "",
      });
    };

    const handleEditSubmit = async (e) => {
      e.preventDefault();
      try {
        const { data, error } = await supabase
          .from("regular_customers")
          .update(editFormData)
          .eq("id", editingCustomer.id)
          .select()
          .single();

        if (error) throw error;

        setRegularCustomers((prev) =>
          prev.map((customer) =>
            customer.id === editingCustomer.id ? data : customer
          )
        );
        setEditingCustomer(null);
        alert("Customer updated successfully");
      } catch (error) {
        console.error("Error updating customer:", error);
        alert("Error updating customer");
      }
    };

    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Regular Customers</h2>
          <button
            onClick={() => setRegularCustomerModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Regular Customer
          </button>
        </div>

        <div className="space-y-4">
          {regularCustomers.map((customer) => (
            <div
              key={customer.id}
              className="border p-4 rounded-lg hover:bg-gray-50 relative"
            >
              {editingCustomer?.id === customer.id ? (
                <form onSubmit={handleEditSubmit} className="space-y-3">
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={editFormData.name}
                    onChange={(e) =>
                      setEditFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                  />
                  <input
                    type="tel"
                    className="w-full p-2 border rounded"
                    value={editFormData.phone_number}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        phone_number: e.target.value,
                      }))
                    }
                  />
                  <input
                    type="email"
                    className="w-full p-2 border rounded"
                    value={editFormData.email}
                    onChange={(e) =>
                      setEditFormData((prev) => ({ ...prev, email: e.target.value }))
                    }
                  />
                  <textarea
                    className="w-full p-2 border rounded"
                    value={editFormData.notes}
                    onChange={(e) =>
                      setEditFormData((prev) => ({ ...prev, notes: e.target.value }))
                    }
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setEditingCustomer(null)}
                      className="px-3 py-1 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Save
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <button
                    onClick={() => handleEditClick(customer)}
                    className="absolute top-2 right-2 p-2 text-gray-400 hover:text-blue-600"
                    title="Edit customer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                  <h3 className="font-semibold">{customer.name}</h3>
                  <p className="text-sm text-gray-600">{customer.phone_number}</p>
                  <p className="text-sm text-gray-600">{customer.email}</p>
                  {customer.notes && (
                    <p className="mt-2 text-sm text-gray-600">
                      Notes: {customer.notes}
                    </p>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!session?.user) {
    return <div className="p-4">Redirecting to login...</div>;
  }

  return (
    <div className="p-4 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl bg-blue-600 text-white font-bold">
            Welcome, {session.user.email}
          </h1>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-4 py-2 font-bold text-white bg-green-600 rounded hover:bg-green-700"
          >
            Create Appointment
          </button>
          <button
            onClick={() => setVacationModalOpen(true)}
            className="px-4 py-2 font-bold text-white bg-purple-600 rounded hover:bg-purple-700"
          >
            Add Vacation
          </button>
        </div>
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

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Vacation Periods</h2>
          <button
            onClick={() => setVacationModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Vacation
          </button>
        </div>

        <div className="space-y-4">
          {vacationPeriods.map((vacation) => (
            <div
              key={vacation.id}
              className="border p-4 rounded-lg hover:bg-gray-50 relative"
            >
              <button
                onClick={() => handleDeleteVacation(vacation.id)}
                className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                title="Delete vacation period"
              >
                ×
              </button>
              <div className="pr-8">
                <p className="text-sm text-gray-600">
                  From: {format(new Date(vacation.start_date), "dd/MM/yyyy")}
                </p>
                <p className="text-sm text-gray-600">
                  To: {format(new Date(vacation.end_date), "dd/MM/yyyy")}
                </p>
              </div>
            </div>
          ))}
          {vacationPeriods.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No vacation periods scheduled
            </p>
          )}
        </div>
      </div>

      {deleteModalOpen && <DeleteConfirmationModal />}
      {createModalOpen && <CreateAppointmentModal />}
      {vacationModalOpen && <VacationModal />}
      {regularCustomerModalOpen && <RegularCustomerModal />}
      <div>
        <SubscriberList />
      </div>
      <div className="mt-8">
        <RegularCustomersSection />
      </div>
    </div>
  );
};

export default Dashboard;
