import { addPhoto } from '@/services/dataprovider';
import { resizePhoto } from '@/services/imageresize';

export default function saveImage(metaData, fullsizeImage, eventName, progressHandlerFn) {
  return resizePhoto(fullsizeImage, 400).then((imageDetails) => {
    const enhancedMetaData = metaData;
    enhancedMetaData.file.dimesions = imageDetails.dimesions;
    return addPhoto(
      {
        metaData: enhancedMetaData,
        thumbnailImage: imageDetails.dataUrl,
        fullsizeImage,
      },
      eventName,
      progressHandlerFn,
    );
  });
}
