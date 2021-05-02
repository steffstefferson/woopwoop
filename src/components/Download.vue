<template>
      <div class="download">
      <button class="downloadIcon" v-on:click="startDownload()" alt="Download event data">💾</button>
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
        <div class="chunk" v-for="chunkInfo in downloadInfo.chunkInfos" v-bind:key="chunkInfo.id">
            {{chunkInfo.text}}
          </div>
      </div>
    </div>
</template>

<script>
import downloadEvent from '@/services/filedownload';

export default {
  name: 'Download',
  props: {
    dataLoader: Function,
  },
  data() {
    return {
      downloadInfo: {
        downloadedImages: 0,
        totalImages: 0,
        progress: 0,
        chunkInfos: [],
        state: '',
      },
    };
  },
  methods: {
    startDownload() {
      const dataToDownload = this.dataLoader();
      this.downloadInfo = {
        downloadedImages: 0,
        totalImages: dataToDownload.photos.length * 2,
        progress: 0,
        chunkInfos: [],
        state: 'running',
      };
      this.addDownloadChunk('Download started');
      downloadEvent(dataToDownload.metaData, dataToDownload.photos, this.updateDownloadInfo).then(
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
      this.downloadInfo.chunkInfos.push({ text, id: Math.random() });
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
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.download{
  position: absolute;
  right: 10px;
  margin-top: -10px;
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
.downloadIcon {
    font-size:22px;
    margin: 15px;
    width: 50px;
    height: 50px;
    background-color: #c2d0dd;
    border: 1px solid black;
    -webkit-box-shadow: 0 0 2px #ccc;
    box-shadow: 0 0 2px #ccc;
    border-radius: 25px;
    cursor: pointer;
}
.downloadIcon:hover{
  font-size:26px;
  background-color: #3d6386;
}
</style>
