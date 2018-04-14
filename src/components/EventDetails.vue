<template>
    <div class="woopform" style="max-width:600px"  v-if="metadata">
    <h2>Eventdetails</h2>

    <div class="label">Name:</div>
    <div> {{metadata.title}}</div>

    <div class="label">Datum: </div>
    <div>{{new Date(metadata.eventDate).toLocaleDateString()}}</div>

    <template v-if="metadata.publishDate">
      <div class="label">Bilder sichtbar ab: </div>
      <div>{{metadata.publishDate}}</div>
    </template>

    <div class="label">Kontaktemail:</div>
    <div>{{metadata.email}}</div>

    <div class="label">Adminlink: </div>
    <div>
        <input type="text" ref="txtAdminLink" v-bind:value="url+''+metadata.adminLink" />
        <button class="emoji" title="Adminlink kopieren"
        v-html=emojiCopyAdmin v-on:click="copyLinkAdmin()"></button>
        <a class="emoji" title="Event öffnen"
        v-bind:href="url+''+metadata.adminLink" target="_blank">&#x1F517;</a>
    </div>
    <div class="explain">
      Via Adminlink kannst du den Event bearbeiten, Fotos löschen
      und nach dem Event die Fotos in voller Grösse herunterladen.
      Bitte speichere diesen Link, es wird KEIN Email mit dem Link verschickt.
    </div>
    <div class="label">Eventschlüssel:</div>
    <div>
      {{metadata.eventKey}}
    </div>
      <div  class="explain">
      Dieser Schlüssel brauchen
      deine Gäste um sich auf der <a href="/" target="_blank">
      Startseite</a> einzuloggen. Du kannst deinen Gästen aber
      auch den nachfolgenden Eventlink schicken. Mit diesem
      müssen die Gäste den Schlüssel nicht eingeben
      und werden direkt zum Event weitergeleitet.
    </div>

    <div class="label">Eventlink:</div>
    <div>
        <input type="text" ref="txtEventLink" v-bind:value="url+''+metadata.eventLink" />
        <button class="emoji" title="Link kopieren"
        v-html=emojiCopyEvent v-on:click="copyLinkEvent()"></button>
        <a class="emoji" title="Event öffnen"
        v-bind:href="url+''+metadata.eventLink" target="_blank">&#x1F517;</a>
    </div>
    <div class="label">QR-Code:</div>
    <div style="text-align: center;">
        <img v-bind:src="qrCodeBaseUrl+''+metadata.qrCodeUrl" />
    </div>
    <div class="explain">
        Dieser QR-Code beinhaltet den Eventlink.
        Der QR-Code kann ausgedruckt werden damit
        er von den Gästen mit einem QR-Reader abgescannt
        werden kann. Der Eventlink öffnet sich nach dem Scannen
        automatisch. Dadurch ersparst du deine
        Gästen das Eintippen der Url bzw. des Schlüssels.
    </div>

    <div class="label">Bilder herunterladen:</div>
    <div class="explain">
      Nach dem Event erscheint hier eine Downloadurl
      über welche du deine Bilder herunterladen kannst.
      Alle Daten zum Event inkl. Bilder
      werden 30 Tage nach dem Event gelöscht.
    </div>
</div>
</template>

<script>
export default {
  name: 'EventDetails',
  props: ['metadata'],
  data() {
    return {
      emojiCopyAdmin: '&#x1F4CB;',
      emojiCopyEvent: '&#x1F4CB;',
      url: location.href.substring(0, location.href.indexOf('#') + 1),
      qrCodeBaseUrl: ' https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=',
    };
  },
  methods: {
    copyLinkAdmin: function copyLinkAdmin() {
      if (this.copyLink(this.$refs.txtAdminLink)) {
        this.emojiCopyAdmin = '&#x1F44C;';
        window.setTimeout(() => {
          this.emojiCopyAdmin = '&#x1F4CB;';
        }, 2000);
      }
    },
    copyLinkEvent: function copyLinkEvent() {
      if (this.copyLink(this.$refs.txtEventLink)) {
        this.emojiCopyEvent = '&#x1F44C;';
        window.setTimeout(() => {
          this.emojiCopyEvent = '&#x1F4CB;';
        }, 2000);
      }
    },
    copyLink: function copyLink(txtLink) {
      txtLink.select();
      let success = false;
      try {
        const successful = document.execCommand('copy');
        const msg = successful ? 'successful' : 'unsuccessful';
        console.log(`Copy email command was ${msg}`);
        success = true;
      } catch (err) {
        console.log('Oops, unable to copy');
      }
      if (window.getSelection) {
        window.getSelection().removeAllRanges();
      } else if (document.selection) {
        document.selection.empty();
      }
      return success;
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

.explain {
  border-left: solid 1px white;
  padding: 4px 8px;
  margin-left: 20px;
  font-size: 14px;
  margin-top: 5px;
  width: 80%;
  line-height: 1.3;
}

.emoji {
  text-decoration: none;
  background-color: inherit;
  border: none;
}
</style>
