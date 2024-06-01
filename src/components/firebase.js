import { initializeApp } from "firebase/app"; 
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCWpTXOQFzUuu0MgRpIdjS_lSlFpELEO-I",
  authDomain: "login-auth-32c8f.firebaseapp.com",
  projectId: "login-auth-32c8f",
  storageBucket: "login-auth-32c8f.appspot.com",
  messagingSenderId: "334650245524",
  appId: "1:334650245524:web:b870a6515d606592ff8f81"
};

const app = initializeApp(firebaseConfig);

export const auth =getAuth(); 
export const db=getFirestore(app);

export default app;