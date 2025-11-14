import { db } from '../firebase';
import { doc, updateDoc, setDoc } from 'firebase/firestore';

const SETTINGS_DOC = 'platform';
const SETTINGS_COLLECTION = 'settings';

async function updateSettingsField(field, data) {
  try {
    const settingsRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC);
    await setDoc(settingsRef, { [field]: data }, { merge: true });
  } catch (error) {
    console.error(`Error updating ${field}:`, error);
    throw error;
  }
}

export async function updatePlatformInfo(data) {
  return updateSettingsField('platformInfo', data);
}

export async function updateShopSettings(data) {
  return updateSettingsField('shopManagement', data);
}

export async function updateProductSettings(data) {
  return updateSettingsField('productSettings', data);
}

export async function updateUserManagement(data) {
  return updateSettingsField('userManagement', data);
}

export async function updatePaymentSettings(data) {
  return updateSettingsField('paymentSettings', data);
}

export async function updateOrderSettings(data) {
  return updateSettingsField('orderSettings', data);
}

export async function updateSecuritySettings(data) {
  return updateSettingsField('securitySettings', data);
}

export async function updateSystemSettings(data) {
  return updateSettingsField('systemSettings', data);
}

export async function updateNotificationSettings(data) {
  return updateSettingsField('notificationSettings', data);
}

export async function updateDangerZoneSettings(data) {
  return updateSettingsField('dangerZone', data);
}