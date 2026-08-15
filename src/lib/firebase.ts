import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const DEV_BYPASS_ENV = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true';
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const hasFirebaseConfig = !!apiKey && apiKey !== 'YOUR_FIREBASE_API_KEY' && apiKey.length > 5;

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;

if (!DEV_BYPASS_ENV && hasFirebaseConfig) {
  try {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };
    _app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    _auth = getAuth(_app);
    _db = getFirestore(_app);
    _storage = getStorage(_app);
  } catch (e) {
    console.warn('Firebase initialization skipped/failed:', e);
  }
}

// Automatically bypass Firebase if _auth is null (e.g. on Vercel without env keys)
export const DEV_BYPASS = DEV_BYPASS_ENV || !_auth;
export const auth = _auth as Auth;
export const db = _db as Firestore;
export const storage = _storage as FirebaseStorage;
export default _app;
