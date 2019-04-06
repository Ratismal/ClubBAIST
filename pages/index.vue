<template>
  <section class='container'>
    <div v-if='$store.state.auth.user' class='center'>
      <h2 class='subtitle'>
        Welcome, {{ $store.state.auth.user.FirstName }} {{ $store.state.auth.user.LastName }}.
      </h2>
      <h3>Construction</h3>
      <div class='button-group'>
        <nuxt-link class='button' to='/teetimes/new'>Reserve TeeTime</nuxt-link>
        <nuxt-link class='button' to='/teetimes/delete'>Cancel TeeTime</nuxt-link>
      </div>
      <div class='button-group'>
        <nuxt-link to='/teetimes/standing/' class='button'>Standing TeeTimes</nuxt-link>
        <nuxt-link :to='"/members/" + $store.state.auth.user.MemberID' class='button'>About You</nuxt-link>
      </div>
      <div class='button-group'>
        <nuxt-link v-if='$store.state.auth.clerk' to='/teetimes/approve' class='button'>Approve Standing</nuxt-link>
        <button v-if='$store.state.auth.clerk' class='button danger' @click.prevent='clearStandingTeeTimes'>Clear Standing TeeTimes</button>
        <nuxt-link to='/teesheet' class='button'>TeeSheet</nuxt-link>
      </div>
      <h3>Transition</h3>
      <div class='button-group'>
        <nuxt-link to='/scores/submit' class='button'>Submit Score</nuxt-link>
      </div>
      <div class='button-group'>
        <nuxt-link to='/teetimes' class='button'>View Reservations</nuxt-link>
        <nuxt-link to='/scores' class='button'>View Scores</nuxt-link>
      </div>
      <h3>Extra</h3>
      <div class='button-group'>
        <a href='https://github.com/Ratismal/ClubBAIST' target='_blank' class='button'>Source Code</a>
        <nuxt-link to='/logout' class='button'>Log Out</nuxt-link>
      </div>
    </div>
    <div v-else class='center'>
      <br>
      <nuxt-link to='/login' class='button'>Log In</nuxt-link>
    </div>
  </section>
</template>

<script>
export default {
  components: {},
  methods: {
    async clearStandingTeeTimes() {
      await this.$axios.$delete('/standingteetimes');
    }
  }
};
</script>

<style>
</style>
