<template>
    <div class="woopform" style=""  v-if="metadata">
    <h2>Eventdetails</h2>
    <div class="label">Name:</div>
    <div> {{metadata.title}}</div>
    <div class="label">Datum: </div>
    <div>{{new Date(metadata.eventDate).toLocaleDateString()}}</div>
    <div class="label">Kontaktemail:</div>
    <div> {{metadata.email}}</div>
    <div class="label">Adminlink: </div>
    <div>
        <input type="text" v-bind:value="url+''+metadata.adminLink" />
        <button class="emoji" title="Adminlink kopieren"
        v-html=emojiCopyAdmin v-on:click="copyLinkAdmin()"></button>
        <a class="emoji" title="Event öffnen"
        v-bind:href="url+''+metadata.adminLink" target="_blank">&#x1F517;</a>
    </div>
    <div class="label">Eventlink: </div>
    <div>
        <input type="text" v-bind:value="url+''+metadata.eventLink" />
        <button class="emoji" title="Link kopieren"
        v-html=emojiCopyEvent v-on:click="copyLinkEvent()"></button>
        <a class="emoji" title="Event öffnen"
        v-bind:href="url+''+metadata.eventLink" target="_blank">&#x1F517;</a>
    </div>
    <div class="label">QR-Code:</div>
    <div style="padding-left: 20px;">
        <img v-bind:src="qrCodeBaseUrl+''+metadata.qrCodeUrl" />
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
      if (this.copyLink(this.metadata.adminLink)) {
        this.emojiCopyAdmin = '&#x1F44C;';
        window.setTimeout(() => {
          this.emojiCopyAdmin = '&#x1F4CB;';
        }, 2000);
      }
    },
    copyLinkEvent: function copyLinkEvent() {
      if (this.copyLink(this.metadata.eventLink)) {
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

.emoji {
  text-decoration: none;
  background-color: inherit;
  border: none;
}
</style>
