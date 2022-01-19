/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import { Button } from '@mui/material';
import { createRef, useEffect, useState } from 'react';
import { Image, Layer, Stage } from 'react-konva';
import useImage from 'use-image';
import Konva from 'konva';
function Feedback({ url, width, height, metadata }) {
  const [image] = useImage(url, 'Anonymous');
  const resultImage = createRef();
  const [state, setState] = useState({
    heightRatio: 0,
    widthRatio: 0,
    ansBox: [],
    ans: []
  });
  //Note: Use props instead of state to avoid re-rendering.
  useEffect(() => {
    if (image) {
      resultImage.current.cache();
      // console.log(url);
    }
    let answers = [];
    let ansBox = [];
    if (metadata.length !== 0) {
      metadata.data.map((item, index) => {
        answers.push(item.ans);
        ansBox.push(item.ansBox);
      });
      drawAnswers(answers, ansBox);
    }
    /* if (metadata.length > 0) {
      // drawLabels();
      
    } */
    const { height: imageHeight, width: imageWidth } =
      resultImage.current.attrs;
    console.log(imageHeight, imageWidth);
    const heightRatio = imageHeight / 1280;
    const widthRatio = imageWidth / 960;

    setState(prevState => ({
      ...prevState,
      heightRatio: heightRatio,
      widthRatio: widthRatio,
      ansBox: ansBox.flat(),
      ans: answers.flat()
    }));
    return null;
  }, [url, metadata]);

  const applyCache = () => {
    resultImage.current.cache();
  };

  const drawAnswers = (answers, ansCrops) => {
    const stage = resultImage.current.getStage();
    const layer = resultImage.current.getLayer();
    const image = resultImage.current.getImage();
    console.log(layer);
    /* const { width: imageWidth, height: imageHeight } = image.attrs;
    const { width: stageWidth, height: stageHeight } = stage.attrs;
    const { width: layerWidth, height: layerHeight } = layer.attrs; */
    const answer = answers.flat();
    const { widthRatio, heightRatio } = state;
    ansCrops.flat().map((item, index) => {
      const { w, h, x, y } = item;
      const rect = new Konva.Rect({
        x: Math.floor(x * widthRatio),
        y: Math.floor(y * heightRatio) - 4,
        width: Math.ceil(w * widthRatio),
        height: Math.ceil(h * heightRatio),
        stroke: 'rgba(0,255,255,2)',
        strokeWidth: 1,
        fill: '',
        opacity: 0.7,
        draggable: false
      });
      layer.add(rect);
      rect.on('mouseover', () => {
        stage.container().style.cursor = 'pointer';
      });
      rect.on('click', () => {
        console.log(answer[index]);
        console.log(stage);
      });
    });
    stage.draw();
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
          borderRadius: '8px'
        }}
      >
        <Layer>
          <Image
            ref={resultImage}
            image={image}
            alt="Result Image"
            filters={[Konva.Filters.Brighten]}
            brightness={0.1}
            shadowBlur={8}
            width={width}
            height={height}
            onClick={() => console.log(resultImage)}
          />
        </Layer>
      </Stage>
      {/* <Button variant="contained" onClick={viewCrops}>
        Set Crops
      </Button> */}
    </div>
  );
}

export default Feedback;
