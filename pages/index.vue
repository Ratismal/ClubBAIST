<template>
  <section class='container'>
    <div class='center'>
      <h2 class='subtitle'>
        Welcome, {{ $store.state.auth.user.FirstName }} {{ $store.state.auth.user.LastName }}.
      </h2>
      <div class='button-group'>
        <nuxt-link class='button' to='/teetimes/new'>Reserve TeeTime</nuxt-link>
        <nuxt-link class='button' to='/teetimes/delete'>Cancel TeeTime</nuxt-link>
      </div>
      <div class='button-group'>
        <nuxt-link to='/teetimes/standing/' class='button'>Standing TeeTimes</nuxt-link>
        <nuxt-link :to='"/members/" + $store.state.auth.user.MemberID' class='button'>About You</nuxt-link>
      </div>
      <div class='button-group'>
        <a href='https://github.com/Ratismal/ClubBAIST' target='_blank' class='button'>Source Code</a>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  components: {}
};
</script>

<style>
</style>
