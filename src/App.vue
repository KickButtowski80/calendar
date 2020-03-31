<template>
  <v-app>
    <v-content class="mt-2">
      <router-link to="/" tag="span" style="cursor: pointer">
        <v-btn color="primary">Home</v-btn>
      </router-link>
      <router-link
        :to="{ name: 'Calendar' }"
        tag="span"
        style="cursor: pointer"
      >
        <v-btn color="primary">Calendar</v-btn>
      </router-link>

      <router-link to="/done-events-list" tag="span" style="cursor: pointer">
        <v-btn color="primary">Done Events</v-btn>
      </router-link>

      <v-btn
        color="success"
        tag="span"
        style="cursor: pointer"
        v-show="check4Params"
      >
        {{ this.$route.params.name }}
      </v-btn>

      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",

  mounted(){

  },
  beforeDestroy() {
    alert("before destroy")
    // if(localStorage.getItem("finishEvent")){
    //   localStorage.clear()
    // }
  },
  data: () => ({}),
  computed: {
    check4Params() {
      return typeof this.$route.params.name !== "undefined" ? true : false;
    }
  }
};
</script>
<style lang="scss">
.router-link-exact-active .theme--light.v-btn:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
  background-color: #4caf50 !important ;
}

.theme--light.v-btn:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) button {
  background-color: #4caf50 !important ;
}
</style>
