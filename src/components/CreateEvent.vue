<template>
<div>
    <div class="woopform" style="" v-show="!metaData">
      <h2>Event erstellen</h2>
          <div class="label">Name des Events</div>
          <div><input type="text" v-model="title" placeholder="Name des Events" /></div>
          <div class="label">Datum des Events</div>
          <div><input type="date" v-model="eventDate" /></div>
          <div class="label">Emailadresse</div>
          <div><input type="email" v-model="email" placeholder="fred@gmail.com" /></div>
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
    </div>
    <div class="woopform" style="" v-if="metaData">
        <h2>Eventdetails</h2>
        <div class="label">Name:</div>
        <div> {{metaData.title}}</div>
        <div class="label">Datum: </div>
        <div>{{new Date(metaData.eventDate).toLocaleDateString()}}</div>
        <div class="label">Kontaktemail:</div>
        <div> {{metaData.email}}</div>
        <div class="label">Adminlink: </div>
        <div><input type="text" v-model="metaData.adminLink"/>
        <button class="emoji" v-html=emojiCopyAdmin v-on:click="copyLinkAdmin()"></button>
        <a class="emoji" v-bind:href="metaData.adminLink" target="_blank">&#x1F517;</a>
        </div>
        <div class="label">Eventlink: </div>
        <div><input type="text" v-model="metaData.eventLink"/>
        <button  class="emoji" v-html=emojiCopyEvent v-on:click="copyLinkEvent()"></button>
        <a class="emoji" v-bind:href="metaData.eventLink" target="_blank">&#x1F517;</a>
        </div>
        <div class="label">QR-Code:</div>
        <div style="padding-left: 20px;">
          <img v-bind:src="metaData.qrCodeUrl" />
          </div>
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
      email: location.href.indexOf('localhost') === -1 ? '' : 'stef@gmail.com',
      metaData: null,
      emojiCopyAdmin: '&#x1F4CB;',
      emojiCopyEvent: '&#x1F4CB;',
      url: location.href.substring(0, location.href.indexOf('#') + 1),
      qrCodeBaseUrl: ' https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=',
    };
  },
  methods: {
    copyLinkAdmin: function copyLinkAdmin() {
      if (this.copyLink(this.metaData.adminLink)) {
        this.emojiCopyAdmin = '&#x1F44C;';
        window.setTimeout(() => {
          this.emojiCopyAdmin = '&#x1F4CB;';
        }, 2000);
      }
    },
    copyLinkEvent: function copyLinkEvent() {
      if (this.copyLink(this.metaData.eventLink)) {
        this.emojiCopyEvent = '&#x1F44C;';
        window.setTimeout(() => {
          this.emojiCopyEvent = '&#x1F4CB;';
        }, 2000);
      }
    },
    copyLink: function copyLink(link) {
      const emailLink = document.createElement('input');
      emailLink.value = link;
      emailLink.style = 'height:1px;width:1px';
      document.body.appendChild(emailLink);
      const range = document.createRange();
      range.selectNode(emailLink);
      window.getSelection().addRange(range);
      let success = false;
      try {
        const successful = document.execCommand('copy');
        const msg = successful ? 'successful' : 'unsuccessful';
        console.log(`Copy email command was ${msg}`);
        success = true;
      } catch (err) {
        console.log('Oops, unable to copy');
      }
      window.getSelection().removeRange(range);
      document.body.removeChild(emailLink);
      return success;
    },
    createEventClick: function createEventClick() {
      this.errorOccured = false;
      this.loading = true;
      createEvent({
        title: this.title,
        eventDate: +new Date(this.eventDate),
        eventDateString: new Date(this.eventDate).toLocaleString(),
        email: this.email,
      }).then((data) => {
        // const data = { title: this.title, eventDate: this.eventDate, email: this.email };

        if (data) {
          const eventLink = `${this.url}/event/${data.eventKey}/view`;
          this.metaData = {
            ...data,
            adminLink: `${this.url}/admin/${data.adminKey}`,
            eventLink,
            qrCodeUrl: `${this.qrCodeBaseUrl}${encodeURIComponent(eventLink)}`,
          };
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
.emoji {
  text-decoration: none;
  background-color: inherit;
  border: none;
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
