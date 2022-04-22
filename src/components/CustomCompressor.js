// import fs from "fs";
// import convert from "heic-convert";
// import heic2any from "heic2any";
// import { promisify } from "util";
import Resizer from 'react-image-file-resizer';

const resizeFile = file =>
  new Promise(resolve => {
    Resizer.imageFileResizer(
      file, //file name
      3000, //max width
      3000, //ht
      'png', //format
      100, //quality
      0, //rotation
      
      uri => {
        resolve(uri);
      },

      'file',
      1440,
      2560
    );
  });

  // const handleHeic = async (e) => {
  //   const {files} = e.target;
  //   if (files.length === 0) return;
  //   const fileList = Object.values(files);
  
  //   fileList.map((file, id) => {
  //     console.log(`heic img - ${id}`, file);
  //     console.log(file.stream());
  //     // const buffer = await new Blob([file], { type: "image/heic"}).arrayBuffer();
  //     // console.log(buffer.byteLength); 
  //     // const img = await convert ({
  //     //   buffer: file.stream(),
  //     //   format: "JPEG",
  //     //   quality: 1
  //     // });
  //     console.log(file);
  //   })
  // }  


export default function CustomCompressor() {
  const handleFile = async e => {
    const { files } = e.target;
    if (files.length === 0) return;
    let final = [];
    const fileList = Object.values(files);
    fileList.map((file, id) => {
      console.log(`original-${id}`, file);
      /* const out = resizeFile(file);
      console.log(out);
      final.push(out); */
      resizeFile(file)
        .then(res => {
          console.log(`resized-${id}`, res);
          final.push(res);
        })
        .catch(err => console.log(err));
    });
  };
  // const handleHeic = async e => {
  //   const { files } = e.target;
  //   if (files.length === 0) return;
  //   let final = [];
  //   const fileList = Object.values(files);
  //   fileList.map((file, id) => {
  //     console.log(`original ${id}`, file);
  //     const out = file.blob();
  //     heic2any()
  //   })
  // }
  // const handleHeic = async (e) => {
  //   const {files} = e.target;
  //   if (files.length === 0) return;
  //   const fileList = Object.values(files);
  
  //   fileList.map((file, id) => {
  //     console.log(`heic img - ${id}`, file);
  //     console.log(file.stream());
  //     // const buffer = await new Blob([file], { type: "image/heic"}).arrayBuffer();
  //     // console.log(buffer.byteLength); 
  //     // const img = await convert ({
  //     //   buffer: file.stream(),
  //     //   format: "JPEG",
  //     //   quality: 1
  //     // });
  //     console.log(file);
  //   })
  // }  
  
  return (
    <div>
      <input
        type="file"
        accept="image/*, .heic,.heif"
        id="compImage"
        name="compImage"
        onChange={handleFile}
      />
    </div>
  );
}
