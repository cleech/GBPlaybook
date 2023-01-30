import React, { ReactNode } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {
  FirebaseAppProvider,
  useFirebaseApp,
  AuthProvider,
  FirestoreProvider,
} from "reactfire";

const firebaseConfig = {
  apiKey: "AIzaSyBDUsrFi5JVUSD9CWg_3Rxl6eM9QE2UWe8",
  authDomain: "gb-playbook-ec4cd.firebaseapp.com",
  // databaseURL: "https://gb-playbook-ec4cd-default-rtdb.firebaseio.com",
  projectId: "gb-playbook-ec4cd",
  storageBucket: "gb-playbook-ec4cd.appspot.com",
  messagingSenderId: "147000765417",
  appId: "1:147000765417:web:05dcdcf94f70d1bb157978",
};

const FirebaseComponents = (props: { children: ReactNode }) => {
  const app = useFirebaseApp();
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  return (
    <AuthProvider sdk={auth}>
      <FirestoreProvider sdk={firestore}>{props.children}</FirestoreProvider>
    </AuthProvider>
  );
};

export const FirebaseProvider = (props: { children: ReactNode }) => (
  <FirebaseAppProvider firebaseConfig={firebaseConfig}>
    <FirebaseComponents>{props.children}</FirebaseComponents>
  </FirebaseAppProvider>
);