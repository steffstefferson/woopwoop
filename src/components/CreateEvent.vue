<template>
  <div>
    <div class="woopform" style="" v-show="!metaData">
      <h2>Event erstellen</h2>
          <div class="label">Name des Events</div>
          <div><input type="text" v-model="title" placeholder="Name des Events" /></div>
          <div class="label">Datum des Events</div>
          <div><input type="date" v-model="eventDate" /></div>
          <div class="label">Fotos sichtbar ab (leere Eingabe: Fotos sofort sichtbar)</div>
          <div><input type="date" style="width:62%" v-model="pictureVisibleFromDate" />
          <input type="text" style="width:15%;text-align: center;"
           max-length="5" v-model="pictureVisibleFromTime" placeholder="20:00" /></div>
          <div class="label">Emailadresse</div>
          <div><input type="email" v-model="email" placeholder="dein.name@gmail.com" /></div>
      <div class="buttons">
          <input type="button" v-on:click="createEventClick" value="Erstellen"
          v-bind:disabled="loading" />
      </div>
      <div class="loadingInfo loading"
      v-show="loading">
          <div class="loader">
          </div>
          <p v-show="loading">Event wird erstellt</p>
      </div>
      <div class="loadingNok loading" v-show="errorOccured">
          <p>Beim erstellen des Events ist ein Fehler aufgetreten</p>
      </div>
  </div></div>
</template>

<script>
import { createEvent } from '@/services/eventmanager';
import EventDetails from '@/components/EventDetails';

export default {
  name: 'HomeScreen',
  components: {
    EventDetails,
  },
  data() {
    return {
      title: location.href.indexOf('localhost') === -1 ? '' : 'Test Event',
      eventDate: location.href.indexOf('localhost') === -1 ? null : new Date(),
      loading: false,
      pictureVisibleFromTime: '',
      pictureVisibleFromDate: null,
      errorOccured: false,
      email: location.href.indexOf('localhost') === -1 ? '' : 'stef@gmail.com',
      metaData: null,
      emojiCopyAdmin: '&#x1F4CB;',
      emojiCopyEvent: '&#x1F4CB;',
      url: location.href.substring(0, location.href.indexOf('#') + 1),
      qrCodeBaseUrl: ' https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=',
    };
  },
  methods: {
    createEventClick: function createEventClick() {
      this.errorOccured = false;
      this.loading = true;

      const pictureVisibleFrom = this.pictureVisibleFromDate
        ? new Date(this.pictureVisibleFromDate)
        : new Date(0);

      const [hours, minutes] =
        this.pictureVisibleFromTime && this.pictureVisibleFromTime.split(':');
      if (hours) {
        pictureVisibleFrom.setHours(hours);
      }
      if (minutes) {
        pictureVisibleFrom.setMinutes(minutes);
      }

      createEvent({
        title: this.title,
        pictureVisibleFrom: +pictureVisibleFrom,
        eventDate: +new Date(this.eventDate),
        eventDateString: new Date(this.eventDate).toLocaleString(),
        email: this.email,
      }).then((data) => {
        if (data) {
          this.$router.push({ path: data.adminLink });
        } else {
          this.errorOccured = true;
          this.loading = false;
        }
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.loadingInfo {
  background-color: lightgray;
  border: 1px solid gray;
}

.loadingOk {
  background-color: lightgreen;
  border: 1px solid gray;
}

.loadingNok {
  background-color: lightcoral;
  border: 1px solid gray;
}

.loadingInfo > * {
  float: left;
}
.loading > p {
  margin: 6px;
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  -webkit-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;
}
</style>
