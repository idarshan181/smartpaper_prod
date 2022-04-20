
import Resizer from 'react-image-file-resizer';
const resizeFile = file =>
  new Promise(resolve => {
    Resizer.imageFileResizer(
      file,
      3000,
      3000,
      'JPEG',
      80,
      0,
      uri => {
        resolve(uri);
      },
      'file'
    );
  });
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
      resizeFile(file).then(res => {
        console.log(`resized-${id}`, res);
        final.push(res);
      }).catch(err => console.log(err));
    });
  };
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
