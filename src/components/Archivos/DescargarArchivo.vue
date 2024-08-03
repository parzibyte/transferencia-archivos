<template>
  <div class="columns">
    <b-loading :active="cargando"></b-loading>
    <div class="column has-text-centered" v-show="archivo.nombre">
      <p class="title">Listos para descargar</p>
      <p class="subtitle">{{ archivo.nombre }}</p>
      <b-notification type="is-warning" has-icon :closable="false">
        <strong>Declaración de Responsabilidad</strong>
        <p>
          Entiendo y acepto que es mi responsabilidad respaldar este archivo. En caso de pérdida o eliminación, soy
          consciente de que el reenvío del mismo puede incurrir en un costo adicional, a discreción del desarrollador,
          equivalente o superior al monto pagado inicialmente para acceder al archivo actual.
        </p>
        <p>
          Asimismo, acepto que este archivo será eliminado en unos días y que el enlace de descarga expirará a
          discreción del desarrollador. Por lo tanto, debo descargarlo lo antes posible.
        </p>
      </b-notification>
      <b-field>
        <b-checkbox v-model="aceptaCondiciones">He leído y acepto las condiciones listadas arriba</b-checkbox>
      </b-field>
      <b-button :disabled="!aceptaCondiciones" @click="descargar()" type="is-success" icon-right="download">Descargar
      </b-button>
      <br />
      <br />
    </div>
    <div class="column has-text-centered" v-show="!archivo.nombre && !cargando">
      <p class="title">Enlace inválido</p>
      <p class="subtitle">
        Parece que el enlace que has seguido ha expirado, es inválido o el
        archivo al que apuntaba ha sido eliminado
      </p>
    </div>
  </div>
</template>
<script>
import { doc, getDoc, updateDoc, } from '@firebase/firestore';
import FirebaseService from '../../services/FirebaseService';
import { getDownloadURL, ref } from '@firebase/storage';
export default {
  data: () => ({
    archivo: {},
    referenciaDescargas: {},
    descargas: { descargas: {} },
    cargando: false,
    aceptaCondiciones: false,
  }),
  async mounted() {
    this.cargando = true;
    const id = this.$route.params.id;
    const referenciaAlDocumento = doc(await FirebaseService.obtenerFirestore(), "archivos", id);
    const referenciaDescargas = doc(await FirebaseService.obtenerFirestore(), "descargasArchivos", id);
    this.referenciaDescargas = referenciaDescargas;
    const instantaneaDocumento = await getDoc(referenciaAlDocumento);
    const instantaneaDescargas = await getDoc(referenciaDescargas);
    this.cargando = false;
    if (instantaneaDocumento.exists()) {
      this.archivo = instantaneaDocumento.data();
    }
    if (instantaneaDescargas.exists()) {
      this.descargas = instantaneaDescargas.data();
    }
  },
  methods: {
    async descargar() {
      this.cargando = true;
      this.descargas.descargas.push(new Date().getTime());
      await updateDoc(this.referenciaDescargas, { descargas: this.descargas.descargas });
      try {
        const url = await getDownloadURL(ref(await FirebaseService.obtenerStorage(), this.archivo.uuid + "/" + this.archivo.nombre))
        window.location.href = url;
      } catch (error) {
        this.$buefy.toast.open({
          message: "Error descargando archivo. Tal vez no tiene los permisos suficientes. Error: " + error.message,
          type: 'is-danger'
        });
      } finally {
        this.cargando = false;
      }
    }
  }
}
</script>