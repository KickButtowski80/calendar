<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn color="primary" dark v-on="on">Add Event</v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Add an Event</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="form">
            <v-row>
              <v-col cols="12">
                <v-text-field label="Name*" v-model="name"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="detail" v-model="detail"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Start*"
                  :rules="dateRules"
                  v-model="start"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="End*"
                  :rules="dateRules"
                  v-model="end"
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
        <v-btn color="blue darken-1" text @click="onSaveChanges">Create</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import moment from "moment";
import { calEventsCollection } from "../main";
export default {
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
      ]
    };
  },

  methods: {
    onSaveChanges() {
      if (this.$refs.form.validate()) {
        this.dialog = false; // Add a new document with a generated id.
        const newEvent = {
          name: this.name,
          detail: this.detail,
          start: this.start,
          end: this.end,
          color:
            "#" +
            Math.random()
              .toString(16)
              .slice(2, 8),
          done: false
        };
        calEventsCollection
          .add(newEvent)
          .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            this.$emit("addToEvents" , {...newEvent, id: docRef.id, done: false})
          })
          .catch(function(error) {
            console.error("Error adding document: ", error);
          });
      }
    }
  }
};

// function getUniqueListBy(arr, key) {
//     return [...new Map(arr.map(item => [item[key], item])).values()]
// }
</script>
