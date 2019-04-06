<template>
  <div>
    <section class='container'>
      <h2>Score Submission</h2>
      <div v-if='$store.state.auth.clerk'>
        <label>Member</label>
        <div v-if='member'>
          {{ member.FirstName }} {{ member.LastName }}
        </div>

        <button class='button full' @click.prevent='toggleMemberLookup'>Select Member</button>
        <div v-if='displayMemberLookup' class='behind-lookup'>
          <member-lookup @chosen='addMember' @close='toggleMemberLookup'/>
        </div>
      </div>
      <div class='catflex vertical'>
        <label>Date</label>
        <input v-model='date' type='date'>
      </div>
      <div class='catgrid gap'>
        <div v-for='(hole, i) in holes' :key='i' class='col s12 m6 l4 catflex vertical'>
          <label>Hole {{ i+1 }}</label>
          <input v-model='holes[i]' type='number' min='1'>
        </div>
      </div>
      <div class='catflex vertical center'>
        <span>Total Score: {{ total }}</span>
        <span>Handicap: {{ handicap }}</span>
      </div>
      <button class='button full' @click.prevent='submit'>Submit</button>
      <div class='error'>{{ error }}</div>
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
      holes: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      courseRating: 70.6,
      slope: 128,
      member: null,
      date: moment().format('YYYY-MM-DD'),
      displayMemberLookup: false,
      error: null
    };
  },
  computed: {
    total() {
      return this.holes.reduce((acc, cur) => acc + (parseInt(cur) || 0), 0);
    },
    handicap() {
      return (this.total - this.courseRating) / this.slope * 113;
    }
  },
  methods: {
    async submit() {
      this.error = null;
      let payload = {
        TotalScore: this.total,
        Handicap: this.handicap,
        MemberID: null,
        Date: this.date
      };
      if (!this.$store.state.auth.clerk) {
        payload.MemberID = this.$store.state.auth.user.MemberID;
      } else {
        if (this.member) payload.MemberID = this.member.MemberID;
      }

      if (!payload.MemberID) {
        this.error = 'Member must be selected.';
      } else if (
        !payload.Date ||
        !moment(payload.Date, 'YYYY-MM-DD').isValid()
      ) {
        this.error = 'Date must be valid.';
      } else if (payload.TotalScore < 18)
        this.error = 'The score for a hole may not be below 1';
      else if (moment(payload.Date, 'YYYY-MM-DD') > moment())
        this.error = 'The date cannot be in the future';
      if (this.error) return;

      console.log(payload);

      let scores = await this.$axios.$put(`/scores`, payload);
      this.$router.push('/success');
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
