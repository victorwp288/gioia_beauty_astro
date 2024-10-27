import React, { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { supabase } from "../../lib/supabaseClient";

const Dashboard = () => {
  const { session, user } = useContext(AuthContext);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (!session || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome to the Dashboard, {user.email}</h1>
      <button
        onClick={handleLogout}
        className="px-4 py-2 mt-4 font-bold text-white bg-blue-600 rounded hover:bg-blue-700"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
