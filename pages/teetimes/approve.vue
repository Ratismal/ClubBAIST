<template>
  <div>
    <section v-if='$store.state.auth.user && $store.state.auth.clerk' class='container'>
      <h2>Approve TeeTime</h2>

      <div class='teetime-wrapper catflex vertical'>
        <div v-for='teetime in teetimes' :key='teetime.StandingTeeTimeID' class='teetime catflex vertical'>
          Standing TeeTime #{{ teetime.StandingTeeTimeID }}
          <span class='title'>Members</span>
          <div class='members catflex vertical'>
            <span class='member'>{{ teetime.Player1.FirstName }} {{ teetime.Player1.LastName }}</span>
            <span class='member'>{{ teetime.Player2.FirstName }} {{ teetime.Player2.LastName }}</span>
            <span class='member'>{{ teetime.Player3.FirstName }} {{ teetime.Player3.LastName }}</span>
            <span class='member'>{{ teetime.Player4.FirstName }} {{ teetime.Player4.LastName }}</span>
          </div>

          <div><span class='title'>Requested Start Date:</span> {{ formatDate(teetime.RequestedStartDate) }}</div>
          <div><span class='title'>Requested End Date:</span> {{ formatDate(teetime.RequestedEndDate) }}</div>
          <div><span class='title'>Requested Day:</span> {{ days[teetime.RequestedDay] }}</div>
          <div><span class='title'>Requested Time:</span> {{ teetime.RequestedTeeTime }}</div>

          <span class='title'>Priority Number</span>
          <input v-model='teetime.PriorityNumber' type='number'>
          <span class='title'>Approved TeeTime</span>
          <div class='button-group'>
            <input v-model='teetime.hours' type='number' placeholder='Hour' class='margin' min='0' max='12' required>
            <span class='time-separator'>:</span>
            <select v-model='teetime.minutes' class='margin' required>
              <option value='0'>00</option>
              <option value='7'>07</option>
              <option value='15'>15</option>
              <option value='22'>22</option>
              <option value='30'>30</option>
              <option value='37'>37</option>
              <option value='45'>45</option>
              <option value='52'>52</option>
            </select>
            <select v-model='teetime.am' required>
              <option :value='true' selected>AM</option>
              <option :value='false'>PM</option>
            </select>
          </div>
          <button class='button' @click.prevent='approve(teetime)'>Approve</button>
        </div>
      </div>

      <p>{{ error }}</p>
    </section>
    <section v-else class='container'>
      <h1>Sorry</h1>
      <p>You aren't allowed to view this page.</p>
    </section>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  async asyncData({ params, $axios, store }) {
    try {
      let teetimes = await $axios.$get(
          `/standingteetimes`
        );
      teetimes.sort((a, b) => {
        return moment(a.Date) - moment(b.Date);
      });
      teetimes.forEach(tt => {
        let parts = tt.RequestedTeeTime.split(':').map(p => Number(p));
        tt.hours = parts[0] % 12;
        if (tt.hours === 0) tt.hours = 12;
        tt.minutes = parts[1];
        tt.am = parts[0] < 12;
      });
      return { teetimes: teetimes, error: null };
    } catch (err) {
      console.log(err.data);
      return { teetimes: null, error: err.message };
    }
  },
  data() {
    return {
      days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    };
  },
  methods: {
    formatDate(date) {
      return moment(date).format('LLLL');
    },
    async approve(teetime) {
      console.log(teetime);
      let time = [];
      if (teetime.hours === 12) time.push(0);
      else teetime.push(teetime.hours);
      if (!teetime.am) time[0] += 12;
      time.push(teetime.minutes);
      time.push(0);

      await this.$axios.$post(`/standingteetimes/${teetime.StandingTeeTimeID}/approve`, {
        ApproverID: this.$store.state.auth.user.MemberID,
        ApprovedDate: moment(),
        PriorityNumber: teetime.PriorityNumber,
        ApprovedTeeTime: time.join(':')
      });

      this.teetimes = this.teetimes.filter(t => t.StandingTeeTimeID !== teetime.StandingTeeTimeID);
    }
  }
};
</script>

<style lang="scss" scoped>
.teetime {
  background: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  margin: 0.5rem;
  border-radius: 8px;
}

.title {
  font-size: 1.3em;
}

.members {
  margin-left: 1rem;
}
</style>
