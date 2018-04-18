<template>
    <div class="woopform" style="">
        <h2><img src="./../favicons/favicon48.png"
        alt="woop woop">Fotos hochladen</h2>
        <div class="label">Dein Name</div>
        <div>
            <input type="text" id="firstname" name="firstname"
             v-model="uploaderName" placeholder="Pesche Müller" />
        </div>
          <div class="dropbox">
        <input type="file" multiple :disabled="isSaving"
        v-on:change="filesChange($event.target.files)"
        accept="image/*" class="input-file">
            <p>
              {{files && files.length > 0 ? 'weitere' : ''}}<br v-if="files && files.length > 0" />
              Fotos auswählen / aufnehmen
            </p>
        </div>
        <ul v-if="files.length >0 ">
            <li class="imagePreview"  v-for="item in files" v-bind:key="item.name">
              <div class="imageTitle"><b>{{item.name}}</b> ({{toMb(item.size)}} MB)</div>
              <img v-if="item.data"
              v-bind:src="item.data"
              v-bind:alt="item.name"
              v-bind:class="[item.turnClass]"
              width="100px" />
            <div v-show="infoBarData.status!=='loading'">
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
              <button class="turnButton" v-on:click="deleteImage(item)">
              Löschen</button>
            </div>
            <div v-show="item.uploadStatus.percentage">
              <p class="uploadProgress">
                Uploading...<br/>
                {{item.uploadStatus.percentage}} % ({{item.uploadStatus.totalMb}} MB)
                </p>
            </div>
            </li>
          </ul>
        <div class="buttons">
            <input type="button" v-on:click="reset" value="Zurücksetzen"
            v-bind:disabled="infoBarData.status=='loading'" />
            <input type="button" v-on:click="upload" value="Hochladen"
            v-bind:disabled="infoBarData.status=='loading' || !uploaderName || files.length == 0"
            />
        </div>
        <div>
        <MyInfobar v-bind:info="infoBarData"></MyInfobar>
      </div>
    </div>
</template>

<script>
import saveImage from '@/services/imagesaver';
import { rotatePhoto, toMb } from '@/services/imageresize';
import { setCookie, getCookie } from '@/services/cookieprovider';

import Infobar from '@/components/Infobar';

export default {
  name: 'UploadPhoto',
  components: { MyInfobar: Infobar },
  data() {
    return {
      uploaderName: getCookie(
        'lastUploadName',
        location.href.indexOf('localhost') === -1 ? '' : 'Stef Käser',
      ),
      uploadStatus: '',
      isSaving: false,
      eventNr: this.$route.params.eventNr,
      files: [],
      infoBarData: {},
      status,
    };
  },
  methods: {
    filesChange: function filesChange(filesToUpload) {
      this.infoBarData = { status: 'loading', text: 'Fotos werden analysiert' };
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
        this.infoBarData = {};
      });
    },
    displayTurn(item, degree) {
      item.turnClass = `animate_${degree}`;
      this.$forceUpdate();
    },
    upload: function upload() {
      setCookie('lastUploadName', this.uploaderName, 7);
      this.infoBarData = { status: 'loading', text: 'Fotos werden hochgeladen' };
      this.isSaving = true;

      const promises = this.files.map(this.uploadImage);

      Promise.all(promises)
        .then(
          () => {
            this.infoBarData = { status: 'ok', text: 'Fotos erfolgreich hochgeladen' };
            this.$router.push({ path: `/event/${this.$route.params.eventKey}/view` });
            this.files = [];
          },
          (e) => {
            console.log('error', e);
            this.infoBarData = { status: 'nok', text: 'Beim Hochladen ist ein Fehler aufgetrete' };
          },
        )
        .then(() => {
          this.isSaving = false;
          setTimeout(() => {
            this.infoBarData = {};
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
    deleteImage: function deleteImage(fileToRemove) {
      this.files = this.files.filter((el) => el.name !== fileToRemove.name);
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
          totalMb: toMb(status.totalBytes),
        };
      });
    },
    toMb,
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
  grid-template-columns: auto 140px;
  grid-column-gap: 10px;
}
.imageTitle {
  grid-column: 1 / span 2;
  padding-bottom: 3px;
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
  padding: 0px;
}
</style>
