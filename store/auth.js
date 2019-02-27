export function state() {
  return {
    user: null,
    id: 1,
    clerk: false
  };
};

export const mutations = {
  setUser(state, user) {
    state.user = user;
    state.clerk = user.MembershipTierType === 5;
  },
  setId(state, id) {
    state.id = id;
  }
};

export const actions = {
  async processAuth({ commit, state }, { app: { $axios, $cookies }, req }) {
    let id = $cookies.get('user-id');
    commit('setId', id);

    if (id) {
      let user = await $axios.$get('/members/' + state.id);
      commit('setUser', user);
    }
  }
};
