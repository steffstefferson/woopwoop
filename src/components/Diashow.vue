<template>
  <div v-if="metaData" style="margin-top: -50px;">

    <h1>{{metaData && metaData.title || 'Fotos'}}
      <MyLoader v-show="isLoadingNextImage"></MyLoader></h1>
    <template v-if="metaData.pictureVisible">
    <h2 v-if="photos.length === 0">Noch keine Fotos hochgeladen</h2>
        <div class="image" v-if="image && image.loaded">
        <img v-bind:src="image.imageUrlDiashow" v-bind:alt="image.imageKey" />
        <br/>Hochgeladen von {{image.uploader}}
        <br/>{{image.displayDate.length > 8 ? 'am' : 'um'}} {{ image.displayDate }}
        </div>
        <div class="navigation">
        <button v-on:click="showNextImage(null,1)" v-show="!autoNextOn">Zurück</button>
        <button v-on:click="showNextImage(null,-1)" v-show="!autoNextOn">Weiter</button>
        <br/>
        Bildintervall: <input type="number" v-model="intervalSeconds" style="width:30px"> Sekunde(n)
        <button v-on:click="toggleDiashow()">Diashow {{autoNextOn ? 'stoppen' : 'starten'}}</button>
        <button v-on:click="close()">Schliessen</button>
        </div>
    </template>
    <template v-if="metaData && !metaData.pictureVisible">
    <h2>Die Fotos werden ab
      {{metaData.publishDate}}
       angezeigt. <br/>Es wurden bereits {{photos.length}}
       Foto{{photos.length == 1 ? '' : 's'}} hochgeladen.</h2>
    </template>
  </div>
</template>

<script>
import { getPhotos, getEventDetails } from '@/services/dataprovider';
import getCurrentUserId from '@/services/authentification';
import Loader from '@/components/Loader';

export default {
  name: 'HelloWorld',
  components: { MyLoader: Loader },
  data() {
    return {
      eventNr: this.$route.params.eventNr,
      image: null,
      photos: [],
      intervalSeconds: 4,
      isLoadingNextImage: true,
      metaData: null,
      autoNextOn: false,
      autoNextOnTimeoutId: null,
    };
  },
  created: function created() {
    this.loadPhotos();
    getEventDetails(this.eventNr).then((d) => {
      this.metaData = d;
    });
    document.addEventListener('swiped-left', this.swipeLeft);
    document.addEventListener('swiped-right', this.swipeRight);
  },
  computed: {
    orderedPhotos() {
      return this.photos.slice(0).sort((x, y) => y.imageKey - x.imageKey);
    },
  },
  beforeDestroy() {
    window.clearInterval(this.autoNextOnTimeoutId);
    document.removeEventListener('swiped-left', this.swipeLeft);
    document.removeEventListener('swiped-right', this.swipeRight);
  },
  methods: {
    swipeLeft: function swipeLeft() {
      this.showNextImage(null, -1);
    },
    swipeRight: function swipeRight() {
      this.showNextImage(null, 1);
    },
    canDelete: function canDelete(image) {
      return image.userId != null && image.userId === getCurrentUserId();
    },

    toggleDiashow: function toggleDiashow() {
      this.autoNextOn = !this.autoNextOn;
      if (this.autoNextOn) {
        const timeoutFn = () => {
          this.showNextImage();
          if (this.autoNextOn) {
            this.autoNextOnTimeoutId = window.setTimeout(
              timeoutFn,
              Math.max(this.intervalSeconds, 1) * 1000,
            );
          }
        };
        timeoutFn();
      } else {
        window.clearInterval(this.autoNextOnTimeoutId);
      }
    },
    close: function close() {
      this.$router.push({ path: `/event/${this.$route.params.eventKey}/view` });
    },
    loadPhotos: function loadPhotos() {
      return getPhotos(this.eventNr, false, (snapshot) => {
        this.appendPhoto(snapshot);
      });
    },

    appendPhoto: function appendPhoto(newImage) {
      // console.log(`got photo${newImage.imageKey}`);
      if (this.photos.find((x) => x.imageKey === newImage.imageKey)) {
        // photo is already present
        return;
      }
      const urlParamIsMatch = this.$route.query.key && +this.$route.query.key === newImage.imageKey;
      if (!this.image && (!this.$route.query.key || urlParamIsMatch)) {
        // prevent other image comming throw before first image is loaded
        this.image = {};
        this.showNextImage(newImage);
      }

      this.photos.unshift(newImage);
      this.$forceUpdate();
    },
    showNextImage: function showNextImage(tempImage = null, backForward = 1) {
      this.isLoadingNextImage = true;
      let imageToShow = tempImage;
      if (imageToShow === null) {
        if (this.image === null || this.image.imageKey == null) {
          imageToShow = this.orderedPhotos[0];
        } else {
          let index =
            this.orderedPhotos.findIndex((x) => x.imageKey === this.image.imageKey) + backForward;
          if (index === this.orderedPhotos.length) {
            index = 0;
          }
          if (index === -1) {
            index = this.orderedPhotos.length - 1;
          }
          imageToShow = this.orderedPhotos[index];
        }
      }
      const img = new Image();
      img.onload = () => {
        imageToShow.loaded = true;
        this.image = imageToShow;
        this.isLoadingNextImage = false;
        this.$router.replace({
          path: `/event/${this.$route.params.eventKey}/diashow?key=${imageToShow.imageKey}`,
        });
      };
      imageToShow.imageUrlDiashow = imageToShow.thumbnailImage;
      if (document.body.clientWidth >= 500) {
        imageToShow.imageUrlDiashow = imageToShow.fullsizeImage;
      }
      img.src = imageToShow.imageUrlDiashow;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.image {
  border: solid 10px white;
  grid-template-columns: auto;
  max-width: 80%;
  text-align: center;
  font-size: 12px;
  background-color: white;
  -webkit-box-shadow: 2px 2px 5px 0px #415c7394;
  box-shadow: 2px 2px 5px 0px #415c7394;
  margin: 10px auto;
  box-sizing: border-box;
}
.navigation {
  margin-top: 5px;
  line-height: 1.5;
}
.image > img {
  width: 100%;
  height: auto;
}

@media (max-width: 500px) {
  .image {
    max-width: none;
    width: 100%;
    margin: 0px;
  }
}
</style>
