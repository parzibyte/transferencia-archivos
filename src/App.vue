<template>
  <div class="container">
    <div class="columns">
      <div class="column">
        <section>
          <h1 class="is-size-1">Probando Buefy</h1>
          <button class="button is-medium" @click="mostrarToast">
            Mostrar un toast
          </button>
        </section>
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <subir />
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <ver-archivos />
      </div>
    </div>
  </div>
</template>

<script>
import Subir from "./components/Archivos/Subir.vue"
import VerArchivos from "./components/Archivos/VerArchivos.vue"
export default {
  components: { Subir, VerArchivos },
  name: 'app',
  methods: {
    mostrarToast() {
      this.$buefy.toast.open("¡Hola, Buefy! Parzibyte.me")
    }
  }
}
</script>