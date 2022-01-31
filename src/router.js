import Vue from 'vue'
import Router from 'vue-router'
import DescargarArchivo from '@/components/Archivos/DescargarArchivo'
import Subir from '@/components/Archivos/Subir'
import VerArchivos from '@/components/Archivos/VerArchivos'
import Login from '@/components/Login'
import FirebaseService from './services/FirebaseService'
import { getAuth, onAuthStateChanged } from "firebase/auth";

Vue.use(Router);

const router = new Router({
    routes: [
        {
            path: '/descargar/:id',
            name: 'DescargarArchivo',
            component: DescargarArchivo
        },
        {
            path: '/',
            name: 'VerArchivos',
            component: VerArchivos
        },
        {
            path: '/subir',
            name: 'Subir',
            component: Subir
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        }

    ]
});
FirebaseService.obtenerApp(); // No queremos la base de datos, solo queremos inicializar la app
onAuthStateChanged(getAuth(), (user) => {
    if (!user) {
        if (router.currentRoute.name !== "Login" && router.currentRoute.name !== "DescargarArchivo") {
            router.push({ name: "Login" });
        }
    } else {
        if (router.currentRoute.name !== "DescargarArchivo") {
            router.push({ name: "VerArchivos" });
        }
    }
});

router.beforeEach((haciaDonde, desdeDonde, siguiente) => {
    if (haciaDonde.name === "DescargarArchivo") {
        siguiente();
        return;
    }
    const usuario = getAuth().currentUser;
    if (!usuario && haciaDonde.name !== "Login") {
        siguiente({ name: "Login" });
    } else {
        siguiente();
    }

});
export default router;