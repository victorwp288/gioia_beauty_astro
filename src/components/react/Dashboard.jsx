import React, { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { supabase } from "../../lib/supabaseClient";

const Dashboard = () => {
  const { session } = useContext(AuthContext);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div>
      <h1>Welcome to the Dashboard, {session.user.email}</h1>
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
