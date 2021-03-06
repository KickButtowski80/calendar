import Vue from "vue";
import Vuex from "vuex";
import db from "../main";

Vue.use(Vuex);
function emulateStrikethrough(string, hasStrike) {
  if (hasStrike) {
    return string
      .split("")
      .map((char) => char + "\u0335")
      .join("");
  } else {
    return string.replace(/[\u0335]/g, "");
  }
}
const asyncLocalStorage = {
  async setItem(key, value) {
    null;
    return localStorage.setItem(key, value);
  },
  getItem: async function(key) {
    null;
    return localStorage.getItem(key);
  },
};
export default new Vuex.Store({
  state: {
    doneEvents: [],
    events: [],
    start: null,
    end: null,
  },
  getters: {
    events: (state) => state.events,
    start: (state) => state.start,
    end: (state) => state.end,
    doneEvents: (state) => state.doneEvents,
    doneEvent(state) {
      return (eventName) => {
        return state.doneEvents.find((event) => {
          return event.name === eventName;
        });
      };
    },
  },
  mutations: {
    pushEvent(state, payload) {
      state.events.push(payload);
    },
    pushDoneEvent(state, payload) {
      state.doneEvents.push(payload);
    },
    spliceEvent(state, payload) {
      // payload is just an id
      state.events.splice(
        state.events.findIndex((event) => event.id === payload),
        1
      );
    },
    spliceDoneEvent(state, payload) {
      // payload is just an id
      state.doneEvents.splice(
        state.doneEvents.findIndex((event) => event.id === payload),
        1
      );
    },
    setEvents(state, payload) {
      state.events = JSON.parse(JSON.stringify(payload));
    },
    setStart(state, payload) {
      state.start = payload;
    },
    setEnd(state, payload) {
      state.end = payload;
    },
    setDoneEvents(state, payload) {
      state.doneEvents = JSON.parse(JSON.stringify(payload));
    },
    updateEvent(state, payload) {
      const event = state.events.find((e) => {
        return e.name === payload.name;
      });

      event.name = payload.name;
      event.detail = payload.detail;
      event.start = payload.start;
      event.end = payload.end;
      event.done = payload.done;
    },
  },
  actions: {
    async fetchEvents(context) {
      if (!localStorage.getItem("allEvents")) {
        // alert(JSON.stringify(start) + " " + JSON.stringify(end)); //
        alert("fetching events");
        // console.log("start date is" + JSON.stringify(start));
        var eventsArr = [];
        //wait is gonna return a promise
        const querySnapshot = await db.collection("calEvent").get();
       
        if (querySnapshot.empty) {
          console.log("Error getting documents: ", querySnapshot);
          return;
        }
        querySnapshot.forEach((doc) => {
          console.log("doc " + JSON.stringify(doc.data()));
          eventsArr.push({
            id: doc.id,
            color: doc.data().color,
            detail: doc.data().detail,
            end: doc.data().end,
            name: emulateStrikethrough(doc.data().name, doc.data().done),
            start: doc.data().start,
            done: doc.data().done,
          });
        });
        context.commit("setEvents", eventsArr);
        localStorage.setItem("allEvents", JSON.stringify(eventsArr));
      } else {
        asyncLocalStorage
          .getItem("allEvents")
          .then(function() {
            return localStorage.getItem("allEvents");
          })
          .then(function(value) {
            context.commit("setEvents", JSON.parse(value));
            alert("fine");
          });
      }
    },
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
          .then((querySnapshot) => {
            const doneEvetns = [];
            querySnapshot.forEach((doc) => {
              const numberOfKeys = Object.keys(doc.data()).length;
              if (numberOfKeys !== 0) {
                doneEvetns.push({ ...doc.data() });
              }
            });
            console.log(doneEvetns);
            context.commit("setDoneEvents", doneEvetns);
            localStorage.setItem("finishEvent", JSON.stringify(doneEvetns));
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        asyncLocalStorage
        .getItem("finishEvent")
        .then(function() {
          return localStorage.getItem("finishEvent");
        })
        .then(function(value) {
          context.commit("setDoneEvents", JSON.parse(value));
          alert("fine 4 done events");
        });
        alert("done events is already in local storage");
      }
    },
    setDoneEvents({ commit }, payload) {
      commit("setDoneEvents", payload)
    },
    pushEvent({ commit }, payload) {
      commit("pushEvent", payload);
    },
    pushDoneEvent({ commit }, payload) {
      commit("pushDoneEvent", payload);
    },
    spliceEvent({ commit }, payload) {
      commit("spliceEvent", payload);
    },
    spliceDoneEvent({ commit }, payload) {
      commit("spliceDoneEvent", payload);
    },
    saveDoneEvents(payload) {
      console.log(payload);
      let parsed = JSON.stringify(payload);
      localStorage.setItem("doneEvents", parsed);
    },
    updateEventData({ commit }, payload) {
      commit("updateEvent", payload);
    },
    setStart({ commit }, payload) {
      commit("setStart", payload);
    },
    setEnd({ commit }, payload) {
      commit("setEnd", payload);
    },
  },
  modules: {},
});
