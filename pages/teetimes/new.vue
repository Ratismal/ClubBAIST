<template>
  <div>
    <section v-if='$store.state.auth.user && $store.state.auth.user.MembershipTierType !== 4' class='container'>
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
        {{ formattedDate }}
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
  components: { MemberLookup },
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
      availableHours: {
        1: [{ start: 0, end: 60 * 24 }],
        2: [{ start: 0, end: 60 * 15 }, { start: 60 * 17.5, end: 60 * 24 }],
        3: [{ start: 0, end: 60 * 15 }, { start: 60 * 18, end: 60 * 24 }]
      },
      businessHours: { start: 60 * 6, end: 60 * 22 },
      Hours: 12,
      Minutes: 0,
      AM: false,
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
        .add(this.Hours == 12 ? 0 : this.Hours, 'h')
        .add(this.Minutes, 'm')
        .add(this.AM ? 0 : 12, 'h');

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
      if (
        !this.teetime.players.find(p => p.MemberID === member.MemberID) &&
        member.MemberID !== this.$store.state.auth.id
      ) {
        this.teetime.players.push(member);
      }
      if (this.teetime.players.length >= this.playerLimit)
        this.displayMemberLookup = false;
    },
    removeMember(memberID) {
      let player = this.teetime.players.find(p => p.MemberID !== memberID);
      this.teetime.players.splice(this.teetime.players.indexOf(player), 1);
    },
    toggleMemberLookup() {
      if (this.teetime.players.length >= this.playerLimit)
        this.displayMemberLookup = false;
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

      if (!teetime.Player1ID)
        return (this.error = 'There must be at least one player.');
      if (isNaN(teetime.CartCount))
        return (this.error = 'CartCount is not a number.');
      if (teetime.CartCount < 1)
        return (this.error = 'CartCount is less than 1.');
      if (teetime.CartCount > 4)
        return (this.error = 'CartCount is greater than 4.');

      if (!teetime.Timeslot.isValid())
        return (this.error = 'A valid date must be provided.');
      if (teetime.Timeslot <= Date.now())
        return (this.error = 'The date must be later than today.');
      let tier;
      if (!this.$store.state.auth.clerk) {
        tier = this.$store.state.auth.user.MembershipTierType;
      } else tier = this.teetime.players[0].MembershipTierType;
      const hours = this.availableHours[tier];
      let hoursFine = false;
      let compare = teetime.Timeslot.hours() * 60 + teetime.Timeslot.minutes();

      console.log(compare, hours, this.businessHours);

      for (const hour of hours) {
        if (compare >= hour.start && compare <= hour.end) hoursFine = true;
      }
      if (!hoursFine)
        return (this.error =
          'You cannot book a TeeTime in this timeslot with your current membership tier.');
      if (
        compare < this.businessHours.start ||
        compare > this.businessHours.end
      )
        return (this.error = 'Club BAIST is not open at this timeslot.');

      console.log(teetime.Timeslot - Date.now());
      if (teetime.Timeslot - Date.now() > 1000 * 60 * 60 * 24 * 7)
        return (this.error =
          'You cannot book a TeeTime greater than a week in advance.');

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
          this.error = err.response.data;
          console.log(err.response);
        }
      }
    }
  }
};
</script>

