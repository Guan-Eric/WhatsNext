import {
  signInAnonymously,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { FIREBASE_AUTH } from "../firebaseConfig";
import { addUser } from "./user";

// Sign in anonymously (seamless)
export async function signInAnonymous(): Promise<boolean> {
  try {
    const userCredential = await signInAnonymously(FIREBASE_AUTH);
    // Create user document in Firestore
    await addUser();
    return true;
  } catch (error) {
    console.error("Anonymous sign in error:", error);
    return false;
  }
}

// Check auth state
export function observeAuthState(
  callback: (user: FirebaseUser | null) => void
) {
  return onAuthStateChanged(FIREBASE_AUTH, callback);
}

// Sign out
export function logOut() {
  FIREBASE_AUTH.signOut();
}
