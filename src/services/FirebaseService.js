import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
import { getStorage, } from "firebase/storage";
const FirebaseService = {
    obtenerApp: async () => {
        const firebaseConfig = {
            apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
            authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
            databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
            projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
            storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.VUE_APP_FIREBASE_APP_ID,
        };
        return initializeApp(firebaseConfig);
    },
    async obtenerFirestore() {
        return getFirestore(await FirebaseService.obtenerApp());
    },
    async obtenerStorage() {
        return getStorage(await FirebaseService.obtenerApp());
    },
    obtenerColeccionArchivos: async () => {
        return collection(
            await FirebaseService.obtenerFirestore(),
            "archivos"
        );
    },
};
export default FirebaseService;