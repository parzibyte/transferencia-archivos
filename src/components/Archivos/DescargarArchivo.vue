<template>
  <div class="columns">
    <b-loading :active="cargando"></b-loading>
    <div class="column has-text-centered" v-show="archivo.nombre">
      <p class="title">Listos para descargar</p>
      <p class="subtitle">{{ archivo.nombre }}</p>
      <b-button @click="descargar()" type="is-success" icon-right="download"
        >Descargar
      </b-button>
      <br />
      <br />
      <b-notification type="is-info" :closable="false" has-icon>
        <p class="is-size-5">
          No olvide respaldar el archivo, ya que el enlace tiene una fecha de
          expiración. Además, la mayoría de veces el reenvío del archivo tiene
          un costo
        </p>
      </b-notification>
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
import { doc, getDoc, } from '@firebase/firestore';
import FirebaseService from '../../services/FirebaseService';
import { getDownloadURL, ref } from '@firebase/storage';
export default {
  data: () => ({
    archivo: {},
    cargando: false,
  }),
  async mounted() {
    this.cargando = true;
    const id = this.$route.params.id;
    const referenciaAlDocumento = doc(await FirebaseService.obtenerFirestore(), "archivos", id);
    const instantaneaDocumento = await getDoc(referenciaAlDocumento);
    this.cargando = false;
    if (instantaneaDocumento.exists()) {
      this.archivo = instantaneaDocumento.data();
    }
  },
  methods: {
    async descargar() {
      this.cargando = true;
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