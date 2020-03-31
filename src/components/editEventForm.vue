<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn text color="blue" dark v-on="on">Edit</v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Edit the Event</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="form">
            <v-row>
              <v-col cols="12">
                <v-text-field label="Name*" v-model="event.name"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea label="detail" v-model="event.detail"></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Start*"
                  :rules="dateRules"
                  v-model="event.start"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="End*"
                  :rules="dateRules"
                  v-model="event.end"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
        <small>*indicates required field</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="onSaveChanges">Edit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import moment from "moment";

export default {
  props: ["eventInfo"],
  data() {
    return {
      dialog: false,
      name: null,
      detail: null,
      start: null,
      end: null,
      dateRules: [
        v => !!v || "Date is required",
        v =>
          moment(v, "YYYY-MM-DD", true).isValid() ||
          "Date format must be YYYY-MM-DD"
      ],
      event: this.eventInfo
    };
  },
  methods: {
    onSaveChanges() {
      if (this.$refs.form.validate()) {
        this.dialog = false;
      }
    }
  }
};
</script>
