<template>
  <div>
    <section class='container'>
      <h2>Delete TeeTime</h2>
      <p>Please select the TeeTime you would like to delete from the list.</p>

      <div class='teetime-wrapper'>
        <div v-for='teetime in teetimes' :key='teetime.TeeTimeID' class='teetime'>
          <h3>TeeTime #{{ teetime.TeeTimeID }}</h3>
          <div>Players: {{ teetime.PlayerCount }}</div>
          <div>Carts: {{ teetime.CartCount }}</div>
          <div>Date: {{ getDate(teetime.Date) }}</div>
          <br>
          <button class='button danger full' @click.prevent='deleteTeetime(teetime.TeeTimeID)'>Delete</button>
        </div>
      </div>

      <p>{{ error }}</p>
    </section>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  async asyncData({ params, $axios, store }) {
    try {
      let teetimes = await $axios.$get(
        `/members/${store.state.auth.id}/teetimes`
      );
      return { teetimes: teetimes, error: null };
    } catch (err) {
      console.log(err.data);
      return { teetimes: null, error: err.message };
    }
  },
  methods: {
    async deleteTeetime(id) {
      try {
        await this.$axios.$delete('/teetimes/' + id);
        this.teetimes = this.teetimes.filter(tt => tt.TeeTimeID !== id);
      } catch (err) {
        this.error = err.message;
      }
    },
    getDate(date) {
      return moment(date).format('LLLL');
    }
  }
};
</script>

<style lang="scss" scoped>
.teetime-wrapper {
  display: flex;
  flex-wrap: wrap;

  .teetime {
    margin: 10px;
    flex: 1 0 auto;
    display: block;
  }
}
</style>
