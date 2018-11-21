<template>
  <div>
    <section class='container'>
      <form ref='form'>
        <h2>New TeeTime</h2>
        <label>Player Count</label>
        <input v-model='teetime.PlayerCount' type='number' placeholder='Player Count' min='1' max='4' required>
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

export default {
  data: () => ({
    teetime: {
      MemberID: 0,
      PlayerCount: undefined,
      CartCount: undefined,
      Date: moment().format('YYYY-MM-DD')
    },
    Hours: null,
    Minutes: 0,
    AM: 'true',
    validatedTeetime: null,
    error: ''
  }),
  computed: {
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
      if (isNaN(teetime.PlayerCount))
        return (this.error = 'PlayerCount is not a number.');
      if (teetime.PlayerCount < 1)
        return (this.error = 'PlayerCount is less than 1.');
      if (teetime.PlayerCount > 4)
        return (this.error = 'PlayerCount is greater than 4.');

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
      let teetime = {
        MemberID: this.$store.state.auth.id,
        PlayerCount: Number(this.teetime.PlayerCount),
        CartCount: Number(this.teetime.CartCount),
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
