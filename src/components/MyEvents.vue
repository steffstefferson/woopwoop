<template>
  <div class="woopform" style="">
    <h2><img src="./../assets/favicon48.png" alt="woop woop">Favoriten</h2>
<ul>
      <li v-for="event in favoriteEvents" v-bind:key="event.eventKey">
        <div>
          <h2>{{event.title}}</h2>
        <br/>
        EventKey: {{event.eventKey}}
        </div>
        <div class=links>
          <a v-bind:href="getEventUrl(event)">Event-Link</a><br/>
          <template v-if="event.adminKey">
          <a v-bind:href="getAdminUrl(event)">Admin-Link</a><br/>
          </template>
          <a v-on:click="deleteFavorite(event)" href="javascript:return false;">Favorit Löschen</a>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { getFavoriteEvents, removeFavoriteEvent } from '@/services/favoriteeventmanager';
import { createAdminLink, createEventLink } from '@/services/linkhelper';

export default {
  name: 'MyEvents',
  data() {
    return {
      favoriteEvents: [],
    };
  },
  created: function created() {
    this.favoriteEvents = getFavoriteEvents();
  },
  methods: {
    deleteFavorite: function deleteFavorite(event) {
      this.favoriteEvents = removeFavoriteEvent(event.eventKey);
    },
    getAdminUrl: function getAdminUrl(event) {
      return createAdminLink(event.eventKey, event.adminKey);
    },
    getEventUrl: function getEventUrl(event) {
      return createEventLink(event.eventKey);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

li {
  display: grid;
  grid-template-columns: auto 200px;
  margin: 0 10px 20px 10px;
  font-size: 10px;
  width: 100%;
}
.links {
  margin: auto 0px auto 0px;
}

</style>
