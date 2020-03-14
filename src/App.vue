<template>
  <v-app>
    <v-content>
      <Calendar></Calendar>
    </v-content>
  </v-app>
</template>

<script>
import Calendar from './views/Calendar';

export default {
  name: 'App',

  components: {
    Calendar,
  },

  data: () => ({
    //
  }),
};
</script>
