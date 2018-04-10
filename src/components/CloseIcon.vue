<template>
   <div class="close"></div>
</template>

<script>
export default {
  name: 'CloseIcon',
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.close {
  width: 30px;
  height: 30px;
  margin: 15px;
  background-color: #c2d0dd;
  border: 1px solid black;
  -webkit-box-shadow: 0 0 2px #ccc;
  box-shadow: 0 0 2px #ccc;
  border-radius: 50%;
  cursor: pointer;
}

.close:hover {
  background-color: #3d6386;
}

.close:hover:before {
  animation-name: closeBefore;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}
.close:hover:after {
  animation-name: closeAfter;
  animation-duration: 1s;
  animation-fill-mode: forwards;
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
  left: 28px;
  content: ' ';
  height: 24px;
  width: 3px;
  background-color: #333;
  top: 3px;
  cursor: pointer;
}
.close:before {
  transform: rotate(45deg);
}
.close:after {
  transform: rotate(-45deg);
}
</style>
