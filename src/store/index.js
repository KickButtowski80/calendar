import Vue from "vue";
import Vuex from "vuex";
import db from "../main";
 import VuexPersistence from "vuex-persist";
Vue.use(Vuex);
const vuexLocal = new VuexPersistence({
  storage: window.localStorage
});

export default new Vuex.Store({
  state: {
    doneEvents: []
  },
  getters: {
    doneEvents: state => state.doneEvents,
    doneEvent(state){
      return eventName => {
        return state.doneEvents.find( event => {
          return event.name === eventName
        })
      }
    }
  },
  mutations: {
    pushEvent(state, payload) {
      state.doneEvents.push(payload);
    },
    spliceEvent(state, payload) {
      state.doneEvents.splice(
        state.doneEvents.findIndex(event => event.id === payload.id),
        1
      );
    },
    setDoneEvents(state, payload) {
      console.log("set done events payload")
      console.log(payload)
      state.doneEvents = JSON.parse(JSON.stringify(payload))
      
    }
  },
  actions: {
    fetchDoneEvents(context) {
      db.collection("calEvent")
        .where("done", "==", true)
        .get()
        .then(querySnapshot => {
          const doneEvetns = [];
          querySnapshot.forEach(doc => {
            const numberOfKeys = Object.keys(doc.data()).length;
            console.log(JSON.stringify(doc.data()))
            if (numberOfKeys !== 0) {
              doneEvetns.push({ ...doc.data() });
            }
          });
          console.log(doneEvetns)
          context.commit("setDoneEvents", doneEvetns);
        })
        .catch(error => {
          console.log(error);
          // context.commit('setLoading', true)
        });
    },
    pushEvent({ commit }, payload) {
      commit("pushEvent", payload);
    },
    spliceEvent({ commit }, payload) {
      commit("spliceEvent", payload);
    },
    saveDoneEvents(payload) {
      console.log(payload);
      let parsed = JSON.stringify(payload);
      localStorage.setItem("doneEvents", parsed);
    }
  },
  modules: {},
  plugins: [vuexLocal.plugin]
});
