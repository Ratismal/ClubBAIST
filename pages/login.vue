<template>
  <div>
    <section class='container'>
      <form ref='form'>
        <!-- no-op -->
        <h2>Log In</h2>
        <div class='button-group'>
          <div>
            <label>Email</label>
            <input v-model='email' type='email' placeholder='email'>
          </div>
          <div>
            <label>Password</label>
            <input v-model='password' type='password' placeholder='secret'>
          </div>
        </div>

        <button class='button full' @click.prevent='login'>Log In</button>
        <br>
        <span>{{ message }}</span>
      </form>
    </section>
  </div>
</template>

<script>
export default {
    data() {
        return {
            email: '',
            password: '',
            message: ''
        };
    },
    methods: {
        async login() {
            try {
                await this.$axios.$post('/login', {
                    email: this.email,
                    password: this.password
                });

                this.$router.push('/');

                window.location.reload(true);
            } catch (err) {
                console.error(err.message, err.stack);
                this.message = 'wrong password, sorry :( PS your password is probably \'password\' if your email is correct';
            }

        }
    }
};
</script>

<style lang="scss" scoped>

</style>
