<template>
  <div id="app">
    <router-view/>
    <MyMenu></MyMenu>
  </div>
</template>

<script>
import UploadPhoto from '@/components/UploadPhoto';
import Menu from '@/components/Menu';

export default {
  name: 'App',
  components: {
    // <my-component> will only be available in parent's template
    MyUploadPhoto: UploadPhoto,
    MyMenu: Menu,
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
html {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
*,
*:before,
*:after {
  -webkit-box-sizing: inherit;
  -moz-box-sizing: inherit;
  box-sizing: inherit;
}
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}

.woopform {
  display: grid;
  grid-template-columns: auto;
  max-width: 400px;
  text-align: left;
  background-color: lightblue;
  padding: 10px;
  border: solid 1px gray;
  margin: 10px auto;
  box-sizing: border-box;
}

@media (max-width: 600px) {
  .woopform {
    max-width: none;
    width: 100%;
    margin: 0px;
  }
}

.woopform > * {
  padding: 10px 5px;
}
.buttons {
  text-align: right;
}
</style>
