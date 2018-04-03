<template>
    <div class="woopform" style="">
        <h2>Zum Event</h2>
          <div class="label">Schlüssel</div>
          <div>
            <input type="text" v-model="eventKey"
            placeholder="xxxxxx" maxlength="eventKeyLength" width="60px"
            style="text-transform: lowercase;"
            @keyup="checkKeyChanged" />
            </div>
                  <div class="buttons">
          <input type="button" v-on:click="checkKeyClicked" value="Weiter"
          v-bind:disabled="loading || this.eventKey.length !== this.eventKeyLength" />
      </div>
        <div class="loadingInfo loading"
        v-show="loading">
            <div class="loader">
            </div>
            <p v-show="loading">Daten werden geladen</p>
        </div>
        <div class="loadingNok loading" v-show="invalidKey">
            <p>Ungültiger Schlüssel</p>
        </div>
        <ul>
          <li>
            <a href="/#/createEvent">> Event erstellen</a>
          </li>
          <li>
            <a href="/#/event/xxxxxx/view">> Beispiel Event anschauen</a>
          </li>
        </ul>
    </div>
</template>

<script>
import { getEventData } from '@/services/dataprovider';
import config from '@/config';
import { setCookie, getCookie } from '@/services/cookieprovider';

export default {
  name: 'HomeScreen',
  data() {
    return {
      eventKey: null,
      loading: false,
      invalidKey: false,
      eventKeyLength: config.eventKeyLength,
      lastCheckedEventKey: null,
    };
  },
  created() {
    const { eventKey, autoSubmit } = this.calculateKey();
    this.eventKey = eventKey;

    if (autoSubmit) {
      this.checkKey();
    }
  },
  methods: {
    calculateKey: function calculateKey() {
      let autoSubmit = false;
      let key = '';
      if (this.$route.query.key) {
        key = this.$route.query.key;
        autoSubmit = true;
      }
      if (!key) {
        key = getCookie(
          'lastInsertedKey',
          location.href.indexOf('localhost') === -1 ? '' : 'xxxxxx',
        );
      }
      // todo remove this when live
      if (!key) {
        key = 'xxxxxx';
      }

      return { eventKey: key.toLowerCase(), autoSubmit };
    },

    checkKeyClicked: function checkKeyClicked() {
      this.checkKey();
    },
    checkKeyChanged: function checkKeyChanged() {
      if (
        this.eventKey.length === this.eventKeyLength &&
        this.eventKey !== this.lastCheckedEventKey
      ) {
        this.lastCheckedEventKey = this.eventKey;
        this.checkKey();
      }
    },
    checkKey: function checkKey() {
      this.invalidKey = false;
      this.loading = true;
      getEventData(this.eventKey.toLowerCase()).then((data) => {
        if (data) {
          setCookie('lastInsertedKey', this.eventKey, 7);

          this.$router.push({ path: `/event/${this.eventKey}/view` });
        } else {
          this.invalidKey = true;
        }
        this.loading = false;
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
  color: black;
  font-size: 12px;
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
