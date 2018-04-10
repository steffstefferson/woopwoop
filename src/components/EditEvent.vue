<template>
<div>
      <EventDetails v-bind:metadata="metaData"></EventDetails>
       <ul>
      <li v-for="image in orderedPhotos" v-bind:key="image.imageKey">
             <div class="closeContainer" v-if="canDelete(image)"
             v-on:click="deleteImage(image)" >
          <CloseIcon></CloseIcon>
          </div>
        <div class="image">
        <img v-bind:src="image.thumbnailImage" v-bind:alt="image.imageKey" />

        <br/>Name: {{ image.uploader }}
        <br/>UserAuthId: {{ image.userAuthId }}
        <br/>Sichtbar: {{ image.visible }}
        <br/>Datum: {{ new Date(image.uploadDate).toLocaleDateString()+" "+
        new Date(image.uploadDate).toLocaleTimeString() }}

        </div>
      </li>
    </ul>
</div>
</template>

<script>
import { getEventDetails, getPhotos, deletePhoto } from '@/services/dataprovider';
import EventDetails from '@/components/EventDetails';
import CloseIcon from '@/components/CloseIcon';
import getCurrentUserId from '@/services/authentification';

export default {
  name: 'EditEvent',
  components: {
    EventDetails,
    CloseIcon,
  },
  data() {
    return {
      eventNr: this.$route.params.eventNr,
      metaData: null,
      photos: [],
    };
  },
  computed: {
    orderedPhotos() {
      return this.photos.slice(0).sort((x, y) => x.imageKey < y.imageKey);
    },
  },
  created() {
    getEventDetails(this.eventNr).then((d) => {
      this.metaData = d;
    });
    getPhotos(this.eventNr, (snapshot) => {
      this.photos.push(snapshot);
    });
  },
  methods: {
    canDelete: function canDelete(image) {
      return (
        (image.userId != null && image.userId === getCurrentUserId()) ||
        (this.metaData.adminUserIds && this.metaData.adminUserIds[getCurrentUserId()] != null)
      );
    },
    deleteImage: function deleteImage(image) {
      deletePhoto(this.metaData.eventNr, image).then(() => {
        /* eslint no-param-reassign: "error" */
        image.visible = false;
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

.closeContainer {
  position: relative;
  top: 2px;
  right: 22px;
  height: 10px;
  width: 10px;
}

.image {
  padding: 10px;
  border: solid 1px grey;
  margin: 5px;
  background-color: white;
  box-shadow: 2px 2px 5px 0px #415c7394;
  text-align: left;
}
.image > img {
  max-width: 200px;
  max-height: 200px;
}
</style>
