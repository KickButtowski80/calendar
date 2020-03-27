<template>
  <div>
    <v-card class="mt-5 mb-5" max-width="344">
      <v-card-text>
        <p class="title text--primary">
          {{ doneEvent.name }}
        </p>
        <div class="text--primary">
          {{ doneEvent.detail }}
        </div>
        <div class="text--primary">Status: {{ status(doneEvent.done) }}</div>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
export default {
  name: "DoneEvent",
  props: ["name"],
  computed: {
    doneEvent() {
      return this.$store.getters.doneEvent(this.name);
    }
  },
  methods: {
    status(st) {
      if (st === true) return "done";
    }
  }
};
</script>
