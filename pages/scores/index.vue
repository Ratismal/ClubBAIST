<template>
  <div>
    <section class='container'>
      <h2>Scores</h2>

      <table class='teesheet'>
        <thead>
          <tr>
            <th>Player Name</th>
            <th>Handicap</th>
            <th>Date</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for='(score, i) in scores' :key='i'>
            <td>{{ score.Member.FirstName }} {{ score.Member.LastName }}</td>
            <td>{{ score.Handicap }}</td>
            <td>{{ score.Date }}</td>
            <td>{{ score.TotalScore }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  async asyncData({ $axios }) {
    let scores = await $axios.$get(`/scores`);

    return {
      scores: scores.map(s => {
        s.Date = moment(s.Date).format('LL');
        return s;
      })
    };
  }
};
</script>

<style lang="scss" scoped>
.teesheet {
  font-size: 1.3em;
  width: 100%;

  border-collapse: separate;
  border-spacing: 0 0;

  tr {
    margin-top: 1em;
    // background: white;
    height: 40px;
  }
}
</style>
