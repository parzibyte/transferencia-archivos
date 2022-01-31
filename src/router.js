import Vue from 'vue'
import Router from 'vue-router'
import DescargarArchivo from '@/components/Archivos/DescargarArchivo'
import Subir from '@/components/Archivos/Subir'
import VerArchivos from '@/components/Archivos/VerArchivos'

Vue.use(Router);

export default new Router({
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
        }

    ]
});