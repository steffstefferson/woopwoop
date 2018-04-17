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
          v-bind:disabled="infoBarData.status == 'loading'
          || this.eventKey.length !== this.eventKeyLength" />
      </div>
        <MyInfobar v-bind:info="infoBarData"></MyInfobar>
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
import Infobar from '@/components/Infobar';

export default {
  name: 'HomeScreen',
  components: { MyInfobar: Infobar },
  data() {
    return {
      eventKey: null,
      eventKeyLength: config.eventKeyLength,
      infoBarData: {},
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
      this.infoBarData = { status: 'loading', text: 'Daten werden geladen' };
      getEventData(this.eventKey.toLowerCase()).then((data) => {
        if (data) {
          setCookie('lastInsertedKey', this.eventKey, 7);

          this.$router.push({ path: `/event/${this.eventKey}/view` });
        } else {
          this.infoBarData = { status: 'nok', text: 'Ungültiger Schlüssel' };
        }
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
</style>
