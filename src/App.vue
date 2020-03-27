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

      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",
 created(){
    console.log("created")
    this.$store.dispatch("fetchDoneEvents");
  },
  data: () => ({})
};
</script>
