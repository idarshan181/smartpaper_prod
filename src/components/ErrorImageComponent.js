import Image from 'next/image';

const ErrorImageComponent = props => {
  const { requestArray, errorProps } = props;
  // console.log('req err', requestArray, errorProps);

  const newFoo = errorProps.map((element, id) => {
    // errImages.push(
    let errImg = requestArray.find(
      errImgElement => errImgElement.requestId === element.errorId
    );
    console.log('err', errImg.imageSource);
    return (
      <div key={id}>
        <Image
          src={errImg.imageSource}
          key={id}
          alt={`error image ${id}`}
          className="outputImage"
          width={2}
          height={3}
          position="relative"
          layout="responsive"
          objectFit="contain"
        />
      </div>
    );

    // );
  });
  // console.log("error",errImages);
  return <div>{newFoo}</div>;
};

export default ErrorImageComponent;
