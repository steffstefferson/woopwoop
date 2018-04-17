<template>
    <div v-if="metaData" style="margin-top: -10px;">

        <h1>{{metaData && metaData.title || 'Fotos'}}
            <MyLoader v-show="isLoadingNextImage"></MyLoader>
        </h1>
        <template v-if="metaData.pictureVisible">
            <h2 v-if="photos.length === 0">Noch keine Fotos hochgeladen</h2>
            <div class="diashow" v-if="image && image.loaded">
                <div class="imageContainer">
                    <img v-bind:src="image.imageUrlDiashow" v-bind:alt="image.imageKey" />
                    <div>Hochgeladen von {{image.uploader}}
                        <br/>{{image.displayDate.length > 8 ? 'am' : 'um'}} {{ image.displayDate }}
                    </div>
                </div>
                    <div class="navigation">
                        <div>
                            <button v-on:click="showNextImage(null,1)"
                            v-show="!autoNextOn">Zurück</button>
                            <button v-on:click="showNextImage(null,-1)"
                            v-show="!autoNextOn">Weiter</button>
                        </div>
                        <div>
                            Bildintervall:
                            <input type="number" v-model="intervalSeconds"
                            style="width:30px"> Sekunde(n)
                            <button v-on:click="toggleDiashow()">
                                Diashow {{autoNextOn ? 'stoppen' : 'starten'}}</button>
                        </div>
                        <div>
                            <button v-on:click="close()">Schliessen</button>
                        </div>
                    </div>
            </div>

        </template>
        <template v-if="metaData && !metaData.pictureVisible">
            <h2>Die Fotos werden ab {{metaData.publishDate}} angezeigt.
                <br/>Es wurden bereits {{photos.length}}
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
      imageStyle: {},
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

      this.photos.unshift(newImage);
      if (!this.image && (!this.$route.query.key || urlParamIsMatch)) {
        // prevent other image comming throw before first image is loaded
        this.image = {};
        this.showNextImage(newImage);
      }
      this.$forceUpdate();
    },
    showNextImage: function showNextImage(tempImage = null, backForward = 1) {
      if (this.orderedPhotos.length === 0) {
        return;
      }
      this.isLoadingNextImage = true;
      let imageToShow = tempImage;
      if (imageToShow === null) {
        if (this.image === null || this.image.imageKey == null) {
          imageToShow = this.orderedPhotos[0];
        } else {
          const index = this.calculateIndex(backForward);
          imageToShow = this.orderedPhotos[index];
        }
      }
      const imageIndexToPreload = this.calculateIndex(backForward * 2);
      if (!isNaN(imageIndexToPreload)) {
        this.preloadImage(this.orderedPhotos[imageIndexToPreload]);
      }
      this.loadImage(imageToShow);
    },
    preloadImage: function preloadImage(imageToShow) {
      const img = new Image();
      img.onload = () => {};
      let preloadUrl = imageToShow.thumbnailImage;
      if (document.body.clientWidth >= 500) {
        preloadUrl = imageToShow.fullsizeImage;
      }
      img.src = preloadUrl;
    },
    calculateIndex: function calculateIndex(backForward) {
      // Math max if only one photo is in array
      let index =
        this.orderedPhotos.findIndex((x) => x.imageKey === this.image.imageKey) + backForward;
      if (index >= this.orderedPhotos.length) {
        index %= Math.max(this.orderedPhotos.length - 1, 1);
      }
      if (index <= -1) {
        index = Math.max(this.orderedPhotos.length + index, 0);
      }
      return index;
    },
    loadImage: function loadImage(imgLoad) {
      const imageToShow = imgLoad;
      const img = new Image();
      img.onload = () => {
        imageToShow.loaded = true;
        this.image = imageToShow;
        this.isLoadingNextImage = false;
        this.imageStyle = { background: `url(${imageToShow.imageUrlDiashow}) white` };
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
.diashow {
  position: fixed;
  top: 50px;
  left: 40px;
  right: 40px;
  bottom: 40px;
}

.imageContainer {
  border: solid 10px white;
  background-color: white;
  text-align: center;
  font-size: 12px;
  height: calc(100% - 25px);
  -webkit-box-shadow: 2px 2px 5px 0px #415c7394;
  box-shadow: 2px 2px 5px 0px #415c7394;
  box-sizing: border-box;
  height: fit-content;
  width: fit-content;
  margin: auto;
}
.navigation {
  margin: auto;
  margin-top: 10px;
  padding: 5px;
}

img {
  max-width: 100%;
  max-height: calc(100% - 70px);
}

@media (max-width: 500px) {
  .diashow {
    left: auto;
    right: auto;
  }
}

@media (min-width: 480px) {
  .navigation > div {
    display: inline;
  }
}
</style>
