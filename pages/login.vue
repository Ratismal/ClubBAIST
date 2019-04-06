<template>
  <div>
    <section class='container'>
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
      <h2>Login Reference</h2>
      <p>Click "Fill" to populate the login form with the selected credentials.</p>
      <table class='teesheet'>
        <thead>
          <tr>
            <th/>
            <th>Name</th>
            <th>Email</th>
            <th>Password</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for='u in logins' :key='u.username'>
            <td><button class='button' @click.prevent='fill(u.username, u.password)'>Fill</button></td>
            <td>{{ u.name }}</td>
            <td>{{ u.username }}</td>
            <td>{{ u.password }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      message: '',
      logins: [
        {
          name: 'Clerk Clerk',
          username: 'cc@clubbaist.com',
          password: 'password'
        },
        {
          name: 'Gold Member',
          username: 'gm@clubbaist.com',
          password: 'password'
        },
        {
          name: 'Silver Member',
          username: 'sm@clubbaist.com',
          password: 'password'
        },
        {
          name: 'Bronze Member',
          username: 'bm@clubbaist.com',
          password: 'password'
        },
        {
          name: 'Copper Member',
          username: 'cm@clubbaist.com',
          password: 'password'
        }
      ]
    };
  },
  methods: {
    fill(username, password) {
      this.email = username;
      this.password = password;
    },
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
        this.message =
          "wrong password, sorry :( PS your password is probably 'password' if your email is correct";
      }
    }
  }
};
</script>
