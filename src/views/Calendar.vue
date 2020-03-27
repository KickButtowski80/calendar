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
          <v-toolbar-title>{{ title }}</v-toolbar-title>
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
          :events="events"
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
              <v-btn text color="green" @click="doneEvent">
                {{ selectedEvent.done ? "unDone" : "Done" }}
              </v-btn>
              <v-btn text color="error" @click="delEvent">
                Remove
              </v-btn>
              <v-btn text color="secondary" @click="selectedOpen = false">
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
      <v-btn color="success" v-on:click="saveDoneEvents"
        >Save Done Events</v-btn
      >
    </v-col>
  </v-row>
</template>

<script>
import db from "../main";
import addEventForm from "../components/addEventForm";
// import DoneEventsList from "../views/DoneEventsList"

function emulateStrikethrough(string, hasStrike) {
  if (hasStrike) {
    return string
      .split("")
      .map(char => char + "\u0335")
      .join("");
  } else {
    return string.replace(/[\u0335]/g, "");
  }
}

export default {
  name: "Calendar",
  components: {
    "add-event": addEventForm
    // 'done-events-list': DoneEventsList
  },
  data() {
    return {
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
        "4day": "4 Days"
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
      events: [],
      dialog: false,
      // doneEvents: [],
      //trying to stablish busEvent
      count: 0
    };
  },
  beforeCreate() {
    console.log("before create");
    console.log(this);
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
    title() {
      const { start, end } = this;
      if (!start || !end) {
        return "wrong";
      }

      const startMonth = this.monthFormatter(start);
      const endMonth = this.monthFormatter(end);
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
      return this.$refs.calendar.getFormatter({
        timeZone: "UTC",
        month: "long"
      });
    }
  },
  methods: {
    async getEvents({ start, end }) {
      console.log("start date is" + JSON.stringify(start));
      let eventsArr = [];
      const querySnapshot = await db.collection("calEvent").get();
      if (querySnapshot.empty) {
        console.log("Error getting documents: ", querySnapshot);
        return;
      }
      querySnapshot.forEach(doc => {
        console.log("doc " + JSON.stringify(doc.data()));
        eventsArr.push({
          id: doc.id,
          color: doc.data().color,
          detail: doc.data().detail,
          end: doc.data().end,
          name: emulateStrikethrough(doc.data().name, doc.data().done),
          start: doc.data().start,
          done: doc.data().done
        });
      });
      console.log("eventsArr array is " + JSON.stringify(eventsArr));

      this.start = start;
      this.end = end;
      this.events = JSON.parse(JSON.stringify(eventsArr));
      console.log(this.events);
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
      this.events.push(e);
    },
    delEvent() {
      console.log(this.selectedEvent.id);
      console.log(this.events);
      db.collection("calEvent")
        .doc(this.selectedEvent.id)
        .delete()
        .then(() => {
          console.log("Document successfully deleted!");
          this.selectedOpen = false;
          this.events.splice(
            this.events.findIndex(event => event.id === this.selectedEvent.id),
            1
          );
          console.log(this);
        })
        .catch(function(error) {
          console.error("Error removing document: ", error);
        });
    },
    doneEvent() {
      console.log("done event this is ");
      console.log(this);
      // console.log(localStorage.getItem(this.done));
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
        console.log("____info:");
        console.log(this.selectedEvent);
        // this.doneEvents.push(this.selectedEvent);
        // this.$store.commit("pushEvent", this.selectedEvent)
        this.$store.dispatch("pushEvent", this.selectedEvent);
        db.collection("calEvent")
          .doc(this.selectedEvent.id)
          .update({
            done: true
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
        // this.doneEvents.splice(
        //   this.doneEvents.findIndex(
        //     event => event.id === this.selectedEvent.id
        //   ),
        //   1
        // );
        // this.$store.commit('spliceEvent', this.selectedEvent.id)
        this.$store.dispatch("spliceEvent", this.selectedEvent.id);
        db.collection("calEvent")
          .doc(this.selectedEvent.id)
          .update({
            done: false
          })
          .then(function() {
            console.log("Document successfully updated!");
          })
          .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
          });
      }
      console.log("____info:");
      console.log(this.selectedEvent);
      console.log("------");     
      console.log("the done event");
    },
    saveDoneEvents() {
      
      this.$store.dispatch("saveDoneEvents", this.$store.getters.doneEvents);
    }
  }
};
</script>

<style>
.done {
  text-decoration: "line-through";
}
</style>
