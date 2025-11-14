import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function getSettings() {
  try {
    const settingsDoc = await getDoc(doc(db, 'settings', 'platform'));
    if (settingsDoc.exists()) {
      return settingsDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Error reading settings:', error);
    throw error;
  }
}