<template>
<div v-if="info && info.status">
        <div class="loadingInfo loading" v-show="info.status == 'loading'">
            <MyLoader></MyLoader>
            {{info.text}}
        </div>
        <div class="loadingOk loading" v-show="info.status == 'ok'">
            <p> {{info.text}}</p>
        </div>

        <div class="loadingNok loading" v-show="info.status == 'nok'">
            <p> {{info.text}}</p>
        </div>
  </div>
</template>

<script>
import Loader from '@/components/Loader';

export default {
  name: 'Infobar',
  components: { MyLoader: Loader },
  props: ['info'],
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.loadingInfo {
  background-color: lightgray;
  border: 1px solid gray;
  padding: 7px;
}

.loadingOk {
  background-color: lightgreen;
  border: 1px solid gray;
}

.loadingNok {
  background-color: lightcoral;
  border: 1px solid gray;
}

.loading > p {
  margin: 6px;
}
</style>
