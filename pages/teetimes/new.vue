<template>
  <div>
    <section class='container'>
      <form ref='form'>
        <h2>New TeeTime</h2>
        <label>Players</label>
        <div class='catflex vertical'>
          <!-- no-op -->
          <div v-for='player in teetime.players' :key='player.MemberID' class='catflex member-box vert-baseline'>
            <button class='button danger' @click.prevent='removeMember(player.MemberID)'>Remove</button><span class='grow'>{{ player.FirstName }} {{ player.LastName }}</span>
          </div>
        </div>
        <button v-if='teetime.players.length < playerLimit' class='button full' @click.prevent='toggleMemberLookup'>Add Member</button>
        <div v-if='displayMemberLookup' class='behind-lookup'>
          <member-lookup :blacklist='teetime.players' @chosen='addMember' @close='toggleMemberLookup'/>
        </div>

        <label>Cart Count</label>
        <input v-model='teetime.CartCount' type='number' placeholder='Cart Count' min='1' max='4' required>
        <label>Date (dd/mm/yyyy)</label>
        <input v-model='teetime.Date' type='date' placeholder='Date' required>
        <label>Time</label>
        <div class='button-group'>
          <input v-model='Hours' type='number' placeholder='Hour' class='margin' min='0' max='12' required>
          <span class='time-separator'>:</span>
          <select v-model='Minutes' class='margin' required>
            <option value='0'>00</option>
            <option value='7'>07</option>
            <option value='15'>15</option>
            <option value='22'>22</option>
            <option value='30'>30</option>
            <option value='37'>37</option>
            <option value='45'>45</option>
            <option value='52'>52</option>
          </select>
          <select v-model='AM' required>
            <option value='true' selected>AM</option>
            <option value='false'>PM</option>
          </select>
        </div>
        {{ formattedDate }}
        <div class='button-group'>
          <button class='button' @click.prevent='submit'>
            Submit
          </button>
        </div>

        <p class='error'>{{ error }}</p>
      </form>
    </section>
  </div>
</template>

<script>
import moment from 'moment';
import MemberLookup from '@/components/MemberLookup.vue';

export default {
  components: {MemberLookup},
  data() {
    return {
      teetime: {
        MemberID: 0,
        players: [],
        CartCount: undefined,
        Date: moment().format('YYYY-MM-DD')
      },
      playerLimit: this.$store.state.auth.clerk ? 4 : 3,
      player2: null,
      player3: null,
      player4: null,
      Hours: null,
      Minutes: 0,
      AM: 'true',
      validatedTeetime: null,
      error: '',
      displayMemberLookup: false
    };
  },
  computed: {
    name() {
      return this.$store.state.auth.user.MemberID;
    },
    date() {
      console.log(this.teetime.Date);
      let d = moment(this.teetime.Date);

      d = d
        .add(this.Hours, 'h')
        .add(this.Minutes, 'm')
        .add(this.AM === 'true' ? 0 : 12, 'h');

      return d;
    },
    formattedDate() {
      return this.date.format('LLLL');
    }
  },
  mounted() {
    console.log(this.$store.state.auth.user);
  },
  async asyncData({ params, $axios }) {},
  methods: {
    addMember(member) {
      if (!this.teetime.players.find(p => p.MemberID === member.MemberID) && member.MemberID !== this.$store.state.auth.id) {
        this.teetime.players.push(member);
      }
      if (this.teetime.players.length >= this.playerLimit) this.displayMemberLookup = false;
    },
    removeMember(memberID) {
      let player = this.teetime.players.find(p => p.MemberID !== memberID);
      this.teetime.players.splice(this.teetime.players.indexOf(player), 1);
    },
    toggleMemberLookup() {
      if (this.teetime.players.length >= this.playerLimit) this.displayMemberLookup = false;
      else this.displayMemberLookup = !this.displayMemberLookup;
    },
    validate(teetime) {
      // if (isNaN(teetime.PlayerCount))
      //   return (this.error = 'PlayerCount is not a number.');
      // if (teetime.PlayerCount < 1)
      //   return (this.error = 'PlayerCount is less than 1.');
      // if (teetime.PlayerCount > 4)
      //   return (this.error = 'PlayerCount is greater than 4.');

      if (isNaN(teetime.CartCount))
        return (this.error = 'CartCount is not a number.');
      if (teetime.CartCount < 1)
        return (this.error = 'CartCount is less than 1.');
      if (teetime.CartCount > 4)
        return (this.error = 'CartCount is greater than 4.');

      if (!teetime.Timeslot.isValid())
        return (this.error = 'A valid date must be provided.');
      if (teetime.Date <= Date.now())
        return (this.error = 'The date must be later than today.');

      this.error = '';

      return true;
    },
    async submit() {
      let p = this.teetime.players.filter(p => p);
      if (!this.$store.state.auth.clerk) {
        p.unshift(this.$store.state.auth.user);
      }
      p = p.map(m => m.MemberID);
      let teetime = {
        PlayerCount: Number(this.teetime.PlayerCount),
        CartCount: Number(this.teetime.CartCount),
        Player1ID: p[0],
        Player2ID: p[1],
        Player3ID: p[2],
        Player4ID: p[3],
        Timeslot: this.date
      };
      if (this.$refs.form.reportValidity() && this.validate(teetime) === true) {
        try {
          await this.$axios.$put('/teetimes', teetime);
          this.$router.push('/');
        } catch (err) {
          this.error = err.message + '\n\n' + err.response.data;
          console.log(err.response);
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.time-separator {
  margin-right: 10px;
  font-size: 1.3em;
}
.button-group {
  align-items: center;
}

.behind-lookup {
  background: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 8px;
}

label {
    margin-top: 1rem;
    display: block;
}
</style>
