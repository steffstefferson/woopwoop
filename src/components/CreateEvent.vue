<template>
    <div class="woopform" style="">
      <h2><img src="assets/favicon48.png"
        alt="woop woop">Event erstellen</h2>
          <div class="label">Name des Events</div>
          <div><input type="text" id="title" name="title"
          v-model="title" placeholder="Name des Events" /></div>
          <div class="label">Datum des Events</div>
          <div><input type="date" v-model="eventDate" /></div>
          <div class="label">Fotos sichtbar ab (leere Eingabe: Fotos sofort sichtbar)</div>
          <div><input type="date" style="width:62%" v-model="pictureVisibleFromDate" />
          <input type="text" style="width:15%;text-align: center;"
           max-length="5" v-model="pictureVisibleFromTime" placeholder="20:00" /></div>
          <div class="label">Emailadresse</div>
          <div><input type="email" id="email" name="email"
          v-model="email" placeholder="dein.name@gmail.com" /></div>
      <div class="buttons">
          <input type="button" v-on:click="close" value="Abbrechen"
          v-bind:disabled="infoBarData.status == 'loading'" />
           <input type="button" v-on:click="createEventClick" value="Erstellen"
          v-bind:disabled="infoBarData.status == 'loading'" />
      </div>
      <div>
        <MyInfobar v-bind:info="infoBarData"></MyInfobar>
  </div>
  </div>
</template>

<script>
import { createEvent } from '@/services/eventmanager';
import Infobar from '@/components/Infobar';

export default {
  name: 'CreateEvent',
  components: {
    MyInfobar: Infobar,
  },
  data() {
    return {
      title: location.href.indexOf('localhost') === -1 ? '' : 'Test Event',
      eventDate: location.href.indexOf('localhost') === -1 ? null : new Date(),
      pictureVisibleFromTime: '',
      pictureVisibleFromDate: null,
      email: location.href.indexOf('localhost') === -1 ? '' : 'stef@gmail.com',
      infoBarData: {},
    };
  },
  methods: {
    close: function close() {
      this.$router.push({ path: '/' });
    },
    createEventClick: function createEventClick() {
      this.infoBarData = { status: 'loading', text: 'Event wird erstellt' };

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
          this.infoBarData = {
            status: 'nok',
            text: 'Beim Erstellen des Events ist ein Fehler aufgetreten',
          };
        }
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
