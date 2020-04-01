import Vue from "vue";
import Vuex from "vuex";
import db from "../main";
import { calEventsCollection } from "../main";
//  import VuexPersistence from "vuex-persist";
Vue.use(Vuex);
// const vuexLocal = new VuexPersistence({
//   supportCircular: true,
//   // storage: window.localStorage,
//   reducer: (state) => ({doneEvents: state.doneEvents})
// });

export default new Vuex.Store({
  state: {
    doneEvents: [],
    events: []
  },
  getters: {
    doneEvents: state => state.doneEvents,
    doneEvent(state) {
      return eventName => {
        return state.doneEvents.find(event => {
          return event.name === eventName;
        });
      };
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
      console.log("set done events payload");
      console.log(payload);
      state.doneEvents = JSON.parse(JSON.stringify(payload));
    },
    updateEvent(state, payload) {
      const event = state.doneEvents.find(e => {
        return e.name === payload.name;
      });
      // if (payload.name)
      event.name = payload.name;
      // if (payload.detail)
      event.detail = payload.detail;
      event.start = payload.start;
      event.end = payload.end;
      event.done = payload.done;
    }
  },
  actions: {
    
    fetchDoneEvents(context) {
      //check up here for if statment
      console.log("fetchdone event");
      console.log(localStorage.getItem("finishEvent") === null);
      console.log(localStorage.getItem("finishEvent"));
      if (!localStorage.getItem("finishEvent")) {
        alert("fetching data...");
        db.collection("calEvent")
          .where("done", "==", true)
          .get()
          .then(querySnapshot => {
            const doneEvetns = [];
            querySnapshot.forEach(doc => {
              const numberOfKeys = Object.keys(doc.data()).length;
              if (numberOfKeys !== 0) {
                doneEvetns.push({ ...doc.data() });
              }
            });
            console.log(doneEvetns);
            context.commit("setDoneEvents", doneEvetns);
            localStorage.setItem("finishEvent", JSON.stringify(doneEvetns));
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        context.commit(
          "setDoneEvents",
          JSON.parse(localStorage.getItem("finishEvent"))
        );
        alert("data is already in local storage");
      }
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
    },
    updateEventData (payload) {
      alert(payload.name)
      calEventsCollection
        .where("name", "==", payload.name)
        .limit(1)
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              // doc.data() is never undefined for query doc snapshots
              console.log(doc.id, " => ", doc.data());
          });
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });
        // .update({
        //   name: payload.name,
        //   detail: payload.detail,
        //   start: payload.start,
        //   end: payload.end,
        //   done: payload.done
        // })
        // .then(() => {
        //   commit("updateEvent", payload);
        // })
        // .catch(error => {
        //   console.log(error);
        // });
    }
  },
  modules: {}
  // plugins: [vuexLocal.plugin]
});
