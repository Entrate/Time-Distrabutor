
import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAtqkltyJ_AxWN7VnYmiRUmRwMVonCOSo4",
  authDomain: "time-distributor.firebaseapp.com",
  projectId: "time-distributor",
  storageBucket: "time-distributor.appspot.com",
  messagingSenderId: "18682716984",
  appId: "1:18682716984:web:8a4dd5b2a5bed55b4f17cd"
};


 const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
export default app