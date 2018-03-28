const halfSize = function halfSize(i) {
  const canvas = document.createElement('canvas');
  canvas.width = i.width / 2;
  canvas.height = i.height / 2;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(i, 0, 0, canvas.width, canvas.height);
  return canvas;
};

const resizeLoadedImage = function resizeLoadedImage(image, size) {
  let mainCanvas = document.createElement('canvas');
  mainCanvas.width = image.width;
  mainCanvas.height = image.height;
  const ctx = mainCanvas.getContext('2d');
  ctx.drawImage(image, 0, 0, mainCanvas.width, mainCanvas.height);
  while (mainCanvas.width > size || mainCanvas.height > size) {
    mainCanvas = halfSize(mainCanvas);
  }
  return mainCanvas.toDataURL('image/jpeg');
};

function loadImage(src) {
  // perform some asynchronous operation, resolve or reject the promise when appropriate.
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = function onload() {
      resolve(img);
    };
    img.onerror = function onerror(e) {
      reject(e);
    };
    img.src = src;
  });
}

function resizePhoto(src, size) {
  // perform some asynchronous operation, resolve or reject the promise when appropriate.
  return loadImage(src).then((img) => {
    const dimesions = { height: img.height, width: img.width };
    const resized = resizeLoadedImage(img, size);
    return { dataUrl: resized, dimesions };
  });
}

function rotatePhoto(file, degree) {
  return loadImage(file.data).then((image) => {
    const canvas = document.createElement('canvas');
    const canvasContext = canvas.getContext('2d');

    switch (degree) {
      default:
      case 0:
        canvas.setAttribute('width', image.width);
        canvas.setAttribute('height', image.height);
        canvasContext.rotate(degree * Math.PI / 180);
        canvasContext.drawImage(image, 0, 0);
        break;
      case 90:
        canvas.setAttribute('width', image.height);
        canvas.setAttribute('height', image.width);
        canvasContext.rotate(degree * Math.PI / 180);
        canvasContext.drawImage(image, 0, -image.height);
        break;
      case 180:
        canvas.setAttribute('width', image.width);
        canvas.setAttribute('height', image.height);
        canvasContext.rotate(degree * Math.PI / 180);
        canvasContext.drawImage(image, -image.width, -image.height);
        break;
      case 270:
      case -90:
        canvas.setAttribute('width', image.height);
        canvas.setAttribute('height', image.width);
        canvasContext.rotate(degree * Math.PI / 180);
        canvasContext.drawImage(image, -image.width, 0);
        break;
    }
    return canvas.toDataURL('image/jpeg');
  });
}

export { rotatePhoto, resizePhoto };
