<template>
  <section class='container'>
    <h2>bye :(</h2>
  </section>
</template>

<script>
export default {
  mounted() {
    this.$axios.$post('/logout').then(() => {
      this.$router.push('/');
      window.location.reload(true);
    });
  }
};
</script>
