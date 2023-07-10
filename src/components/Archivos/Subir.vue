<template>
  <div class="section">
    <div class="columns">
      <div class="column">
        <b-button
          type="is-success"
          icon-right="format-list-numbered"
          @click="verArchivos()"
          :disabled="estaSubiendo"
          >Ver archivos</b-button
        >
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <b-field>
          <b-upload
            :disabled="estaSubiendo"
            @change.native="onArchivosSeleccionados"
            v-model="archivo"
            drag-drop
            expanded
          >
            <section class="section">
              <div class="content has-text-centered">
                <p>
                  <b-icon icon="upload" size="is-large"></b-icon>
                </p>
                <p>Clic aquí para buscar el archivo</p>
              </div>
            </section>
          </b-upload>
        </b-field>
        <span v-if="archivo" class="tag is-primary">
          {{ archivo.name }}
        </span>
        <br />
        <b-notification v-show="estaPausado" type="is-danger" :closable="false"
          >Pausado</b-notification
        >
        <br />
        <b-progress
          v-show="estaSubiendo"
          :value="progreso"
          type="is-success"
          show-value
          format="percent"
        ></b-progress>
        <b-button
          :disabled="estaSubiendo"
          :loading="estaSubiendo"
          type="is-success"
          @click="subir"
          >Subir</b-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import { ref, uploadBytesResumable } from 'firebase/storage';
import FirebaseService from "../../services/FirebaseService.js";
import { addDoc, doc, setDoc, } from '@firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
export default {
  data: () => ({
    archivo: null,
    estaSubiendo: false,
    estaPausado: false,
    progreso: 0,
  }),
  mounted() {
    window.addEventListener("beforeunload", (evento) => {
      if (this.estaSubiendo) {
        evento.preventDefault();
        evento.returnValue = "";
        return "";
      }
    });
  },
  methods: {
    onArchivosSeleccionados(){
      this.subir();
    },
    verArchivos() {
      this.$router.push({
        name: "VerArchivos",
      });
    },
    async subir() {
      if (!this.archivo) {
        return;
      }
      const nombre = this.archivo.name;
      const uuid = uuidv4();
      const storage = await FirebaseService.obtenerStorage();
      const tarea = uploadBytesResumable(ref(storage, uuid + "/" + nombre), this.archivo);
      this.estaSubiendo = true;
      this.estaPausado = false;
      tarea.on("state_changed",
        (snapshot) => {
          this.progreso = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (snapshot.state === "paused") {
            this.estaPausado = true;
          } else if (snapshot.state === "running") {
            this.estaPausado = false;
          }
        },
        (error) => {
          this.$buefy.toast.open({
            message: "Error subiendo archivo: " + error.message,
            type: 'is-danger'
          });
        },
        async () => {
          this.$buefy.toast.open({
            message: "Archivo subido. Guardando detalles...",
            type: 'is-info'
          });
          const documentoRecienCreado = await addDoc(await FirebaseService.obtenerColeccionArchivos(), {
            uuid,
            nombre,
            fecha: new Date().getTime(),
          });
          await setDoc(doc(await FirebaseService.obtenerFirestore(), "descargasArchivos", documentoRecienCreado.id), { descargas: [] });
          this.$buefy.toast.open({
            message: "Subida terminada correctamente",
            type: 'is-success'
          });
          this.estaSubiendo = false;
          this.estaPausado = false;
          this.archivo = null;
          this.progreso = 0;
        }
      );
    },
  }
}
</script>