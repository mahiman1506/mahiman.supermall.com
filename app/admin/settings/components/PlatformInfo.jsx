import { useState } from 'react';
import { updatePlatformInfo } from '@/lib/firestore/settings/write';
import Image from 'next/image';

export default function PlatformInfo({ initialData }) {
  const [platformInfo, setPlatformInfo] = useState(initialData || {
    platformName: '',
    supportEmail: '',
    companyDetails: '',
    logoUrl: ''
  });
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleImageUpload = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      // TODO: Implement image upload to Firebase Storage
      // Update logoUrl in platformInfo
      setUploading(false);
    } catch (error) {
      showMessage('error', 'Failed to upload image');
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      await updatePlatformInfo(platformInfo);
      showMessage('success', 'Platform information updated successfully');
    } catch (error) {
      showMessage('error', 'Failed to update platform information');
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Platform Information</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Platform Logo
          </label>
          <div className="flex items-center space-x-4">
            {platformInfo.logoUrl && (
              <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                <Image
                  src={platformInfo.logoUrl}
                  alt="Platform Logo"
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <div className="flex-1">
              <label className="block">
                <span className="sr-only">Choose logo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100
                    disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </label>
              {uploading && (
                <p className="mt-2 text-sm text-gray-500">Uploading...</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Platform Name
          </label>
          <input
            type="text"
            value={platformInfo.platformName}
            onChange={(e) => setPlatformInfo({ ...platformInfo, platformName: e.target.value })}
            placeholder="Enter platform name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
              focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Support Email
          </label>
          <input
            type="email"
            value={platformInfo.supportEmail}
            onChange={(e) => setPlatformInfo({ ...platformInfo, supportEmail: e.target.value })}
            placeholder="Enter support email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
              focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Details
          </label>
          <textarea
            value={platformInfo.companyDetails}
            onChange={(e) => setPlatformInfo({ ...platformInfo, companyDetails: e.target.value })}
            placeholder="Enter company details"
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
              focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {message.text && (
          <div
            className={`rounded-md p-4 ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={uploading}
          className="inline-flex justify-center rounded-md border border-transparent
            bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm
            hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500
            focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}