import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Optional: State for error and loading messages
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      // Optionally, redirect or inform the user to check their email
      window.location.href = "/login";
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSignup} className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Sign Up</h2>

      {error && (
        <div className="p-2 text-red-600 bg-red-100 border border-red-200 rounded">
          {error}
        </div>
      )}

      {/* Email and password inputs similar to LoginForm */}

      <button
        type="submit"
        className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Signing up..." : "Sign Up"}
      </button>
    </form>
  );
}

export default SignupForm;
