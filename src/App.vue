<template>
  <div>
    <div class="container">
      <router-view />
    </div>
    <footer class="footer">
      <div class="content has-text-centered">
        <p>
          <strong>Transferencia de archivos</strong>
          <br />
          <b-icon icon="code-tags"></b-icon> con
          <b-icon icon="heart" type="is-danger"></b-icon> por
          <a href="https://parzibyte.me/blog">Parzibyte</a>
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'app',
}
</script>