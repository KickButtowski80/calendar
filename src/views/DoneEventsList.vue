<template>
  <div>
    <v-card
      v-for="event in doneEventList"
      :key="`${event.name}-${event.start}-${event.end}`"
      class="mt-5 mb-5"
      max-width="344"
    >
      <v-card-text>
        <p class="title text--primary">
          {{ event.name }}
        </p>
        <div class="text--primary">
          {{ shortenDetail(event.detail) }}
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn
          text
          color="deep-purple accent-4"
          v-bind:to="'/done-events-list/' + event.name"
        >
          Read More
        </v-btn>
      </v-card-actions>
    </v-card>
    <div>
      {{ doneEventList }}
    </div>
  </div>
</template>
<script>
export default {
  name: "DoneEventsList",
  // props:{
  //     doneEventsList:{
  //         type: Array,
  //         required: true
  //     }
  // },
  beforeCreate() {
  
  },

  created() {
   
  },
  data() {
    return {
      // The data method is only fired once during initialization,
      //  before the computed properties are set up. So, referencing
      //   currentArea from within the data method won't work as it will 
      //   be undefined at the time of execution.
      // // doneEventList: null,
    };
  },
  computed: {
    doneEventList() {
      return this.$store.getters.doneEvents;
    },
  },
  methods: {
    shortenDetail(detail) {
      if (detail.length >= 10) return detail.slice(0, 9) + "...";
      else return detail;
    },
  },
};
</script>
<style lang="css" scoped>
.v-card {
  display: inline-block;
}
</style>
