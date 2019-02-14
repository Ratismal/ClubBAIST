<template>
  <div>
    <section class='container'>
      <form ref='form'>
        <h2>New TeeTime</h2>
        <label>Players</label>
        <div class='button-group'>
          <div>
            <span>{{ $store.state.auth.user.FirstName }} {{ $store.state.auth.user.LastName }}</span>
          </div>
          <div>
            <span>{{ player2 ? player2.FirstName + ' ' + player2.LastName : ':(' }}</span>
            <button class='button' @click.prevent='player2Displayed = true'>Lookup</button>
          </div>
        </div>
        <div class='button-group'>
          <div>
            <span>{{ player3 ? player3.FirstName + ' ' + player3.LastName : ':(' }}</span>
            <button class='button' @click.prevent='player3Displayed = true'>Lookup</button>
          </div>
          <div>
            <span>{{ player4 ? player4.FirstName + ' ' + player4.LastName : ':(' }}</span>
            <button class='button' @click.prevent='player4Displayed = true'>Lookup</button>
          </div>
        </div>

        <member-lookup :displayed.sync='player2Displayed' :chosen.sync='player2' @close='player2Displayed = false'/>
        <member-lookup :displayed.sync='player3Displayed' :chosen.sync='player3' @close='player3Displayed = false'/>
        <member-lookup :displayed.sync='player4Displayed' :chosen.sync='player4' @close='player4Displayed = false'/>

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
  data: () => ({
    teetime: {
      MemberID: 0,
      players: [null, null, null],
      CartCount: undefined,
      Date: moment().format('YYYY-MM-DD')
    },
    player2Displayed: false,
    player3Displayed: false,
    player4Displayed: false,
    player2: null,
    player3: null,
    player4: null,
    Hours: null,
    Minutes: 0,
    AM: 'true',
    validatedTeetime: null,
    error: ''
  }),
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
  async asyncData({ params, $axios }) {},
  methods: {
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

      if (!teetime.Date.isValid())
        return (this.error = 'A valid date must be provided.');
      if (teetime.Date <= Date.now())
        return (this.error = 'The date must be later than today.');

      this.error = '';

      return true;
    },
    async submit() {
      let p = this.teetime.players.filter(p => p);
      let teetime = {
        MemberID: this.$store.state.auth.id,
        PlayerCount: Number(this.teetime.PlayerCount),
        CartCount: Number(this.teetime.CartCount),
        Player2: p[0],
        Player3: p[1],
        Player4: p[2],
        Date: this.date
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
</style>
