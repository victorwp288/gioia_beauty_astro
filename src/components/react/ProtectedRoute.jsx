import React, { useContext, useEffect } from "react";
import { AuthContext } from "./AuthProvider";
import { supabase } from "../../lib/supabaseClient";

const ProtectedRoute = ({ children }) => {
  const { session } = useContext(AuthContext);

  useEffect(() => {
    if (!session) {
      window.location.href = "/login";
    }
  }, [session]);

  if (!session) {
    return <p>Loading...</p>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
