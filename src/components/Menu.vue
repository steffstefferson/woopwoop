<template>
<div class="bottomFixed">
  <div class="containerCamera">
    <div class="iconCamera" v-on:click="uploadClicked()"  v-show="!showForm">
        <div class="camera">
            <span></span>
        </div>
    </div>
   <div class="close"  v-on:click="closeClicked()" v-show="showForm"></div>
  </div>
  </div>
</template>

<script>
export default {
  name: 'Menu',
  data() {
    return { showForm: false };
  },
  watch: {
    $route(to) {
      this.showForm = to.name === 'UploadPhoto';
    },
  },
  methods: {
    closeClicked: function closeClicked() {
      this.$router.push({ path: '/view' });
    },
    uploadClicked: function uploadClicked() {
      this.$router.push({ path: '/upload' });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bottomFixed {
  position: fixed;
  bottom: 0px;
  right: 0px;
}

.iconCamera:hover .camera {
  transform: scale(1.1);
}

.containerCamera {
  position: absolute;
  right: 0px;
  bottom: 0px;
}
.iconCamera:hover {
  background-color: #e0e0e0;
}
.iconCamera {
  margin: 15px;
  width: 50px;
  height: 50px;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  box-shadow: 0 0 2px #ccc;
  position: relative;
  float: left;
  border-radius: 25px;
}

.camera {
  display: block;
  width: 70%;
  height: 50%;
  position: absolute;
  top: 30%;
  left: 15%;
  background-color: #000;
  border-radius: 5px;
  cursor: pointer;
}

.camera:before {
  content: '';
  display: block;
  width: 20px;
  border-bottom: 10px solid #000;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  position: absolute;
  top: -15%;
  left: 20%;
  border-radius: 5px;
}

.camera:after {
  content: '';
  display: block;
  width: 15px;
  height: 15px;
  border: 3px solid #fff;
  position: absolute;
  top: 15%;
  left: 40%;
  background-color: #000;
  border-radius: 25px;
}

.camera span {
  display: block;
  width: 8px;
  height: 4px;
  position: absolute;
  top: 8%;
  left: 10%;
  background-color: #fff;
}

.close {
  width: 50px;
  height: 50px;
  margin: 15px;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  -webkit-box-shadow: 0 0 2px #ccc;
  box-shadow: 0 0 2px #ccc;
  border-radius: 25px;
}

.close:hover {
  background-color: #e0e0e0;
}

.close:hover:before {
  animation-name: closeBefore;
  animation-duration: 1s;
}
.close:hover:after {
  animation-name: closeAfter;
  animation-duration: 1s;
}

@keyframes closeAfter {
  from {
    transform: rotate(45deg) scale(1.1);
  }
  to {
    transform: rotate(-45deg) scale(1.1);
  }
}

@keyframes closeBefore {
  from {
    transform: rotate(-45deg) scale(1);
  }
  to {
    transform: rotate(45deg) scale(1.1);
  }
}

.close:before,
.close:after {
  position: absolute;
  left: 39px;
  content: ' ';
  height: 40px;
  width: 4px;
  background-color: #333;
  top: 21px;
  background-color: #333;
  cursor: pointer;
}
.close:before {
  transform: rotate(45deg);
}
.close:after {
  transform: rotate(-45deg);
}
</style>
