<template>
  <section class="section">
    <div class="columns">
      <div class="column">
        <b-field label="Correo">
          <b-input
            v-model="correo"
            type="email"
            placeholder="tu@correo.aquí"
            :loading="cargando"
          ></b-input
        ></b-field>
        <b-field label="Contraseña">
          <b-input
            v-model="palabraSecreta"
            type="password"
            placeholder="Tu contraseña"
            :loading="cargando"
          ></b-input
        ></b-field>
        <b-button
          :loading="cargando"
          class="is-success"
          @click="iniciarSesion()"
          >Iniciar sesión</b-button
        >
      </div>
    </div>
  </section>
</template>
<script>
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import FirebaseService from "../services/FirebaseService";
export default {
  data: () => ({
    correo: "",
    palabraSecreta: "",
    cargando: false,
  }),
  methods: {
    async iniciarSesion() {
      if (!this.correo || !this.palabraSecreta) {
        this.$buefy.toast.open("Completa los campos");
        return;
      }
      if (!this.correo.includes("@")) {
        // Validación muy simple, ya que Firebase se encarga de todo
        this.$buefy.toast.open("Escribe un correo válido");
        return;
      }
      this.cargando = true;
      FirebaseService.obtenerApp();// Inicializar app, no queremos la base de datos
      const auth = getAuth();
      try {
        await signInWithEmailAndPassword(
          auth,
          this.correo,
          this.palabraSecreta
        );
        this.$buefy.toast.open("Bienvenido");
      } catch (error) {
        this.$buefy.dialog.alert({
          title: "Error",
          message:
            "Error iniciando sesión. Verifica tu correo y contraseña. El error es: " +
            error.message,
          type: "is-danger",
          hasIcon: true,
          icon: "alert",
        });
      } finally {
        this.cargando = false;
      }
    },
  },
};
</script>