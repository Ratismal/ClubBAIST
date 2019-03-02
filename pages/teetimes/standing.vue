<template>
  <div>
    <section v-if='$store.state.auth.user && ($store.state.auth.user.MembershipTierType === 1 || $store.state.auth.clerk)' class='container'>
      <form ref='form'>
        <h2>Standing TeeTime Request</h2>
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

        <div class='catflex between'>
          <div class='grow'>
            <label>Start Date (dd/mm/yyyy)</label>
            <input v-model='RequestedStartDate' type='date' placeholder='Date' required>
          </div>
          <div class='grow'>
            <label>End Date (dd/mm/yyyy)</label>
            <input v-model='RequestedEndDate' type='date' placeholder='Date' required>
          </div>
        </div>
        <label>Requested Day</label>
        <select v-model='RequestedDay'>
          <option :value='0'>Sunday</option>
          <option :value='1'>Monday</option>
          <option :value='2'>Tuesday</option>
          <option :value='3'>Wednesday</option>
          <option :value='4'>Thursday</option>
          <option :value='5'>Friday</option>
          <option :value='6'>Saturday</option>
        </select>
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
            <option :value='true' selected>AM</option>
            <option :value='false'>PM</option>
          </select>
        </div>
        <div class='button-group'>
          <button class='button' @click.prevent='submit'>
            Submit
          </button>
        </div>

        <p class='error'>{{ error }}</p>
      </form>
    </section>
    <section v-else class='container'>
      <h1>Sorry</h1>
      <p>You aren't allowed to view this page.</p>
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
        players: []
      },
      RequestedDay: 1,
      RequestedStartDate: moment().format('YYYY-MM-DD'),
      RequestedEndDate: moment().add(1, 'year').format('YYYY-MM-DD'),
      playerLimit: this.$store.state.auth.clerk ? 4 : 3,
      player2: null,
      player3: null,
      player4: null,
      businessHours: {start: 60 * 6, end: 60 * 22},
      Hours: 0,
      Minutes: 0,
      AM: true,
      validatedTeetime: null,
      error: '',
      displayMemberLookup: false
    };
  },
  computed: {
    name() {
      return this.$store.state.auth.user.MemberID;
    },
    RequestedTime() {
      return `${this.Hours == 0 ? 12 : this.Hours}:${this.Minutes} ${this.AM ? 'AM' : 'PM'}`;
    }
    // date() {
    //   console.log(this.teetime.Date);
    //   let d = moment(this.teetime.Date);

    //   d = d
    //     .add(this.Hours == 12 ? 0 : this.Hours, 'h')
    //     .add(this.Minutes, 'm')
    //     .add(this.AM ? 0 : 12, 'h');

    //   return d;
    // },
    // formattedDate() {
    //   return this.date.format('LLLL');
    // }
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
      console.log(teetime);


      if (!teetime.RequestedStartDate.isValid())
        return (this.error = 'A valid start date must be provided.');
      if (teetime.RequestedStartDate <= Date.now())
        return (this.error = 'The start date must be later than today.');

      if (!teetime.RequestedEndDate.isValid())
        return (this.error = 'A valid end date must be provided.');
      if (teetime.RequestedEndDate <= Date.now())
        return (this.error = 'The end date must be later than today.');

      if (teetime.RequestedStartDate >= teetime.RequestedEndDate)
        return (this.error = 'The end date must be later than the start date');


      this.error = '';

      return true;
    },
    async submit() {
      let p = this.teetime.players.filter(p => p);
      if (!this.$store.state.auth.clerk) {
        p.unshift(this.$store.state.auth.user);
      }
      p = p.map(m => m.MemberID);
      if (p.length !== 4) return (this.error = 'There must be four registered players.');
      if (p[0].MembershipTierType !== 1) return (this.error = 'The first member must be Gold Tier.');
      let teetime = {
        PlayerCount: Number(this.teetime.PlayerCount),
        Player1ID: p[0],
        Player2ID: p[1],
        Player3ID: p[2],
        Player4ID: p[3],
        RequestedDay: this.RequestedDay,
        RequestedStartDate: moment(this.RequestedStartDate, 'YYYY-MM-DD'),
        RequestedEndDate: moment(this.RequestedEndDate, 'YYYY-MM-DD'),
        RequestedTeeTime: this.RequestedTime
      };
      if (this.$refs.form.reportValidity() && this.validate(teetime) === true) {
        try {
          await this.$axios.$put('/standingteetimes', teetime);
          this.$router.push('/');
        } catch (err) {
          this.error = err.response.data;
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
