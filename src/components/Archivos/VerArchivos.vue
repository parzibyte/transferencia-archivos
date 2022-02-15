<template>
  <div class="section">
    <div class="columns">
      <div class="column">
        <b-button type="is-success" icon-right="plus" @click="subirArchivo()"
          >Nuevo</b-button
        >
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <b-table
          :data="archivos"
          :loading="cargando"
          :mobile-cards="true"
          hoverable
        >
          <b-table-column
            sortable
            searchable
            field="nombre"
            label="Nombre"
            v-slot="props"
          >
            {{ props.row.nombre }}
          </b-table-column>
          <b-table-column
            field="fecha"
            label="Fecha de carga"
            sortable
            v-slot="props"
          >
            {{ props.row.fecha | timestampAFecha }}
          </b-table-column>
          <b-table-column field="id" label="Descargas" v-slot="props">
            <strong
              >{{ descargasDeArchivo(props.row.id).length }} descargas</strong
            >
            <ul>
              <li
                v-for="(descarga, claveDescarga) in descargasDeArchivo(
                  props.row.id
                )"
                :key="claveDescarga"
              >
                {{ descarga | timestampAFecha }}
              </li>
            </ul>
          </b-table-column>
          <b-table-column field="uuid" label="Enlace" v-slot="props">
            <b-button
              type="is-info"
              tag="a"
              :href="enlaceParaDescargar(props.row)"
              target="_blank"
            >
              <b-icon icon="open-in-new"></b-icon>
            </b-button>
            &nbsp;
            <b-button
              type="is-success"
              @click="copiarAlPortapapeles(props.row)"
            >
              <b-icon icon="content-copy"></b-icon>
            </b-button>
          </b-table-column>
          <b-table-column field="id" label="Eliminar" v-slot="props">
            <b-button type="is-danger" @click="eliminar(props.row)">
              <b-icon icon="delete"></b-icon>
            </b-button>
          </b-table-column>
          <template #empty>
            <div class="has-text-centered">No hay registros</div>
          </template>
        </b-table>
      </div>
    </div>
  </div>
</template>
<script>
import { deleteDoc, doc, onSnapshot, query } from '@firebase/firestore';
import FirebaseService from '../../services/FirebaseService';
import { deleteObject, ref } from '@firebase/storage';
export default {
  data: () => ({
    archivos: [],
    descargas: [],
    cargando: false,
  }),
  async mounted() {
    await this.obtenerArchivosYEscucharCambios();
  },
  methods: {
    descargasDeArchivo(idArchivo) {
      const posiblesDescargas = this.descargas.find(descarga => descarga.id === idArchivo);
      if (posiblesDescargas) {
        return posiblesDescargas.descargas;
      }
      return [];
    },
    async eliminar(archivo) {
      this.$buefy.dialog.confirm({
        message: `¿Eliminar <code>${archivo.nombre}</code>? Esto no se puede deshacer`,
        cancelText: "Cancelar",
        confirmText: "Sí, eliminar",
        onConfirm: async () => {
          this.cargando = true;
          await deleteObject(
            ref(await FirebaseService.obtenerStorage(), archivo.uuid + "/" + archivo.nombre)
          );
          await deleteDoc(
            doc(await FirebaseService.obtenerFirestore(), "archivos", archivo.id)
          );
          await deleteDoc(
            doc(await FirebaseService.obtenerFirestore(), "descargasArchivos", archivo.id)
          );
          this.cargando = false;
          this.$buefy.toast.open("Eliminado");
        },
      });
    },
    subirArchivo() {
      this.$router.push({ name: "Subir" });
    },
    async copiarAlPortapapeles(archivo) {
      try {
        this.cargando = true;
        await navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}` + this.enlaceParaDescargar(archivo));
        this.$buefy.toast.open({
          message: "Copiado",
          type: 'is-success'
        });
      } catch (error) {
        this.$buefy.toast.open({
          message: "Error copiando enlace. Tal vez no estás en un entorno seguro. Error: " + error.message,
          type: 'is-danger'
        });
      } finally {
        this.cargando = false;
      }
    },
    enlaceParaDescargar(archivo) {
      return this.$router.resolve({
        name: "DescargarArchivo", params: {
          id: archivo.id,
        }
      }).href;
    },
    indiceDeArchivo(idArchivo) {
      return this.archivos.findIndex((archivo) => archivo.id === idArchivo);
    },
    indiceDeDescarga(idDescarga) {
      return this.descargas.findIndex((descarga) => descarga.id === idDescarga);
    },
    async obtenerArchivosYEscucharCambios() {
      this.archivos = [];
      this.cargando = true;
      const coleccion = await FirebaseService.obtenerColeccionArchivos();
      onSnapshot(query(coleccion), (instantanea) => {
        instantanea.docChanges().forEach((cambio) => {
          this.cargando = true;
          const archivo = cambio.doc.data();
          const idArchivo = cambio.doc.id;
          if (cambio.type === "added") {
            archivo.id = idArchivo;
            this.archivos.push(archivo);
          }
          if (cambio.type === "modified") {
            const indice = this.indiceDeArchivo(idArchivo);
            if (indice !== -1) {
              this.$set(this.archivos, indice, archivo);
            }
          }
          if (cambio.type === "removed") {
            const indice = this.indiceDeArchivo(idArchivo);
            if (indice !== -1) {
              this.archivos.splice(indice, 1);
            }
          }
        });
        this.cargando = false;
      });

      const coleccionDescargasArchivos = await FirebaseService.obtenerColeccionDescargasArchivos();
      onSnapshot(query(coleccionDescargasArchivos), (instantanea) => {
        instantanea.docChanges().forEach((cambio) => {
          this.cargando = true;
          const descarga = cambio.doc.data();
          const idDescarga = cambio.doc.id;
          descarga.id = idDescarga;
          if (cambio.type === "added") {
            descarga.id = idDescarga;
            this.descargas.push(descarga);
          }
          if (cambio.type === "modified") {
            const indice = this.indiceDeDescarga(idDescarga);
            if (indice !== -1) {
              this.$set(this.descargas, indice, descarga);
            }
          }
          if (cambio.type === "removed") {
            const indice = this.indiceDeDescarga(idDescarga);
            if (indice !== -1) {
              this.descargas.splice(indice, 1);
            }
          }
        });
        this.cargando = false;
      });
    }
  }
}
</script>