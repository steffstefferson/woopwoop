<template>
  <div class="hello">
    <h1>{{metaData && metaData.title || 'Fotos'}}</h1>
    <template v-if="pictureVisible">
    <h2 v-if="photos.length === 0">Noch keine Fotos hochgeladen</h2>
   <ul>
      <li v-for="image in orderedPhotos" v-bind:key="image.imageKey"
       v-if="image.visible && image.loaded">
        <div class="image" v-bind:class="{ 'image_new': image.isNew}" v-bind:style="image.style">
        <img v-bind:src="image.thumbnailImage" v-bind:alt="image.imageKey" />
        <br/>Hochgeladen von {{image.uploader}}
        <br/>{{image.displayDate.length > 8 ? 'am' : 'um'}} {{ image.displayDate }}
        </div>
      </li>
    </ul>
    </template>
     <template v-if="metaData && !pictureVisible">
    <h2>Die Fotos werden ab
      {{publishDate}}
       angezeigt. <br/>Es wurden bereits {{photos.length}}
       Foto{{photos.length > 1 ? 's' : ''}} hochgeladen</h2>
    </template>
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
      photosToCache: [],
      lastLoadedImageDate: null,
      pictureVisible: false,
      metaData: null,
      publishDate: '',
    };
  },
  created: function created() {
    this.loadPhotos();
    getEventDetails(this.eventNr).then((d) => {
      this.metaData = d;
      this.pictureVisible = +new Date() > this.metaData.pictureVisibleFrom;
      if (!this.pictureVisible) {
        this.publishDate = `${new Date(
          this.metaData.pictureVisibleFrom,
        ).toLocaleDateString()} ${new Date(this.metaData.pictureVisibleFrom).toLocaleTimeString()}`;
      }
    });
  },
  computed: {
    orderedPhotos() {
      return this.photos.slice(0).sort((x, y) => x.imageKey < y.imageKey);
    },
  },
  methods: {
    canDelete: function canDelete(image) {
      return image.userId != null && image.userId === getCurrentUserId();
    },
    loadPhotos: function loadPhotos() {
      const cachedPhotos = JSON.parse(localStorage.getItem(`photosOf${this.eventNr}`));
      if (cachedPhotos) {
        cachedPhotos.forEach((x) => {
          this.appendPhoto(x);
        });
      }
      const that = this;
      return getPhotos(this.eventNr, (snapshot) => {
        that.lastLoadedImageDate = +new Date();
        this.addImageToCache(snapshot, that.lastLoadedImageDate);
        this.appendPhoto(snapshot);
      });
    },

    appendPhoto: function appendPhoto(newImage) {
      const image = newImage;
      if (this.photos.find((x) => x.imageKey === image.imageKey)) {
        // photo is already present
        return;
      }

      let random = newImage.imageKey % 9;
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
      image.loaded = false;
      if (image.visible) {
        const img = new Image();
        img.onload = function onload() {
          image.loaded = true;
        };
        img.src = image.thumbnailImage;
      }
      this.photos.unshift(image);
    },

    addImageToCache: function addImageToCache(img, loadedDate) {
      this.photosToCache.unshift(img);
      const that = this;
      setTimeout(() => {
        const isLastLoadedImage = that.lastLoadedImageDate === loadedDate;
        if (isLastLoadedImage) {
          localStorage.setItem(`photosOf${this.eventNr}`, JSON.stringify(this.photosToCache));
        }
      }, 3500);
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
