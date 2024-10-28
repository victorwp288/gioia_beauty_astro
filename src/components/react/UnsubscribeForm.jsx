import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const UnsubscribeForm = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      // Check if email exists
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('email', email)
        .select();

      if (error) throw error;

      if (data?.length === 0) {
        setStatus('Email not found in our newsletter list.');
      } else {
        setStatus('You have been successfully unsubscribed.');
        setEmail('');
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Unsubscribe from Newsletter</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Unsubscribe'}
        </button>
        {status && (
          <p className={`text-center ${
            status.includes('success') ? 'text-green-600' : 'text-red-600'
          }`}>
            {status}
          </p>
        )}
      </form>
    </div>
  );
};

export default UnsubscribeForm;
