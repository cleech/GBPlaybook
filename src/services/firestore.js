import { initializeApp, getFirestore} from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "gb-playbook-ec4cd.firebaseapp.com",
  projectId: "gb-playbook-ec4cd",
  storageBucket: "gb-playbook-ec4cd.appspot.com",
  messagingSenderId: "147000765417",
  appId: "1:147000765417:web:05dcdcf94f70d1bb157978"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
