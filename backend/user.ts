import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../firebaseConfig";

export async function addUser() {
  try {
    const userDocRef = doc(
      FIRESTORE_DB,
      `Users/${FIREBASE_AUTH?.currentUser?.uid}`
    );
    await setDoc(userDocRef, {
      email: FIREBASE_AUTH?.currentUser?.email,
      id: FIREBASE_AUTH?.currentUser?.uid,
      showTermsCondition: true,
    });
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

export async function updateUsername(username: string) {
  try {
    const userDocRef = doc(
      FIRESTORE_DB,
      `Users/${FIREBASE_AUTH?.currentUser?.uid}`
    );
    await updateDoc(userDocRef, {
      username: username,
      prefixes: generatePrefixes(username),
    });
  } catch (error) {
    console.error("Error updating username", error);
  }
}
function generatePrefixes(username: string) {
  const prefixes = [];
  for (let i = 1; i <= username.length; i++) {
    prefixes.push(username.substring(0, i).toLowerCase());
  }
  return prefixes;
}

export async function getUser(userId: string): Promise<User | undefined> {
  try {
    const userDocRef = doc(FIRESTORE_DB, `Users/${userId}`);
    const userDocSnapshot = await getDoc(userDocRef);
    return userDocSnapshot.data() as User;
  } catch (error) {
    console.error("Error fetching user:", error);
  }
}
export async function savePushToken(token: string) {
  try {
    const userDocRef = doc(
      FIRESTORE_DB,
      `Users/${FIREBASE_AUTH?.currentUser?.uid}`
    );

    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const tokens = data.tokens ?? [];

      if (!tokens.includes(token)) {
        tokens.push(token);
        await updateDoc(userDocRef, { tokens: tokens });
      }
    }
  } catch (error) {
    console.error("Error saving push token:", error);
  }
}
export async function updateTermsCondition(): Promise<void> {
  try {
    const userDocRef = doc(
      FIRESTORE_DB,
      `Users/${FIREBASE_AUTH?.currentUser?.uid}`
    );
    await updateDoc(userDocRef, {
      showTermsCondition: false,
    });
  } catch (error) {
    console.error("Error saving Terms and Condition:", error);
  }
}
