<template>
  <div :class='displayed ? "" : "hidden"'>
    <section class='container'>
      <form ref='form'>
        <h3>Find Member</h3>
        <div>
          <label>Name</label>
          <input v-model='searchTerm' type='text' placeholder='name'>
        </div>
        <button class='button full' @click.prevent='search'>Search</button>
        <br>
        <div class='member-wrap'>
          <div v-for='member in members' :key='member.MemberID' class='member'>
            <button class='button' @click.prevent='choose(member)'>this one!</button>
            <span>{{ member.FirstName }} {{ member.LastName }}</span>
          </div>
        </div>
        <br>

        <button class='button full danger' @click.prevent='close'>Cancel</button>


      </form>
    </section>
  </div>
</template>

<script>
export default {
    props: {
        displayed: {
            default: '',
            type: String
        },
        chosen: {
            default: null,
            type: Object
        }
    },
    data() {
        return {
            searchTerm: '',
            members: []
        };
    },
    methods: {
        async search() {
            let res = await this.$axios.$get('/members?q=' + this.searchTerm);

            this.members = res.members;
        },
        choose(member) {
            this.chosen = member;
            this.displayed = false;
            this.close();
        },
        close() {
            this.displayed = false;
            this.$emit('closed');
        }
    }
};
</script>

<style lang="scss" scoped>
.hidden {
    display: none;
}

.member {
    margin: 1rem 0;
}
</style>
