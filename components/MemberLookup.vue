<template>
  <div>
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
          <div v-for='member in filteredMembers' :key='member.MemberID' class='member-box'>
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
        blacklist: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            searchTerm: '',
            members: []
        };
    },
    computed: {
        filteredMembers: {
            get() {
                return this.members.filter(m => !this.blacklist.find(b => b.MemberID === m.MemberID)
                    && m.MemberID !== this.$store.state.auth.id && ![4,5].includes(m.MembershipTierType));
            }
        }
    },
    methods: {
        async search() {
            let res = await this.$axios.$get('/members?q=' + this.searchTerm);

            this.members = res.members;
        },
        choose(member) {
            this.$emit('chosen', member);
        },
        close() {
            this.$emit('close');
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
