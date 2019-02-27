<template>
  <div>
    <section class='container'>
      <h2>Delete TeeTime</h2>
      <p>Please select the TeeTime you would like to delete from the list.</p>

      <div class='teetime-wrapper'>
        <div v-for='teetime in teetimes' :key='teetime.TeeTimeID' class='teetime'>
          <h3 class='center'>{{ getDate(teetime.Date) }}</h3>
          <div class='button-group'>
            <!-- <div>ID: {{ teetime.TeeTimeID }}</div> -->
            <div class='item left'>
              <div v-for='player in getPlayers(teetime)' :key='player' class='item left'>{{ player }}</div>
            </div>
            <div class='item'>Carts: {{ teetime.CartCount }}</div>
            <button class='button danger' @click.prevent='deleteTeetime(teetime.TeeTimeID)'>Delete</button>
          </div>
          <br>
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
      let teetimes;
      if (store.state.auth.clerk) {
        teetimes = await $axios.$get(
          `/teetimes`
        );
      } else {
        teetimes = await $axios.$get(
          `/members/${store.state.auth.id}/teetimes`
        );
      }
      console.log(teetimes);
      teetimes.sort((a, b) => {
        return moment(a.Date) - moment(b.Date);
      });
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
    },
    getPlayers(teetime) {
      return [teetime.Player1, teetime.Player2, teetime.Player3, teetime.Player4]
        .filter(p => p)
        .map(p => p.FirstName + ' ' + p.LastName);
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

.button-group {
  align-items: center;
  justify-content: space-around;
  margin-bottom: 5px;

  .item {
    flex: 1 1 auto;
    text-align: center;
  }
}
</style>
