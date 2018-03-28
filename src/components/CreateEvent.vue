<template>
<div>
    <div class="uploadForm" style="" v-show="!metaData">
      <h2>Eventdaten eingeben</h2>
          <div>
          <input type="text" v-model="title" placeholder="Name des Anlass" />
          <input type="date" v-model="eventDate" />
          </div>
      <div class="buttons">
          <input type="button" v-on:click="createEventClick" value="Erstellen"
          v-bind:disabled="loading" />
      </div>
      <div class="loadingInfo loading"
      v-show="loading">
          <div class="loader">
          </div>
          <p v-show="loading">Daten werden geladen</p>
      </div>
      <div class="loadingNok loading" v-show="errorOccured">
          <p>Beim erstellen des Events ist ein Fehler aufgetreten</p>
      </div>
    </div>
    <div class="uploadForm" style="" v-show="metaData">
        <h2>Eventdetails</h2>
        <p>Name: {{metaData.title}}</p>
        <p>Datum: {{new Date(metaData.eventDate).toLocaleDateString()}}</p>
        <p>Adminlink: {{url}}/admin/{{metaData.adminKey}}</p>
        <p>Eventlink: {{url}}/event/{{metaData.eventKey}}</p>
      </div>
    </div>
</template>

<script>
import { createEvent } from '@/services/eventmanager';

export default {
  name: 'HomeScreen',
  data() {
    return {
      title: location.href.indexOf('localhost') === -1 ? '' : 'Test Event',
      eventDate: location.href.indexOf('localhost') === -1 ? null : new Date(),
      loading: false,
      errorOccured: false,
      metaData: null,
      url: location.href.substring(0, location.href.indexOf('#') + 1),
    };
  },
  methods: {
    createEventClick: function createEventClick() {
      this.errorOccured = false;
      this.loading = true;
      createEvent(this.title, this.eventDate).then((data) => {
        if (data) {
          this.$router.push({ path: '/view' }, { eventNr: data.eventNr });
        } else {
          this.errorOccured = true;
        }
        this.loading = false;
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
li {
  padding: 5px;
  background-color: white;
  margin: 5px 0px;
  font-size: 14px;
}
.turnButton {
  width: 100%;
  font-size: 10px;
}
.uploadProgress {
  font-size: 12px;
  color: gray;
  margin: 5px;
}

.uploadForm {
  display: grid;
  grid-template-columns: auto;
  max-width: 400px;
  text-align: left;
  background-color: lightblue;
  padding: 10px;
  border: solid 1px gray;
  margin: 10px auto;
  box-sizing: border-box;
}

@media (max-width: 600px) {
  .uploadForm {
    max-width: none;
    width: 100%;
    margin: 0px;
  }
}

.uploadForm > * {
  padding: 10px 5px;
}
.buttons {
  text-align: right;
}

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
