<template>
  <div class="hello">
    <h1>Fotos</h1>
   <ul id="example-1">
      <li v-for="image in photos" v-bind:key="image.imageKey" v-show="image.visible">
        <div class="image" v-bind:class="{ 'image_new': image.isNew}" v-bind:style="image.style">
        <img v-bind:src="image.thumbnailImage" v-bind:alt="image.imageKey" />
        <br/>Hochgeladen von {{ image.uploader }}
        <br/>{{image.displayDate.length > 8 ? 'am' : 'um'}} {{ image.displayDate }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { getPhotos } from '@/services/dataprovider';

export default {
  name: 'HelloWorld',
  data() {
    return {
      eventNr: this.$route.params.eventNr,
      photos: [],
    };
  },
  created: function created() {
    this.loadPhotos();
  },
  methods: {
    loadPhotos: function loadPhotos() {
      return getPhotos(this.eventNr, (snapshot) => {
        const image = snapshot;
        let random = snapshot.imageKey % 9;
        random -= 3;
        image.style = { transform: `rotate(${random}deg)` };

        const upload = new Date(image.uploadDate);
        let uploadString = upload.toLocaleTimeString();
        const notToday = new Date(image.uploadDate).getDate() !== new Date().getDate();
        const olderThan24h = +new Date() - image.uploadDate > 24 * 60 * 60 * 1000;
        if (notToday || olderThan24h) {
          uploadString = `${upload.toLocaleDateString()} ${uploadString}`;
        }
        const olderThan30min = +new Date() - image.uploadDate > 30 * 60 * 1000;
        image.isNew = !olderThan30min;
        image.displayDate = uploadString;
        image.visible = false;
        const img = new Image();
        img.onload = function onload() {
          image.visible = true;
        };
        img.src = image.thumbnailImage;

        this.photos.unshift(snapshot);
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
li {
  display: inline-block;
  margin: 0 10px;
  font-size: 10px;
}

.image {
  padding: 10px;
  border: solid 1px grey;
  margin: 5px;
  background-color: white;
  box-shadow: 2px 2px 10px #ccb;
}

.image_new {
  animation-name: glowImage;
  animation-fill-mode: forwards;
  animation-duration: 5s;
}

@keyframes glowImage {
  from {
    opacity: 0.8;
    background-color: rgb(218, 228, 133);
    box-shadow: 6px 7px 26px #e0e019;
  }
  to {
    opacity: 1;
    background-color: white;
    box-shadow: 2px 2px 10px #ccb;
  }
}

.image > img {
  max-width: 200px;
  max-height: 200px;
}
</style>
