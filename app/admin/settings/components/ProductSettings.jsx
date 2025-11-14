import { useState } from 'react';
import { updateProductSettings } from '@/lib/firestore/settings/write';

export default function ProductSettings({ initialData, categories }) {
  const [settings, setSettings] = useState(initialData || {
    maxProductsPerShop: 100,
    maxImagesPerProduct: 5,
    allowedCategories: [],
    taxSettings: {
      enabled: true,
      gstPercentage: 18,
      vatPercentage: 0
    }
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSave = async () => {
    try {
      await updateProductSettings(settings);
      setMessage({ type: 'success', text: 'Product settings updated successfully' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update product settings' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Product Settings</h2>

      <form className="space-y-6">
        <div className="space-y-4">
          <label className="block">
            <span className="text-gray-700">Maximum Products per Shop</span>
            <input
              type="number"
              min={1}
              value={settings.maxProductsPerShop}
              onChange={(e) => setSettings({ ...settings, maxProductsPerShop: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Maximum Images per Product</span>
            <input
              type="number"
              min={1}
              max={10}
              value={settings.maxImagesPerProduct}
              onChange={(e) => setSettings({ ...settings, maxImagesPerProduct: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>

          <div className="space-y-2">
            <label className="block text-gray-700">Allowed Categories</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {categories?.map(cat => (
                <label key={cat.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.allowedCategories.includes(cat.id)}
                    onChange={(e) => {
                      const newCategories = e.target.checked
                        ? [...settings.allowedCategories, cat.id]
                        : settings.allowedCategories.filter(id => id !== cat.id);
                      setSettings({ ...settings, allowedCategories: newCategories });
                    }}
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <span className="text-sm">{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="inline-flex items-center space-x-2">
              <span className="text-gray-700">Enable Tax Calculation</span>
              <input
                type="checkbox"
                checked={settings.taxSettings.enabled}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    taxSettings: { ...settings.taxSettings, enabled: e.target.checked }
                  })
                }
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </label>

            {settings.taxSettings.enabled && (
              <div className="space-y-4 pl-4">
                <label className="block">
                  <span className="text-gray-700">GST Percentage</span>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={settings.taxSettings.gstPercentage}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          taxSettings: { ...settings.taxSettings, gstPercentage: Number(e.target.value) }
                        })
                      }
                      className="block w-full pr-12 rounded-md border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">%</span>
                    </div>
                  </div>
                </label>

                <label className="block">
                  <span className="text-gray-700">VAT Percentage</span>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={settings.taxSettings.vatPercentage}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          taxSettings: { ...settings.taxSettings, vatPercentage: Number(e.target.value) }
                        })
                      }
                      className="block w-full pr-12 rounded-md border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">%</span>
                    </div>
                  </div>
                </label>
              </div>
            )}
          </div>
        </div>

        {message.text && (
          <div className={`p-4 rounded-md ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        <button
          type="button"
          onClick={handleSave}
          className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}