import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

export async function deleteAccount() {
  try {
    const userId = FIREBASE_AUTH.currentUser.uid;
    const userDocRef = doc(FIRESTORE_DB, `Users/${userId}`);

    const subcollections = ["Watchlist", "MyList"];
    for (const subcollection of subcollections) {
      const subcollectionRef = collection(
        FIRESTORE_DB,
        `Users/${userId}/${subcollection}`
      );
      const subcollectionDocs = await getDocs(subcollectionRef);

      const batch = writeBatch(FIRESTORE_DB);
      subcollectionDocs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    }
    await deleteDoc(userDocRef);
    await FIREBASE_AUTH.currentUser.delete();
  } catch (error) {
    console.error("Error deleting account:", error);
  }
}

const resetOnboarding = async () => {
  try {
    await AsyncStorage.removeItem("@has_seen_onboarding");
    await AsyncStorage.removeItem("@selected_plan");
    console.log("Onboarding reset!");
  } catch (e) {
    console.error("Failed to reset onboarding:", e);
  }
};
