/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import { Button } from '@mui/material';
import { createRef, useEffect, useState } from 'react';
import { Image, Layer, Stage } from 'react-konva';
import useImage from 'use-image';
import Konva from 'konva';
import CustomDialog from './CustomDialog';
function Feedback({ url, width, height, metadata }) {
  const [image] = useImage(url, 'Anonymous');
  const resultImage = createRef();
  const stageRef = createRef();

  const [open, setOpen] = useState(false);
  const [ans, setAns] = useState();
  const handleClickOpen = item => {
    setAns(item);
    setOpen(true);
  };

  const handleClose = () => {
    // setTimeout(() => {
    //   setOpen(false);
    // }, 1500);
    setOpen(false);
  };
  const reportError = () => {
    if (
      window.confirm('Are you sure you want to report this answer for error?')
    ) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  const [state, setState] = useState({
    heightRatio: 0.56,
    widthRatio: 0.52
  });
  //Note: Use props instead of state to avoid re-rendering.
  useEffect(() => {
    if (image) {
      resultImage.current.cache();
    }

    let answers = [];
    let ansBox = [];
    const { height: imageHeight, width: imageWidth } =
      resultImage.current.attrs;
    const heightRatio = imageHeight / 1280;
    const widthRatio = imageWidth / 960;

    setState({
      heightRatio: heightRatio,
      widthRatio: widthRatio
    });
    if (metadata.length !== 0) {
      //metadata.data.map

      metadata.map((item, index) => {
        let res = {};
        res['studentAnswer'] = item.studentAnswer;
        res['correctAnswer'] = item.correctAnswer;
        res['color'] = item.color;
        res['coOrds'] = item.coOrds;
        res['queNo'] = item.queNo;
        res['cropsURL'] = item.cropsURL;
        answers.push(res);
      });
      drawAnswers(answers);
    }
    return null;
  }, [url, metadata]);

  const applyCache = () => {
    resultImage.current.cache();
  };

  const drawAnswers = async answers => {
    const stage = resultImage.current.getStage();
    const layer = resultImage.current.getLayer();
    const image = resultImage.current.getImage();

    const { height, width } = resultImage.current.attrs;
    const heightRatio = height / 1280;
    const widthRatio = width / 960;
    answers.map((item, index) => {
      let { x, y, h, w } = item.coOrds;
      let [b, g, r] = item.color;
      const { studentAnswer, correctAnswer } = item;
      const rect = new Konva.Rect({
        x: Math.floor((x - 10) * widthRatio),
        y: Math.ceil(y * heightRatio),
        width: Math.ceil(w * widthRatio),
        height: Math.ceil(h * heightRatio),
        stroke: `rgba(${r},${g},${b},2)`,
        strokeWidth: 1,
        fill: '',
        opacity: 0.7,
        draggable: false
      });

      layer.add(rect);
      rect.on('mouseover', () => {
        stage.container().style.cursor = 'pointer';
      });
      rect.on('mouseout', () => {
        stage.container().style.cursor = 'default';
      });
      rect.on('click', () => {
        handleClickOpen(item);
      });
    });
    stage.draw();
    // await Promise.all(setRect).then(() => {

    // });

    /* const ansBoxRatio = ansBoxHeight / imageHeight;
    const ansRatio = ansHeight / imageHeight;
    const ansBoxWidthRatio = ansBoxWidth / imageWidth;
    const ansWidthRatio = ansWidth / imageWidth;
    const ansBoxX = ansBoxWidthRatio * stageWidth;
    const ansBoxY = ansBoxRatio * stageHeight;
    const ansX = ansWidthRatio * stageWidth;
    const ansY = ansRatio * stageHeight;
    const ansBox = new Konva.Rect({
      x: ansBoxX,
      y: ansBoxY,
      width: ansBoxWidth,
      height: ansBoxHeight,
      fill: '#fff',
      stroke: '#000',
      strokeWidth: 1
    });
    const ans = new Konva.Text({
      x: ansX,
      y: ansY,
      text: answers,
      fontSize: 20,
      fontFamily: 'Open Sans',
      fill: '#000',
      padding: 10,
      align: 'center'
    });
    layer.add(ansBox);
    layer.add(ans);
    stage.draw(); */

    /* const ansRect = new Konva.Rect({
      x: x * widthRatio,
      y: y * heightRatio,
      width: w * widthRatio,
      height: h * heightRatio,
      fill: '',
      stroke: 'rgba(255,0,0,2)',
      strokeWidth: 1
    }); */
    // const ans = new Konva.Text({
    //   x: x * widthRatio + 50,
    //   y: y * heightRatio - 10,
    //   text: answer,
    //   fontSize: 20,
    //   fontFamily: 'Open Sans',
    //   fill: '#000',
    //   padding: 10,
    //   align: 'center'
    // });
    // layer.add(ansRect);
    // layer.add(ans);
    // stage.draw();
  };

  return (
    <div>
      <Stage
        width={width}
        height={height}
        style={{
          filter: 'drop-shadow(9px 9px 9px rgba(0, 0, 0, 0.3))',
          borderRadius: '8px',
          paddingTop: '8px'
        }}
      >
        <Layer>
          <Image
            ref={resultImage}
            image={image}
            alt="Result Image"
            brightness={0.1}
            shadowBlur={8}
            width={width}
            height={height}
            style={{
              marginTop: '2px'
            }}
            id="feedbackImage"
          />
        </Layer>
      </Stage>
      {ans && (
        <CustomDialog
          open={open}
          onClose={handleClose}
          title={'Student Answer'}
          ans={ans}
          reportError={reportError}
        />
      )}
    </div>
  );
}

export default Feedback;
