<template>
  <div id="app">
    <router-view/>
    <MyMenu></MyMenu>
    <div class="newVersion" v-show="newVersionAvailable">Es ist eine neue Version verfügbar! <br/>
    Willst du die Seite neu laden?
    <button v-on:click="yesPlease()">Ja</button>
    <button v-on:click="nope()">Nein</button>
    </div>
  </div>
</template>

<script>
import UploadPhoto from '@/components/UploadPhoto';
import Menu from '@/components/Menu';
import initSwipe from '@/services/pureswipe';
import Vue from 'vue';
import reportError from '@/services/errorhandler';

Vue.config.errorHandler = function errorHandler(err, vm, info) {
  reportError(`[Global Error Handler]: Error in ${info}: ${err}`, err);
};

initSwipe();

export default {
  name: 'App',
  components: {
    // <my-component> will only be available in parent's template
    MyUploadPhoto: UploadPhoto,
    MyMenu: Menu,
  },
  data() {
    return {
      newVersionAvailable: false,
    };
  },
  created() {
    window.newVersionAvailableHandler = this.gotnewversion;
  },
  methods: {
    gotnewversion() {
      this.newVersionAvailable = true;
    },
    yesPlease: function yesPlease() {
      window.location.reload();
    },
    nope: function nope() {
      this.newVersionAvailable = false;
    },
  },
};
</script>

<style>
/*  http://paletton.com/palette.php?uid=13z0u0kaVz84jP27qHbeJtFiHpX */
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}
html {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  background-color: #7794ae;
}
body {
  margin: 0px;
}
*,
*:before,
*:after {
  -webkit-box-sizing: inherit;
  -moz-box-sizing: inherit;
  box-sizing: inherit;
}
h1,
h2,
h3 {
  font-weight: normal;
  margin: 0px 0px 5px 0px;
}
h2 > img {
  height: 34px;
  width: auto;
  padding-right: 5px;
  vertical-align: bottom;
}

ul {
  list-style-type: none;
  padding: 0;
}

.woopform {
  display: grid;
  border: solid 10px white;
  grid-template-columns: auto;
  max-width: 400px;
  text-align: left;
  background-color: #9cb3c7;
  padding: 10px;
  margin: 10px auto 20px auto;
  box-sizing: border-box;
}

@media (max-width: 500px) {
  .woopform {
    max-width: none;
  }
}
button {
  font-size: 10px;
  background: #c2d0dd;
  color: black;
  padding: 4px;
  border: 1px solid black;
  border-radius: 3px;
  margin-bottom: 2px;
}

.woopform > * > input[type='text'],
input[type='email'],
input[type='date'] {
  border: 0px solid;
  padding: 5px;
  background: white;
  border-bottom: 1px solid gray;
  width: 80%;
  max-width: 300px;
}

.woopform > .label {
  padding: 15px 0px 5px 15px;
  font-size: 12px;
  font-weight: bold;
}

.woopform > div {
  padding-left: 20px;
}
.buttons {
  padding-top: 20px;
  text-align: right;
  width: 83%;
  max-width: 320px;
  padding-bottom: 10px;
}
.buttons > input {
  padding: 5px 15px;
  border-radius: 5px;
  border: 1px solid black;
  font-size: 12px;
  background: #c2d0dd;
  color: #3d6386;
}
.buttons > input:hover {
  background: #3d6386;
  color: #c2d0dd;
}

.buttons > input:disabled {
  background: #c2d0dd;
  color: #3d6386;
  cursor: not-allowed;
}

.newVersion {
  padding: 20px;
  border-top: 1px solid black;
  position: fixed;
  bottom: 0px;
  width: 100%;
  height: 80px;
  vertical-align: center;
  background: white;
}
</style>
