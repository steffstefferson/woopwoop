<template>
    <div class="woopform" style="">
        <h2>Fotos hochladen</h2>
        <div class="label">Dein Name</div>
        <div>
            <input type="text" v-model="uploaderName" placeholder="Pesche Müller" />
        </div>
          <div class="dropbox">
        <input type="file" multiple :disabled="isSaving"
        v-on:change="filesChange($event.target.files)"
        accept="image/*" class="input-file">
            <p>
              Fotos hochladen
            </p>
        </div>
        <ul v-if="files.length >0 ">
            <li class="imagePreview"  v-for="item in files" v-bind:key="item.name">
              <img v-if="item.data"
              v-bind:src="item.data"
              v-bind:alt="item.name"
              v-bind:class="[item.turnClass]"
              width="100px" />
            <div>
              <button class="turnButton" v-on:click="turnImage(item,90)"
              v-bind:disabled="item.isImageTurning"
              v-on:mouseenter="displayTurn(item,90)"
              v-on:mouseleave="displayTurn(item,0)">
              drehen 90°</button>
              <button class="turnButton" v-on:click="turnImage(item,180)"
              v-bind:disabled="item.isImageTurning"
              v-on:mouseenter="displayTurn(item,180)"
              v-on:mouseleave="displayTurn(item,0)">
              drehen 180°</button>
              <button class="turnButton" v-on:click="turnImage(item,270)"
              v-bind:disabled="item.isImageTurning"
              v-on:mouseenter="displayTurn(item,270)"
              v-on:mouseleave="displayTurn(item,0)">
              drehen 270°</button>
            </div>
            <div>
              {{item.name}}
              <p class="uploadProgress" v-show="item.uploadStatus.percentage">
                Uploading...<br/>
                {{item.uploadStatus.percentage}} % ({{item.uploadStatus.totalMb}} MB)
                </p>
            </div>
            </li>
          </ul>
        <div class="buttons">
            <input type="button" v-on:click="reset" value="Zurücksetzen"
            v-bind:disabled="uploadStatus == 'uploading'" />
            <input type="button" v-on:click="upload" value="Hochladen"
            v-bind:disabled="uploadStatus == 'uploading' || !uploaderName || files.length == 0"
            />
        </div>
        <div class="loadingInfo loading"
        v-show="uploadingFilesToSite || uploadStatus == 'uploading'">
            <div class="loader">
            </div>
            <p v-show="uploadingFilesToSite">Fotos werden analysiert</p>
            <p v-show="uploadStatus == 'uploading'">Fotos werden hochgeladen</p>
        </div>

        <div class="loadingOk loading" v-show="uploadStatus == 'ok'">
            <p>Fotos erfolgreich hochgeladen</p>
        </div>

        <div class="loadingNok loading" v-show="uploadStatus == 'nok'">
            <p>Beim Hochladen ist ein Fehler aufgetreten</p>
        </div>
    </div>
</template>

<script>
import saveImage from '@/services/imagesaver';
import { rotatePhoto } from '@/services/imageresize';
import { setCookie, getCookie } from '@/services/cookieprovider';

export default {
  name: 'UploadPhoto',
  data() {
    return {
      uploaderName: getCookie(
        'lastUploadName',
        location.href.indexOf('localhost') === -1 ? '' : 'Stef Käser',
      ),
      uploadStatus: '',
      isSaving: false,
      uploadingFilesToSite: false,
      eventNr: this.$route.params.eventNr,
      files: [],
    };
  },
  methods: {
    filesChange: function filesChange(filesToUpload) {
      this.uploadingFilesToSite = true;
      const promises = [...filesToUpload].map((file) => {
        const promise = new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            console.log('onload it');
            resolve({
              data: reader.result,
              name: file.name,
              size: file.size,
              lastModified: file.lastModified,
              uploadStatus: {},
            });
          };
          reader.onerror = (e) => {
            // console.log('onerror it');
            reject(e);
          };
          // console.log('read it');
          reader.readAsDataURL(file);
        });
        return promise;
      });

      Promise.all(promises).then((loadedFiles) => {
        loadedFiles.filter((f) => f != null).forEach((x) => this.files.push(x));
        this.uploadingFilesToSite = false;
      });
    },
    displayTurn(item, degree) {
      item.turnClass = `animate_${degree}`;
      this.$forceUpdate();
    },
    upload: function upload() {
      setCookie('lastUploadName', this.uploaderName, 7);
      this.uploadStatus = 'uploading';
      this.isSaving = true;

      const promises = this.files.map(this.uploadImage);

      Promise.all(promises)
        .then(
          () => {
            this.uploadStatus = 'ok';
            this.$router.push({ path: `/event/${this.$route.params.eventKey}/view` });
            this.files = [];
          },
          (e) => {
            console.log('error', e);
            this.uploadStatus = 'nok';
          },
        )
        .then(() => {
          this.isSaving = false;
          setTimeout(() => {
            this.uploadStatus = '';
          }, 4000);
        });
    },
    turnImage: function turnImage(file, degree) {
      file.isImageTurning = true;
      rotatePhoto(file, degree).then((newData) => {
        file.data = newData;
        file.isImageTurning = false;
        file.turnClass = '';
        this.$forceUpdate();
      });
    },

    uploadImage: function uploadImage(file) {
      const defaultIdentity = +new Date();
      const identity = getCookie('identity', defaultIdentity);
      if (identity === defaultIdentity) {
        setCookie('identity', defaultIdentity, 30);
      }

      const metaData = {
        uploadDate: +new Date(),
        imageKey: +new Date(),
        uploadIdentity: +identity,
        uploader: this.uploaderName,
        visible: true,
        file: {
          name: file.name,
          size: file.size,
          lastModified: file.lastModified,
        },
        browser: {
          appName: navigator.appName,
          appVersion: navigator.appVersion,
          userAgent: navigator.userAgent,
          language: navigator.language,
          platform: navigator.platform,
        },
      };
      return saveImage(metaData, file.data, this.eventNr, (status) => {
        this.progressHandlerFn(metaData, status);
      });
    },
    progressHandlerFn: function progressHandlerFn(metaData, status) {
      console.log('status', status);
      this.files.filter((x) => x.name === metaData.file.name).forEach((file) => {
        /* eslint no-param-reassign: "error" */
        file.uploadStatus = {
          bytesTransferred: status.bytesTransferred,
          totalBytes: status.totalBytes,
          percentage:
            status.bytesTransferred === 0
              ? 0
              : Math.round(status.bytesTransferred / status.totalBytes * 100),
          totalMb: Math.round(status.totalBytes / 1024 / 1024 * 10, 1) / 10,
        };
      });
    },

    reset: function reset() {
      this.photoData = {};
      this.files = [];
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
.turnButton {
  width: 100%;
  font-size: 10px;
}
.uploadProgress {
  font-size: 12px;
  color: gray;
  margin: 5px;
}
.imagePreview {
  display: grid;
  grid-template-columns: 100px 80px auto;
  grid-column-gap: 10px;
}

.loadingInfo {
  background-color: lightgray;
  border: 1px solid gray;
}

.loadingOk {
  background-color: lightgreen;
  border: 1px solid gray;
}

.loadingNok {
  background-color: lightcoral;
  border: 1px solid gray;
}

.loadingInfo > * {
  float: left;
}
.loading > p {
  margin: 6px;
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  -webkit-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;
}

.animate_90 {
  animation-name: animate_90;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}

@keyframes animate_90 {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(90deg);
  }
}

.animate_180 {
  animation-name: animate_180;
  animation-fill-mode: forwards;
  animation-duration: 1s;
}

@keyframes animate_180 {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(180deg);
  }
}

.animate_270 {
  animation-name: animate_270;
  animation-fill-mode: forwards;
  animation-duration: 1s;
}

@keyframes animate_270 {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(270deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.dropbox {
  outline: 2px dashed grey;
  outline-offset: -10px;
  background: #c2d0dd;
  padding: 10px 10px;
  min-height: 100px;
  max-width: 276px;
  margin: 10px 0px 0px 20px;
  position: relative;
  cursor: pointer;
}

.input-file {
  opacity: 0; /* invisible but it's there! */
  width: 100%;
  height: 100px;
  position: absolute;
  cursor: pointer;
}

.dropbox:hover {
  background: #3d6386;
  color: #c2d0dd;
}

.dropbox p {
  font-size: 1.2em;
  text-align: center;
  padding: 20px 0;
}
</style>
