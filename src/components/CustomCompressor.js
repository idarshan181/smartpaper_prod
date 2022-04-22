/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import Resizer from 'react-image-file-resizer';

const resizeFile = file =>
  new Promise(resolve => {
    Resizer.imageFileResizer(
      file, //file name
      3000, //max width
      3000, //ht
      'webp', //format
      80, //quality
      0, //rotation

      uri => {
        resolve(uri);
      },
      'file',
      720,
      1280
    );
  });

export default function CustomCompressor() {
  const [cFile, setCFile] = useState([]);
  const handleFile = async e => {
    const { files } = e.target;
    if (files.length === 0) return;
    const fileList = Object.values(files);
    fileList.map(async (file, id) => {
      console.log(`original-${id}`, file);

      await resizeFile(file)
        .then(res => {
          console.log(`using image resizer-${id}`, res);
          const blob = URL.createObjectURL(res);
          setCFile(prevState => [...prevState, blob]);
        })
        .catch(err => console.log(err));
    });
  };

  return (
    <div>
      <input
        type="file"
        multiple
        accept="image/*, .heic,.heif"
        id="compImage"
        name="compImage"
        onChange={handleFile}
      />
      {cFile &&
        cFile.map((img, id) => (
          <img src={img} key={id} alt={`Compressed IMage - ${id}`} />
        ))}
    </div>
  );
}
