import Resizer from 'react-image-file-resizer';

export const resizeFile = file =>
  new Promise(resolve => {
    Resizer.imageFileResizer(
      file, //file name
      720, //max width
      1280, //ht
      'jpeg', //format
      50, //quality
      0, //rotation
      uri => {
        resolve(uri);
      },
      'file',
      720,
      1280
    );
  });

  export const base64ToImage = (base64String) => {
    var image = new Image();
    image.src = base64String;
    return image
  }