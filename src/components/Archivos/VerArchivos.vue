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
import { onSnapshot, query } from '@firebase/firestore';
import FirebaseService from '../../services/FirebaseService';
export default {
  data: () => ({
    archivos: [],
    cargando: false,
  }),
  async mounted() {
    await this.obtenerArchivosYEscucharCambios();
  },
  methods: {
    subirArchivo() {
      this.$router.push({ name: "Subir" });
    },
    async copiarAlPortapapeles(archivo) {
      try {
        this.cargando = true;
        await navigator.clipboard.writeText(`${window.location.origin}/` + this.enlaceParaDescargar(archivo));
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
    }
  }
}
</script>