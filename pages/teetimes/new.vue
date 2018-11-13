<template>
  <div>
    <section class='container'>
      <h2>New TeeTime</h2>

      <input v-model='teetime.PlayerCount' type='number' placeholder='Player Count'>
      <input v-model='teetime.CartCount' type='number' placeholder='Cart Count'>
      <input v-model='teetime.Date' type='datetime-local' placeholder='Date'>

      <div class='button-group'>
        <button class='button' @click.prevent='submit'>
          Submit
        </button>
      </div>

      <p>{{ error }}</p>
    </section>
  </div>
</template>

<script>
export default {
  data: () => ({
    teetime: {
      MemberID: 0,
      PlayerCount: undefined,
      CartCount: undefined,
      Date: ''
    },
    validatedTeetime: null,
    error: ''
  }),
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

      if (teetime.Date.toString() === 'Invalid Date')
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
        Date: new Date(this.teetime.Date)
      };
      if (this.validate(teetime) === true) {
        try {
          await this.$axios.$put('/teetimes', teetime);
          this.$router.push('/');
        } catch (err) {
          this.error = err.message;
          console.log(err.data);
        }
      }
    }
  }
};
</script>
