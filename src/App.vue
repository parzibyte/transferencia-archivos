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
          <br />
          <small>
            <a
              href="https://www.flaticon.com/free-icons/exchange"
              title="exchange icons"
              >Exchange icons created by Good Ware - Flaticon</a
            >
          </small>
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