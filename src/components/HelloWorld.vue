<template>
  <div>
    <h1>{{metaData && metaData.title || 'Fotos'}}</h1>
    <template v-if="metaData && metaData.pictureVisible">
    <h2 v-if="photos.length === 0">Noch keine Fotos hochgeladen</h2>
    <ul>
      <li v-for="image in orderedPhotos" v-bind:key="image.uploadDate">
        <div v-if="image.visible && image.loaded" v-on:click="startDiashow(image.imageKey)"
        class="image" v-bind:class="{ 'image_new': image.isNew}" v-bind:style="image.style">
        <img v-bind:src="image.thumbnailImage" v-bind:alt="image.imageKey" />
        <br/>Hochgeladen von {{image.uploader}}
        <br/>{{image.displayDate.length > 8 ? 'am' : 'um'}} {{ image.displayDate }}
        </div>
      </li>
    </ul>
    </template>
    <template v-if="metaData && !metaData.pictureVisible">
    <h2>Die Fotos werden ab
      {{metaData.publishDate}}
      angezeigt. <br/>Es wurden bereits {{photos.length}}
      Foto{{photos.length == 1 ? '' : 's'}} hochgeladen.</h2>
    </template>
      <div class="about">
      <a href="/#/about">Info</a>
      </div>
  </div>

</template>

<script>
import { getPhotos, getEventDetails } from '@/services/dataprovider';
import getCurrentUserId from '@/services/authentification';

export default {
  name: 'HelloWorld',
  data() {
    return {
      eventNr: this.$route.params.eventNr,
      photos: [],
      metaData: null,
    };
  },
  created: function created() {
    this.loadPhotos();
    this.loadEventData();
  },
  computed: {
    orderedPhotos() {
      return this.photos.slice(0).sort((x, y) => y.uploadDate - x.uploadDate);
    },
  },
  methods: {
    canDelete: function canDelete(image) {
      return image.userId != null && image.userId === getCurrentUserId();
    },
    startDiashow: function startDiashow(imageKey) {
      this.$router.push({ path: `/event/${this.$route.params.eventKey}/diashow?key=${imageKey}` });
    },
    loadEventData: function loadEventData() {
      getEventDetails(this.eventNr).then((d) => {
        this.metaData = d;
      });
    },
    loadPhotos: function loadPhotos() {
      return getPhotos(this.eventNr, false, (snapshot) => {
        this.appendPhoto(snapshot);
      });
    },

    appendPhoto: function appendPhoto(newImage) {
      const image = newImage;
      // console.log(`got photo${newImage.imageKey}`);
      if (this.photos.find((x) => x.imageKey === image.imageKey)) {
        // photo is already present
        return;
      }

      let random = newImage.imageKey % 9;
      random -= 3;
      image.style = { transform: `rotate(${random}deg)` };

      const img = new Image();
      img.onload = () => {
        image.loaded = true;
        this.$forceUpdate();
      };
      img.src = image.thumbnailImage;

      this.photos.unshift(image);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
  font-size: 10px;
  color: inherit;
  text-decoration: none;
}
.about {
  /* width: 100%; */
  color: #0000006c;
  border-top: 1px solid #0000001f;
  border-right: 1px solid #0000001f;
  text-align: left;
  margin-left: 20px;
  padding: 2px 10px;
  border-radius: 15px 15px 0px 0px;
  position: fixed;
  bottom: 0px;
}
.about:hover {
  color: black;
  background: #c2d0dd;
  border-top: 1px solid black;
  border-right: 1px solid black;
}
li {
  display: inline-block;
  margin: 0 10px;
  font-size: 10px;
}

.image {
  padding: 10px;
  cursor: pointer;
  border: solid 1px grey;
  margin: 5px;
  background-color: white;
  box-shadow: 2px 2px 5px 0px #415c7394;
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
