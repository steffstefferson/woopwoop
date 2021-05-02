<template>
  <div>
    <h1>{{metaData && metaData.title || 'Fotos'}}</h1>
    <div class="download">
      <button v-on:click="startDownload()" >Start download</button>
      <div class="downloadInfo" v-if="downloadInfo.state">
        <div class="downloadState" v-if="downloadInfo.state == 'completed'">
          Downloading completed
          </div>
        <div class="downloadState" v-if="downloadInfo.state == 'failed'">
          Download failed
          </div>
        <div class="downloadState" v-if="downloadInfo.state == 'running'">
          Downloading... {{downloadInfo.progress}}%
            </div>
        <div class="chunk" v-for="chunkInfo in downloadInfo.chunkInfos" v-bind:key="chunkInfo.tick">
            {{chunkInfo.text}}
          </div>
      </div>
    </div>

    <template v-if="metaData && metaData.pictureVisible">
    <h2 v-if="photos.length === 0 && !nophotos">
      <MyLoader></MyLoader>
      Fotos werden geladen
    </h2>
    <h2 v-if="photos.length === 0 && nophotos">Noch keine Fotos hochgeladen</h2>
    <ul>
      <li v-for="image in orderedPhotos" v-bind:key="image.uploadDate">
        <div v-if="image.visible && image.loaded" v-on:click="startDiashow(image.imageKey)"
        class="image" v-bind:class="{ 'image_new': image.isNew}" v-bind:style="image.style">
        <img v-bind:src="defineUrl(image)" v-bind:alt="image.imageKey" />
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
import Loader from '@/components/Loader';
import downloadEvent from '@/services/filedownload';

export default {
  name: 'EventView',
  components: { MyLoader: Loader },
  data() {
    return {
      eventNr: this.$route.params.eventNr,
      photos: [],
      nophotos: false,
      metaData: null,
      downloadInfo: {
        downloadedImages: 0,
        totalImages: 0,
        progress: 0,
        chunkInfos: [],
        state: '',
      },
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
    startDownload() {
      this.downloadInfo = {
        downloadedImages: 0,
        totalImages: this.photos.length * 2,
        progress: 0,
        chunkInfos: [],
        state: 'running',
      };
      this.addDownloadChunk('Download started');
      downloadEvent(this.metaData, this.photos, this.updateDownloadInfo).then(
        () => {
          this.addDownloadChunk('Download completed');
          this.downloadInfo.state = 'completed';
        },
        (ex) => {
          this.addDownloadChunk('Download failed :-(');
          this.addDownloadChunk(`${ex}`);
          this.downloadInfo.state = 'failed';
          console.log(ex);
        }).then(() => {
        setTimeout(() => {
          this.downloadInfo = {
            downloadedImages: 0,
            totalImages: 0,
            progress: 0,
            chunkInfos: [],
            state: '',
          };
        }, 20000);
      });
    },
    addDownloadChunk(text) {
      this.downloadInfo.chunkInfos.push({ text, tick: +new Date() });
      if (this.downloadInfo.chunkInfos.length > 5) {
        this.downloadInfo.chunkInfos.shift();
      }
    },
    updateDownloadInfo(text, imageDownloaded) {
      this.addDownloadChunk(text);
      if (imageDownloaded) {
        this.downloadInfo.downloadedImages = this.downloadInfo.downloadedImages + 1;
        const progress = this.downloadInfo.downloadedImages * 100.0 / this.downloadInfo.totalImages;
        this.downloadInfo.progress = Math.round(progress, 2);
      }
    },
    canDelete: function canDelete(image) {
      return image.userId != null && image.userId === getCurrentUserId();
    },
    defineUrl: function defineUrl(image) {
      if (this.$route.query.download) {
        return image.fullsizeImage;
      }
      return image.thumbnailImage;
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
      return getPhotos(this.eventNr, false, (snapshot, err) => {
        if (err === 'nophotos') {
          this.nophotos = true;
        } else {
          this.nophotos = false;
          if (snapshot) {
            this.appendPhoto(snapshot);
          }
        }
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

.download{
  border: solid 1px grey;
  position: absolute;
  right: 10px;
  margin-top: -30px;
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
.downloadInfo{
    position: fixed;
    top: 10px;
    right: 10px;
    border: solid 1px black;
    background-color: white;
    padding: 10px;
    z-index: 1;
}
.downloadState{
  font-weight: bold;
}
.chunk{
  text-align: left;
}

</style>
