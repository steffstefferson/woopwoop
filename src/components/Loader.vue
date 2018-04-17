<template>
   <div class="loader"></div>
</template>

<script>
export default {
  name: 'Loader',
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  -webkit-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;
  display: inline-block;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
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
