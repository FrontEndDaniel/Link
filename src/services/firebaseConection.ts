import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAN0vZd4eYQ8Nq8df6GuM0pNOvtCzi26EE",
  authDomain: "leescodevlinks.firebaseapp.com",
  projectId: "leescodevlinks",
  storageBucket: "leescodevlinks.appspot.com",
  messagingSenderId: "380149298890",
  appId: "1:380149298890:web:c9ba914ffd1bb715a62633"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export{auth, db};