
async function saveImageLocal(image, imageTypeFolder, type, notifyFn) {
  const imageName = `${image.imageKey}.jpg`;
  const fileHandle = await imageTypeFolder.getFileHandle(imageName, { create: true });
  const writable = await fileHandle.createWritable({ keepExistingData: false });
  // Make an HTTP request for the contents.
  const response = await fetch(type === 'small' ? image.thumbnailImage : image.fullsizeImage);
  // Stream the response into the file.
  await response.body.pipeTo(writable);
  notifyFn(`Downloaded ${imageName}`, true);
  const style = `transform: rotate(${image.imageKey % 9 - 3}deg)`;

  const imageTemplate = `<li><div
    class="image" style="${style}">
    <img src="${type}_images/${imageName}" alt="Hochgeladen von ${image.uploader}" />
    <br/>Hochgeladen von ${image.uploader}
    <br/>${image.displayDate.length > 8 ? 'am' : 'um'} ${image.displayDate}
    </div></li>`;

  return imageTemplate;
}


async function writeHtmlFile(metaData, imgTags, eventFolderHandler, type) {
  const fileHandle = await eventFolderHandler.getFileHandle(`Images_${type}.html`, { create: true });
  const writable = await fileHandle.createWritable({ keepExistingData: false });
  const response = await fetch('static/StandaloneTemplate.html');
  const html = (await response.text())
    .replace('##pics##', imgTags.join(''))
    .replace('##downloadInfo##', `Downloaded at ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} with at total of ${imgTags.length} images.`)
    .replace(/##title##/g, metaData.title);
  writable.write(html);
  writable.close();

  console.log('saved StandaloneTemplate.html on local disk');
}

async function saveImagesOfType(metaData, images, eventFolderHandler, type, notifyFn) {
  const imageTypeFolder = await eventFolderHandler.getDirectoryHandle(`${type}_images`, {
    create: true,
  });

  const mapFn = (image) => saveImageLocal(image, imageTypeFolder, type, notifyFn);
  const elementsTask = images.map(mapFn);

  return Promise.all(elementsTask).then(async(imgTags) => {
    console.log(`saved ${imgTags.length} images of type ${type} on local disk`);
    await writeHtmlFile(metaData, imgTags, eventFolderHandler, type);
  });
}


export default async function downloadEvent(metaData, images, notifyFn) {
  const directoryHandle = await window.showDirectoryPicker({
    startIn: 'documents',
  });

  const eventFolderHandler = await directoryHandle.getDirectoryHandle(`Event-${metaData.title}-${+new Date()}`, {
    create: true,
  });
  notifyFn(`start downloading ${images.length * 2} Images...`);

  return Promise.all([
    await saveImagesOfType(metaData, images, eventFolderHandler, 'large', notifyFn),
    await saveImagesOfType(metaData, images, eventFolderHandler, 'small', notifyFn),
  ]);
}
