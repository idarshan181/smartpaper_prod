/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';

const Canvas = ({ url, height, width, metadata, ...props }) => {
  const canvasRef = useRef(null);
  const [state, setState] = useState({
    heightRatio: 0,
    widthRatio: 0,
    ansBox: [],
    ans: []
  });
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    // ctx.canvas.style.zIndex = 1004;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    let answers = [];
    let ansBox = [];
    if (metadata.length !== 0) {
      metadata.data.map((item, index) => {
        answers.push(item.ans);
        ansBox.push(item.ansBox);
      });
      drawAnswers(ctx, answers, ansBox);
    }

    return null;
  }, [url, metadata]);

  const drawAnswers = (ctx, answers, ansCrops) => {
    let img = new Image();

    img.height = height;
    img.width = width;
    img.src = url;
    // img.style.zIndex = 1005;
    img.style.objectFit = 'contain';

    img.addEventListener('load', () => {
      ctx.drawImage(img, 0, 0, width, height);
      ctx.font = '20px sans-serif';
      ctx.filter = 'blur(0)';
      ctx.fillStyle = '#000';
      // answers.map((item, index) => {
      //   let ansBox = ansCrops[index];
      //   let ans = item;
      //   ctx.fillText(ans, ansBox[0] * (width/960), ansBox[1] * (height/1280));
      // });
    });
  };

  return (
    <div>
      <canvas ref={canvasRef} width={width} height={height}></canvas>
    </div>
  );
};

export default Canvas;
