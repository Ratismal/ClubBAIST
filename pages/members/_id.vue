<template>
  <div>
    <section v-if='member' class='container'>
      <h2>User: {{ member.FirstName }} {{ member.LastName }}</h2>

      <p>ID: {{ member.MemberID }}</p>
      <p>Address: {{ member.Address }}</p>
      <p>Postal Code: {{ member.PostalCode }}</p>
      <p>Phone1: {{ member.Phone1 }}</p>
      <p>Phone2: {{ member.Phone2 }}</p>
      <p>Email: {{ member.Email }}</p>
      <p>Date of Birth: {{ getDate(member.DateOfBirth) }}</p>
      <p>Occupation: {{ member.Occupation }}</p>
      <p>Tier: {{ member.Tier }}</p>
    </section>
    <section v-else class='container'>
      <h2>No member found.</h2>
    </section>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  async asyncData({ params, $axios }) {
    try {
      let id = Number(params.id);
      if (isNaN(id)) return { member: null };
      let user = await $axios.$get('/members/' + params.id);
      return { member: user };
    } catch (err) {
      return { member: null };
    }
  },
  methods: {
    getDate(date) {
      return moment(date).format('LLLL');
    }
  }
};
</script>
