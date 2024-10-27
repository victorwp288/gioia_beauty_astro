import React, { useContext, useEffect } from "react";
import { AuthContext } from "./AuthProvider";

const ProtectedRoute = ({ children }) => {
  const { session } = useContext(AuthContext);

  useEffect(() => {
    if (session === null) {
      window.location.href = "/login";
    }
  }, [session]);

  if (session === null) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
