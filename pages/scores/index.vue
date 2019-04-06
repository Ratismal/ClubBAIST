<template>
  <div>
    <section class='container'>
      <h2>Scores</h2>

      <div class='catgrid gap'>
        <div class='col s6'>
          <div class='catflex vertical'>
            <label>Start Date</label>
            <input v-model='startDate' type='date'>
          </div>
        </div>
        <div class='col s6'>
          <div class='catflex vertical'>
            <label>End Date</label>
            <input v-model='endDate' type='date'>
          </div>
        </div>
        <div v-if='$store.state.auth.clerk' class='col s12'>
          <div class='catflex vertical'>
            <label>Member</label>
            <div v-if='member'>
              {{ member.FirstName }} {{ member.LastName }}
            </div>

            <button class='button full' @click.prevent='toggleMemberLookup'>Select Member</button>
            <div v-if='displayMemberLookup' class='behind-lookup'>
              <member-lookup @chosen='addMember' @close='toggleMemberLookup'/>
            </div>
          </div>
        </div>
        <button class='col s12 button' @click.prevent='getScores'>Search</button>
      </div>

      <table v-if='scores.length > 0' class='teesheet'>
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
      <div v-else-if='searched'>
        No results found.
      </div>
    </section>
  </div>
</template>

<script>
import moment from 'moment';
import MemberLookup from '@/components/MemberLookup.vue';

export default {
  components: { MemberLookup },
  data() {
    return {
      scores: [],
      startDate: null,
      endDate: null,
      member: null,
      searched: false,
      displayMemberLookup: false
    };
  },
  methods: {
    async getScores() {
      let payload = {};
      if (this.startDate) payload.start = this.startDate;
      if (this.endDate) payload.end = this.endDate;

      if (this.$store.state.auth.clerk) {
        if (this.member) {
          payload.member = this.member.MemberID;
        }
      } else payload.member = this.$store.state.auth.user.MemberID;

      let scores = await this.$axios.$get(`/scores`, {
        params: payload
      });

      console.log(scores);

      this.scores = scores.map(s => {
        s.Date = moment(s.Date).format('LL');
        return s;
      });

      this.searched = true;
    },
    async toggleMemberLookup() {
      this.displayMemberLookup = !this.displayMemberLookup;
    },
    async addMember(member) {
      this.member = member;
      this.displayMemberLookup = false;
    }
  }
};
</script>

