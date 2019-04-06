<template>
  <div>
    <section class='container'>
      <h2>TeeTime Reservations</h2>

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
        <button class='col s12 button' @click.prevent='getReserv'>Search</button>
      </div>

      <table v-if='reserv.length > 0' class='teesheet'>
        <thead>
          <tr>
            <th>Players</th>
            <th>Timeslot</th>
            <th>Carts</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for='(score, i) in reserv' :key='i'>
            <td class='catflex vertical'>
              <span>{{ score.Player1.FirstName }} {{ score.Player1.LastName }}</span>
              <span>{{ score.Player2.FirstName }} {{ score.Player2.LastName }}</span>
              <span>{{ score.Player3.FirstName }} {{ score.Player3.LastName }}</span>
              <span>{{ score.Player4.FirstName }} {{ score.Player4.LastName }}</span>

            </td>
            <td>{{ score.Timeslot }}</td>
            <td>{{ score.CartCount }}</td>
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
      reserv: [],
      startDate: null,
      endDate: null,
      member: null,
      searched: false,
      displayMemberLookup: false
    };
  },
  methods: {
    async getReserv() {
      let payload = {};
      if (this.startDate) payload.start = this.startDate;
      if (this.endDate) payload.end = this.endDate;

      if (this.$store.state.auth.clerk) {
        if (this.member) {
          payload.member = this.member.MemberID;
        }
      } else payload.member = this.$store.state.auth.user.MemberID;

      let reserv = await this.$axios.$get(`/reserv`, {
        params: payload
      });

      console.log(reserv);

      this.reserv = reserv.map(s => {
        s.Timeslot = moment(s.Timeslot).format('LLLL');
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
