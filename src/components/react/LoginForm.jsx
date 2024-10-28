import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check auth state on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log("User already logged in, redirecting...");
        window.location.href = "/admin";
      }
    };
    
    checkAuth();
  }, []);

  // Subscribe to auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      if (session) {
        window.location.href = "/admin";
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login attempt started...");
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        setError(error.message);
        return;
      }

      if (data?.session) {
        console.log("Login successful, session established");
        // Wait a brief moment to ensure session is properly set
        setTimeout(() => {
          window.location.replace("/admin");
        }, 500);
      } else {
        setError("No session created after login");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Login</h2>

      {error && (
        <div className="p-2 text-red-600 bg-red-100 border border-red-200 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          type="email"
          id="email"
          className="w-full p-2 mt-1 border border-gray-300 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          type="password"
          id="password"
          className="w-full p-2 mt-1 border border-gray-300 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}

export default LoginForm;
