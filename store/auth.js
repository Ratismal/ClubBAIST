export function state() {
  return {
    user: null,
    // hardcode to an id of 0 for now,
    // auth is out of scope
    id: 1
  };
};

export const mutations = {
  setUser(state, user) {
    state.user = user;
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
