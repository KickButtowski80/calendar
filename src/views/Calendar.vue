<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat color="white">
          <add-event @addToEvents="addanEventToEvents"></add-event>
          <v-btn outlined class="mx-4" color="grey darken-2" @click="setToday">
            Today
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
          <v-toolbar-title>{{ monthTitle }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu bottom right>
            <template v-slot:activator="{ on }">
              <v-btn outlined color="grey darken-2" v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 days</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="allEvents"
          :event-color="getEventColor"
          :now="today"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="getEvents"
        ></v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card min-width="350px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-btn icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-toolbar-title
                v-html="selectedEvent.name"
                :style="
                  selectedEvent.done
                    ? 'text-decoration: line-through'
                    : 'text-decoration: none'
                "
              ></v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon>mdi-heart-outline</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <span
                v-html="selectedEvent.detail"
                :style="
                  selectedEvent.done
                    ? 'text-decoration: line-through'
                    : 'text-decoration: none'
                "
              >
                {{ selectedEvent }}
              </span>
            </v-card-text>
            <v-card-actions>
              <edit-event :eventInfo="selectedEvent"> </edit-event>

              <v-btn text color="green" @click="doneEvent">
                {{ selectedEvent.done ? "unDone" : "Done" }}
              </v-btn>
              <v-btn text color="error" @click="delEvent">
                Remove
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import db from "../main";
import addEventForm from "../components/addEventForm";
import editEventForm from "../components/editEventForm";

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
export default {
  name: "Calendar",
  components: {
    "add-event": addEventForm,
    "edit-event": editEventForm,
  },
  data() {
    return {
      monthTitle: "Loading Calendar...",
      today: new Date(
        new Date().getTime() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10),
      focus: new Date(
        new Date().getTime() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10),
      type: "month",
      typeToLabel: {
        month: "Month",
        week: "Week",
        day: "Day",
        "4day": "4 Days",
      },
      name: null,
      details: null,
      start: null,
      end: null,
      color: "",
      currentlyEditing: null, //id goes here? what id, we will see
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false, // if the dialog box is open or not
      dialog: false,
      count: 0,
    };
  },
  beforeCreate() {
    console.log("before create");
    console.log(this);
  },
  beforeDestroy() {
    console.log("before destroy");
  },
  created() {
    console.log("I am in created");
    console.log(this);
  },
  mounted() {
    console.log("I am in mounted");
    this.$refs.calendar.checkChange();
    console.log(this);
  },

  computed: {
    allEvents() {
      return this.$store.getters.events;
    },
    title() {
      const { start, end } = this.$store.state;

      console.log("I am in title");
      console.log(start + " " + end);
      if (!start || !end) {
        return "wrong";
      }
      const startMonth = this.monthFormatter(start);
      const endMonth = this.monthFormatter(end);
      console.warn("STARTEND: ", startMonth, endMonth);
      const suffixMonth = startMonth === endMonth ? "" : endMonth;

      const startYear = start.year;
      const endYear = end.year;
      const suffixYear = startYear === endYear ? "" : endYear;

      const startDay = start.day + this.nth(start.day);
      const endDay = end.day + this.nth(end.day);

      switch (this.type) {
        case "month":
          return `${startMonth} ${startYear}`;
        case "week":
        case "4day":
          return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`;
        case "day":
          return `${startMonth} ${startDay} ${startYear}`;
      }
      return "";
    },
    monthFormatter() {
      console.warn(this.$refs);
      return this.$refs.calendar.getFormatter({
        timeZone: "UTC",
        month: "long",
      });
    },
  },
  methods: {
    getEvents({ start, end }) {
      /*  Since, I am waiting for setStart,setEnd, and fetchEvents
    to return some values and make the start and end availabe
    for the title , this why ? we use this.monthTitle = this.title 
    at the end so  I am waiting for the value of start and end to be returned?*/

      // disptach is async
      this.$store.dispatch("fetchEvents", { start, end });
      // do not we need to use actions here ????
      this.$store.dispatch("setStart", start);
      this.$store.dispatch("setEnd", end);
      //this.title is computed property
      this.monthTitle = this.title;
    },
    getEventColor(ev) {
      return ev.color;
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    setToday() {
      this.focus = this.today;
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      console.log("show event ");
      console.log(nativeEvent);
      console.log(event);

      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => (this.selectedOpen = true), 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    nth(d) {
      return d > 3 && d < 21
        ? "th"
        : ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][d % 10];
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
    addanEventToEvents(e) {
      console.log("add an event to events " + JSON.stringify(e));
      this.$store.dispatch("pushEvent", e);
    },
    delEvent() {
      db.collection("calEvent")
        .doc(this.selectedEvent.id)
        .delete()
        .then(() => {
          console.log("Document successfully deleted!");
          this.selectedOpen = false;
          this.$store.dispatch("spliceEvent", this.selectedEvent.id);
        })
        .catch(function(error) {
          console.error("Error removing document: ", error);
        });
    },
    doneEvent() {
      //using strike overlay unicode
      if (!this.selectedEvent.done) {
        this.selectedEvent.name = emulateStrikethrough(
          this.selectedEvent.name,
          true
        );
        // this.selectedEvent.detail = this.selectedEvent.detail
        //   .split("")
        //   .map(char => char + "\u0335")
        //   .join("");

        this.selectedEvent.done = true;

        //  let finishEventLS = localStorage.getItem("finishEvent");

        // finishEventLS = finishEventLS ? JSON.parse(finishEventLS) : [];
        // finishEventLS.push(this.selectedEvent);
        // localStorage.setItem("finishEvent", JSON.stringify(finishEventLS));
        asyncLocalStorage
          .getItem("finishEvent")
          .then(() => {
            return JSON.parse(localStorage.getItem("finishEvent"));
          })
          .then((value) => {
            value.push(this.selectedEvent);
            // this.$store.dispatch("pushDoneEvent", this.selectedEvent);
             this.$store.dispatch("setDoneEvents", value);
            return value;
          })
          .then((value) => {
            localStorage.setItem("finishEvent", JSON.stringify(value));
          });

        db.collection("calEvent")
          .doc(this.selectedEvent.id)
          .update({
            done: true,
          })
          .then(function() {
            console.log("Document successfully updated!");
          })
          .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
          });
      } else {
        this.selectedEvent.name = emulateStrikethrough(
          this.selectedEvent.name,
          false
        );
        // this.selectedEvent.name = this.selectedEvent.name.replace(
        //   /[\u0335]/g,
        //   ""
        // );
        // this.selectedEvent.detail = this.selectedEvent.detail.replace(
        //   /[\u0335]/g,
        //   ""
        // );

        this.selectedEvent.done = false;

        asyncLocalStorage
          .getItem("finishEvent")
          .then(function() {
            return JSON.parse(localStorage.getItem("finishEvent"));
          })
          .then((value) => {
            value.splice(
              value.findIndex(
                (event) => event.name === this.selectedEvent.name
              ),
              1
            );
            this.$store.dispatch("spliceDoneEvent", this.selectedEvent.id);
            return value;
          })
          .then((value) => {
            localStorage.setItem("finishEvent", JSON.stringify(value));
          });

        db.collection("calEvent")
          .doc(this.selectedEvent.id)
          .update({
            done: false,
          })
          .then(function() {
            console.log("Document successfully updated!");
          })
          .catch(function(error) {
            console.error("Error updating document: ", error);
          });
      }
     
    },
  },
};
</script>

<style>
.done {
  text-decoration: "line-through";
}
</style>
