<template>
  <div>
    <section class='container'>
      <h2>TeeSheet</h2>
      <label>Date</label>
      <input v-model='date' type='date'>
      <button class='button full' @click.prevent='query'>Search</button>

      <table class='teesheet'>
        <thead>
          <tr>
            <th>Time</th>
            <th>Members</th>
            <th>Carts</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for='teetime in teesheet' v-if='teetime.Members || showAll' :key='teetime.key' class='time'>
            <td>{{ teetime.formatted }}</td>
            <td >{{ teetime.Members }}</td>
            <td >{{ teetime.CartCount }}</td>
          </tr>
        </tbody>
      </table>

      <p>{{ error }}</p>
    </section>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  data() {
    return {
      minutes: [0, 7, 15, 22, 30, 37, 45, 52],
      hours: [7, 22],
      date: moment().format('YYYY-MM-DD'),
      teetimes: {},
      timeslots: [],
      teesheet: [],
      error: '',
      showAll: false
    };
  },
  mounted() {
    console.log(this.date);

    let base = moment().startOf('day');
    let timeslots = [];
    for (let h = this.hours[0]; h <= this.hours[1]; h++) {
      for (const m of this.minutes) {
        let d = base.clone().add(h, 'hours').add(m, 'minutes');
        timeslots.push({key: d.format('HH:mm'), date: d, formatted: d.format('hh:mm A')});
      }
    }
    this.timeslots = timeslots;
  },
  methods: {
    async query() {
      this.teetimes = {};
      console.log(this.date);
      let date = moment(this.date);
      if (!date.isValid()) date = moment();
      try {
        let teetimes = await this.$axios.$get(
            `/teesheet?q=${date.format()}`
        );
        console.log(teetimes);
        for (const teetime of teetimes) {
          teetime.Timeslot = moment(teetime.Timeslot);
          teetime.formatted = teetime.Timeslot.format('hh:mm A');
          teetime.key = teetime.Timeslot.format('HH:mm');
          teetime.Members = [teetime.Player1, teetime.Player2, teetime.Player3, teetime.Player4]
            .filter(p => !!p).map(p => p.FirstName + ' ' + p.LastName).join(', ');
          this.teetimes[teetime.key] = teetime;
        }

        this.teesheet = [];
        for (const timeslot of this.timeslots) {
          let teetime = this.teetimes[timeslot.key];
          if (teetime) {
            this.teesheet.push(teetime);
          } else this.teesheet.push({key: timeslot.key, formatted: timeslot.formatted});
        }

        console.log(this.teetimes);
      } catch (err) {
        this.error = err.message;
      }
    },
    getTeeTime(key) {
      console.log(this.teetimes[key]);
      return this.teetimes[key] || {};
    }
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

.time {
  font-family: monospace;
  text-align: center;
}
</style>
