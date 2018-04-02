<template>
    <div class="woopform" style="">
        <h2>Schlüssel eingeben</h2>
            <div>
            <input type="text" v-model="eventKey"
            placeholder="xxxxxx" maxlength="eventKeyLength" width="60px"
            style="text-transform: lowercase;"
            @keyup="checkKeyChanged" />
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

    checkKeyChanged: function checkKeyChanged() {
      if (
        this.eventKey.length === this.eventKeyLength &&
        this.eventKey !== this.lastCheckedEventKey
      ) {
        this.lastCheckedEventKey = this.eventKey;
        setCookie('lastInsertedKey', this.eventKey, 7);
        this.checkKey();
      }
    },
    checkKey: function checkKey() {
      this.invalidKey = false;
      this.loading = true;
      getEventData(this.eventKey.toLowerCase()).then((data) => {
        if (data) {
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
.imagePreview {
  display: grid;
  grid-template-columns: 100px 80px auto;
  grid-column-gap: 10px;
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

.animate_90 {
  animation-name: animate_90;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}

@keyframes animate_90 {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(90deg);
  }
}

.animate_180 {
  animation-name: animate_180;
  animation-fill-mode: forwards;
  animation-duration: 1s;
}

@keyframes animate_180 {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(180deg);
  }
}

.animate_270 {
  animation-name: animate_270;
  animation-fill-mode: forwards;
  animation-duration: 1s;
}

@keyframes animate_270 {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(270deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.dropbox {
  outline: 2px dashed grey; /* the dash box */
  outline-offset: -10px;
  background: lightcyan;
  color: dimgray;
  padding: 10px 10px;
  min-height: 100px; /* minimum height */
  position: relative;
  cursor: pointer;
}

.input-file {
  opacity: 0; /* invisible but it's there! */
  width: 100%;
  height: 100px;
  position: absolute;
  cursor: pointer;
}

.dropbox:hover {
  background: lightblue; /* when mouse over to the drop zone, change color */
}

.dropbox p {
  font-size: 1.2em;
  text-align: center;
  padding: 20px 0;
}
</style>
