<template>
  <div>
    <section class="container">
      <h2>Score Submission</h2>
      <div v-if="$store.state.auth.clerk">
        <label>Member</label>
      </div>
      <div class="catflex vertical">
        <div v-for="(hole, i) in holes" :key="i">
          <label>Hole {{ i+1 }}</label>
          <input v-model="holes[i]" type="number">
        </div>
      </div>
      <div>Total Score: {{ total }}</div>
      <div>Handicap: {{ handicap }}</div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      holes: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      courseRating: 70.6,
      slope: 128
    };
  },
  computed: {
    total() {
      return this.holes.reduce((acc, acu) => acc + acu);
    },
    handicap() {
      return ((this.total - this.courseRating) / this.slope) * 113;
    }
  },
  methods: {
    async submit() {}
  }
};
</script>
