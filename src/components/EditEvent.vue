<template>
<div>
      <EventDetails v-bind:metadata="metaData"></EventDetails>
       <ul>
      <li v-for="image in photos" v-bind:key="image.imageKey">
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
import { getEventDetails, getPhotos } from '@/services/dataprovider';
import EventDetails from '@/components/EventDetails';

export default {
  name: 'EditEvent',
  components: {
    EventDetails,
  },
  data() {
    return {
      eventNr: this.$route.params.eventNr,
      metaData: null,
      photos: [],
    };
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
    createEventClick: function createEventClick() {},
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
  text-align: left;
}
.image > img {
  max-width: 200px;
  max-height: 200px;
}
</style>
