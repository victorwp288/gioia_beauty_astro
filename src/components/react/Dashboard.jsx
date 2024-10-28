import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

const Dashboard = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log('Current session:', currentSession);
        
        if (!currentSession) {
          console.log('No session found, redirecting to login');
          window.location.replace('/login');
          return;
        }
        
        setSession(currentSession);
      } catch (error) {
        console.error('Session check error:', error);
        window.location.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log('Auth state changed:', event, newSession);
      if (!newSession) {
        window.location.replace('/login');
        return;
      }
      setSession(newSession);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!session?.user) {
    return <div className="p-4">Redirecting to login...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Welcome to the Dashboard, {session.user.email}
      </h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Session Info:</h2>
        <pre className="bg-gray-100 p-2 rounded">
          {JSON.stringify({
            email: session.user.email,
            id: session.user.id,
            role: session.user.role
          }, null, 2)}
        </pre>
      </div>
      <button
        onClick={handleLogout}
        className="px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
