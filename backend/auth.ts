import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { FIREBASE_AUTH } from "../firebaseConfig";
import { addUser } from "./user";

export async function logIn(email: string, password: string): Promise<boolean> {
  try {
    await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
  } catch (error) {
    console.error(error);
    return false;
  }
  return true;
}

export async function register(
  email: string,
  password: string
): Promise<boolean> {
  try {
    await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
    addUser();
  } catch (error) {
    console.error(error);
    return false;
  }
  return true;
}

export function logOut() {
  FIREBASE_AUTH.signOut();
}
