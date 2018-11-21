export function state() {
  return {
    user: null,
    // hardcode to an id of 0 for now,
    // auth is out of scope
    id: 0
  };
};

export const mutations = {
  setUser(state, user) {
    state.user = user;
  }
};

export const actions = {
  async processAuth({ commit, state }, { app: { $axios, $cookies }, req }) {
    let user = await $axios.$get('/members/' + state.id);
    commit('setUser', user);
  }
};
