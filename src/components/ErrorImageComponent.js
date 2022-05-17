import Image from "next/image";

const ErrorImageComponent = props => {
  const { requestArray, errorProps, deleteErrorImg } = props;
  // console.log("req array", requestArray);
  const newFoo = errorProps.map((element, id) => {
    let errImg = requestArray.find(
      errImgElement => errImgElement.requestId === element.errorId
    );

    return (
      <div className="error image" key={id} style={{ border: '1px solid red' }}>
        
        <div style={{ display: 'flex', height: '20px', textAlign:'center', justifyContent:'space-between', alignItems:'center' }}>
          <span> Error</span>
          <button
            onClick={() => {
              deleteErrorImg(errImg)
            }}
            style={{ borderRadius: '50px',  border:'1px solid white',cursor:"pointer" }}
          >
            x
          </button>
        </div>
        <Image
          src={errImg.imageSource}
          key={id}
          alt={`error image ${id}`}
          className="outputImage"
          width={2}
          height={1}
          position="relative"
          layout="responsive"
          objectFit="contain"
        />
        {/* </Alert> */}
        {/* </Box> */}
      </div>
    );
  });
  return <div>{newFoo}</div>;
};

export default ErrorImageComponent;
