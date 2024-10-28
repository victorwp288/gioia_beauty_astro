import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const SubscriberList = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [subscriberToDelete, setSubscriberToDelete] = useState(null);

  // Fetch subscribers
  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const { data, error } = await supabase
          .from('newsletter_subscribers')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setSubscribers(data || []);
      } catch (error) {
        console.error('Error fetching subscribers:', error);
        alert('Error fetching subscribers');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, []);

  // Copy all emails
  const handleCopyEmails = () => {
    const emails = subscribers
      .map(sub => sub.email)
      .join(', ');
    
    navigator.clipboard.writeText(emails)
      .then(() => alert('Emails copied to clipboard!'))
      .catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy emails');
      });
  };

  // Delete subscriber
  const handleDelete = async (subscriber) => {
    setSubscriberToDelete(subscriber);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', subscriberToDelete.id);

      if (error) throw error;

      setSubscribers(subscribers.filter(sub => sub.id !== subscriberToDelete.id));
      setDeleteModalOpen(false);
      setSubscriberToDelete(null);
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      alert('Error deleting subscriber');
    }
  };

  // Delete confirmation modal
  const DeleteConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Confirm Unsubscribe</h3>
        <p className="mb-6">
          Are you sure you want to remove{' '}
          <span className="font-semibold">{subscriberToDelete?.email}</span>{' '}
          from the newsletter?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => {
              setDeleteModalOpen(false);
              setSubscriberToDelete(null);
            }}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Unsubscribe
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Newsletter Subscribers</h2>
        <button
          onClick={handleCopyEmails}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Copy All Emails
        </button>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading subscribers...</div>
      ) : subscribers.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No subscribers yet
        </div>
      ) : (
        <div className="space-y-2">
          {subscribers.map((subscriber) => (
            <div
              key={subscriber.id}
              className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg"
            >
              <span>{subscriber.email}</span>
              <button
                onClick={() => handleDelete(subscriber)}
                className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                title="Unsubscribe"
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}

      {deleteModalOpen && <DeleteConfirmationModal />}
    </div>
  );
};

export default SubscriberList;
