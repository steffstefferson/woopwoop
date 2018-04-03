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
/*  http://paletton.com/palette.php?uid=13z0u0kaVz84jP27qHbeJtFiHpX */
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
h2 {
  font-weight: normal;
  margin: 10px 0px 5px 0px;
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
  margin: 10px auto;
  box-sizing: border-box;
}
.woopform > * > input[type='text'],
input[type='email'],
input[type='date'] {
  border: 0px solid;
  padding: 5px;
  background: white;
  border-bottom: 1px solid gray;
  margin-left: 5px;
  width: 80%;
  max-width: 300px;
}

.woopform > .label {
  padding: 15px 0px 3px 15px;
  font-size: 12px;
}

@media (max-width: 500px) {
  .woopform {
    max-width: none;
    width: 100%;
    margin: 0px;
  }
}

.woopform > * {
  padding-left: 15px;
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
</style>
