import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

// import * as firebase from 'firebase';
// more specific
import firebase from "firebase/app";
import "firebase/firestore";

import Calendar from "./views/Calendar";
import DoneEventsList from "./views/DoneEventsList";

 
Vue.component('Calendar', Calendar)
Vue.component('DoneEventsList', DoneEventsList)
require("dotenv").config();
Vue.config.productionTip = false;




const firebaseConfig = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.authDomain,
  databaseURL: process.env.VUE_APP_DATABASE_URL,
  projectId: "vue-calendar-it",
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId
};

firebase.initializeApp(firebaseConfig);

let db = firebase.firestore();
 

export default db;
export const calEventsCollection = db.collection("calEvent");

window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  e.returnValue = '  ';
  localStorage.removeItem("finishEvent")
  localStorage.removeItem("allEvents")
  return ''
});
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),

  created() {
    console.log("created in main vue");
    store.dispatch("fetchDoneEvents"); 
   
  } 
  
}).$mount("#app");
