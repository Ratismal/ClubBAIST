<template>
  <section class='container'>
    <h2>Success!</h2>
    <p>Redirecting you to the main page...</p>
  </section>
</template>

<script>
export default {
  mounted() {
    setTimeout(() => {
      this.$router.push('/');
    }, 5e3);
  }
};
</script>

