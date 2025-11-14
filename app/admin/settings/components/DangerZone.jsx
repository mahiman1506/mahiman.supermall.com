import { useState } from 'react';
import { updateDangerZoneSettings } from '@/lib/firestore/settings/write';

export default function DangerZone({ initialData }) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [actionType, setActionType] = useState('');
  const [settings, setSettings] = useState(initialData || {
    platformStatus: 'active',
    shopRegistration: true
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleAction = (type) => {
    setActionType(type);
    setShowConfirmation(true);
  };

  const executeAction = async () => {
    try {
      switch (actionType) {
        case 'deletePlatform':
          // TODO: Implement platform deletion logic
          showMessage('success', 'Platform deleted successfully');
          break;
        case 'resetDatabase':
          // TODO: Implement database reset logic
          showMessage('success', 'Database reset successfully');
          break;
        case 'toggleRegistration':
          await updateDangerZoneSettings({
            ...settings,
            shopRegistration: !settings.shopRegistration
          });
          setSettings({
            ...settings,
            shopRegistration: !settings.shopRegistration
          });
          showMessage('success', `Shop registrations ${settings.shopRegistration ? 'disabled' : 'enabled'}`);
          break;
        default:
          break;
      }
      setShowConfirmation(false);
    } catch (error) {
      showMessage('error', 'Failed to perform action');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-red-600">Danger Zone</h2>

      {message.text && (
        <div className={`p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="border-2 border-red-500 rounded-lg p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Delete Entire Platform</h3>
          <p className="text-gray-600">
            This action will permanently delete all data including users, shops, products, and orders.
            This action cannot be undone.
          </p>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            onClick={() => handleAction('deletePlatform')}
          >
            Delete Platform
          </button>
        </div>

        <div className="border-t border-red-300 pt-6 space-y-2">
          <h3 className="text-xl font-semibold">Reset Database</h3>
          <p className="text-gray-600">
            This will reset the database to its initial state. All data will be permanently deleted.
            This action cannot be undone.
          </p>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            onClick={() => handleAction('resetDatabase')}
          >
            Reset Database
          </button>
        </div>

        <div className="border-t border-red-300 pt-6 space-y-2">
          <h3 className="text-xl font-semibold">Shop Registration Control</h3>
          <p className="text-gray-600">
            {settings.shopRegistration 
              ? 'Disable new shop registrations temporarily.'
              : 'Enable shop registrations to allow new sellers to join.'}
          </p>
          <button
            className={`px-4 py-2 rounded transition-colors ${
              settings.shopRegistration 
                ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
            onClick={() => handleAction('toggleRegistration')}
          >
            {settings.shopRegistration ? 'Disable' : 'Enable'} Shop Registration
          </button>
        </div>

        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-w-[90vw]">
              <h3 className="text-lg font-semibold mb-4">Confirmation Required</h3>
              <p className="mb-6">Are you sure you want to perform this action? This cannot be undone.</p>
              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                  onClick={() => setShowConfirmation(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  onClick={executeAction}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}