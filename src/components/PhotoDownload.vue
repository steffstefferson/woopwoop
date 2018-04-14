<template>
<div class="woopform">
  <h2>Fotodownload</h2>
      Es werden insgesamt {{photos.length}} Fotos mit
      einer gesamt Grösse von {{totalSize}} MB heruntergeladen.<br/>
      <input type="button" v-on:click="startDownload"
      v-bind:disabled="downloadStarted" value="Download starten" />
</div>
</template>

<script>
import { getPhotos } from '@/services/dataprovider';
import { toMb } from '@/services/imageresize';

export default {
  name: 'ImageDownload',
  data() {
    return {
      eventNr: this.$route.params.eventNr,
      downloadStarted: false,
      photos: [],
    };
  },
  computed: {
    totalSize() {
      return toMb(this.photos.reduce((a, b) => a + b.file.size, 0));
    },
  },
  created() {
    getPhotos(this.eventNr, (snapshot) => {
      if (snapshot.visible) {
        this.photos.push(snapshot);
      }
    });
  },
  methods: {
    startDownload: function startDownload() {
      this.downloadStarted = true;
      this.photos.forEach((img) => {
        const theAnchor = document.createElement('a');
        theAnchor.href = `${img.fullsizeImage}.csv`;
        theAnchor.download = img.fullsizeImage;
        document.body.appendChild(theAnchor);
        theAnchor.click();
        theAnchor.remove();
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
