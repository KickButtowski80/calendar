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
    console.log("created");
    console.log(localStorage)
  
    alert(JSON.stringify(this.doneEventList))
  },
  mounted() {
    console.log("I am in done events list mounting");
    console.log(this.$store.getters.doneEvents);
    
    //   console.log(localStorage.vuex["doneEvents"])
    //   if(localStorage.vuex){
    //     console.log("done event list local storage")
    //     this.doneEventList={...localStorage.vuex}
    //   }
    console.log("local storage part is ");
    console.log(JSON.parse(this.doneEventList));
      this.doneEventList = JSON.parse(localStorage.getItem("finishEvent"));
  },
  data() {
    return {
      doneEventList: JSON.parse(localStorage.getItem("finishEvent"))
    };
  },
  methods: {
    shortenDetail(detail) {
      if (detail.length >= 10) return detail.slice(0, 9) + "...";
      else return detail;
    }
  }
};
</script>
<style lang="css" scoped>
.v-card {
  display: inline-block;
}
</style>
